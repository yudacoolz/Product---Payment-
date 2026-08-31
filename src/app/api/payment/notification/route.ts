import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { OrderStatus, Prisma } from "@/generated/prisma/client";

interface MidtransNotification {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  transaction_id?: string;
  payment_type?: string;
  fraud_status?: string;
  settlement_time?: string;
  transaction_time?: string;
}

function isNotification(body: unknown): body is MidtransNotification {
  if (typeof body !== "object" || body === null) {
    return false;
  }

  const value = body as Record<string, unknown>;

  return (
    typeof value.order_id === "string" &&
    typeof value.status_code === "string" &&
    typeof value.gross_amount === "string" &&
    typeof value.signature_key === "string" &&
    typeof value.transaction_status === "string"
  );
}

/**
 * Midtrans signs every notification with
 * sha512(order_id + status_code + gross_amount + serverKey).
 * Without this check anyone who knows an order id could mark it paid.
 */
function hasValidSignature(
  notification: MidtransNotification,
  serverKey: string,
) {
  const expected = createHash("sha512")
    .update(
      notification.order_id +
        notification.status_code +
        notification.gross_amount +
        serverKey,
    )
    .digest("hex");

  const received = notification.signature_key.toLowerCase();

  if (received.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

function mapStatus(notification: MidtransNotification): OrderStatus {
  switch (notification.transaction_status) {
    case "capture":
      // A captured card payment is only really ours once fraud review passes.
      if (notification.fraud_status === "challenge") {
        return OrderStatus.CHALLENGE;
      }

      return notification.fraud_status === "deny"
        ? OrderStatus.FAILED
        : OrderStatus.PAID;

    case "settlement":
      return OrderStatus.PAID;

    case "pending":
      return OrderStatus.PENDING;

    case "deny":
    case "failure":
      return OrderStatus.FAILED;

    case "cancel":
      return OrderStatus.CANCELLED;

    case "expire":
      return OrderStatus.EXPIRED;

    case "refund":
    case "partial_refund":
      return OrderStatus.REFUNDED;

    default:
      return OrderStatus.PENDING;
  }
}

// Notifications can arrive out of order and are retried, so only allow
// transitions that make sense instead of blindly overwriting.
function canTransition(current: OrderStatus, next: OrderStatus) {
  if (current === next) {
    return true;
  }

  if (current === OrderStatus.PENDING || current === OrderStatus.CHALLENGE) {
    return true;
  }

  if (current === OrderStatus.PAID) {
    return next === OrderStatus.REFUNDED;
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    if (!serverKey) {
      console.error("MIDTRANS_SERVER_KEY is not configured");

      return NextResponse.json(
        {
          message: "Payment provider is not configured",
        },
        {
          status: 500,
        },
      );
    }

    const body: unknown = await request.json();

    if (!isNotification(body)) {
      return NextResponse.json(
        {
          message: "Invalid notification payload",
        },
        {
          status: 400,
        },
      );
    }

    if (!hasValidSignature(body, serverKey)) {
      console.warn("Rejected notification with a bad signature", body.order_id);

      return NextResponse.json(
        {
          message: "Invalid signature",
        },
        {
          status: 403,
        },
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        orderId: body.order_id,
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          message: "Order not found",
        },
        {
          status: 404,
        },
      );
    }

    // Defence in depth: the signature already covers the amount, but a
    // mismatch here means something is wrong regardless.
    if (Math.round(Number(body.gross_amount)) !== order.grossAmount) {
      console.warn("Notification amount mismatch", body.order_id);

      return NextResponse.json(
        {
          message: "Amount mismatch",
        },
        {
          status: 409,
        },
      );
    }

    const nextStatus = mapStatus(body);

    if (!canTransition(order.status, nextStatus)) {
      // Still a 200: the notification was valid, we just have nothing to do.
      // A non-2xx would make Midtrans retry forever.
      return NextResponse.json({
        message: "Ignored stale notification",
        status: order.status,
      });
    }

    const updated = await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: nextStatus,
        transactionId: body.transaction_id,
        paymentType: body.payment_type,
        fraudStatus: body.fraud_status,
        transactionStatus: body.transaction_status,
        paidAt:
          nextStatus === OrderStatus.PAID
            ? new Date(body.settlement_time ?? body.transaction_time ?? Date.now())
            : order.paidAt,
        rawNotification: body as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({
      message: "Notification processed",
      status: updated.status,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to process notification",
      },
      {
        status: 500,
      },
    );
  }
}
