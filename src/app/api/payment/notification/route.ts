import { NextRequest, NextResponse } from "next/server";
import Midtrans from "midtrans-client";
import { prisma } from "@/lib/prisma";
import { success } from "zod";

const coreApi = new Midtrans.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("req utk notif : ", body);

    const statusResponse = await coreApi.transaction.notification(body);
    console.log("statusResponse : ", statusResponse);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log("Order ID:", orderId);
    console.log("Transaction status:", transactionStatus);
    console.log("fraudStatus status:", fraudStatus);

    if (transactionStatus === "settlement") {
      await prisma.order.update({
        where: { order_id: orderId },
        data: {
          status: "PAID",
        },
      });
    }

    if (transactionStatus === "expire") {
      await prisma.order.update({
        where: { order_id: orderId },
        data: {
          status: "EXPIRED",
        },
      });
    }

    if (transactionStatus === "deny" || transactionStatus === "cancel") {
      await prisma.order.update({
        where: { order_id: orderId },
        data: {
          status: "EXPIRED",
        },
      });
    }
    const order = await prisma.order.findUnique({
      where: { order_id: orderId },
    });

    // return NextResponse.json({ received: true });
    return NextResponse.json({
      success: true,
      order_id: orderId,
      status: order?.status,
      message: "Success update",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 500,
    });
  }
}
