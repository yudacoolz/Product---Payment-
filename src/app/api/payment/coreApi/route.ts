import { NextRequest, NextResponse } from "next/server";
import Midtrans from "midtrans-client";
import _ from "lodash";
import { prisma } from "@/lib/prisma";
import midtransClient from "midtrans-client";

const coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

enum Banks {
  bca = "bca",
  bni = "bni",
}

interface OrderItemRequest {
  order_Item_id: number;
  jumlah: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
}

interface OrderRequest {
  orderItems: OrderItemRequest[];
  payment_type: string;
  bank_transfer: {
    bank: Banks;
  };
}

export async function POST(req: NextRequest) {
  try {
    const data: OrderRequest = await req.json();

    if (!data || data.orderItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Order items not found",
        },
        { status: 400 },
      );
    }

    console.log("Selected items:", data);

    // --------------------------------
    // 1. Get actual products from DB
    // --------------------------------

    const productIds = data.orderItems.map((item) => item.product.id);

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    // --------------------------------
    // 2. Validate products
    // --------------------------------

    if (products.length !== data.orderItems.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Some products were not found",
        },
        { status: 400 },
      );
    }

    // --------------------------------
    // 3. Create order items
    // --------------------------------

    const orderItems = data.orderItems.map((item) => {
      const product = products.find(
        (product) => product.id === item.product.id,
      );

      if (!product) {
        throw new Error(`Product ${item.product.id} not found`);
      }

      return {
        productId: product.id,
        jumlah: item.jumlah,
        price: product.price,
      };
    });

    const paymentType = data.payment_type;
    const bank = data.bank_transfer.bank;

    // --------------------------------
    // 4. Calculate gross amount
    // --------------------------------

    const grossAmount = _.sumBy(orderItems, (item) => item.price * item.jumlah);

    console.log("Order items:", orderItems);
    console.log("Gross amount:", grossAmount);

    // --------------------------------
    // 5. Create Order + OrderItems
    // --------------------------------

    const order = await prisma.order.create({
      data: {
        gross_amount: grossAmount,

        items: {
          create: orderItems,
        },
        payment_type: paymentType,
        payment_name: bank,
      },

      include: {
        items: true,
      },
    });

    console.log("Created order:", order);

    // --------------------------------
    // 6. Create Midtrans item details
    // --------------------------------

    const itemDetails = order.items.map((item) => {
      const product = products.find((product) => product.id === item.productId);

      return {
        id: item.productId.toString(),
        name: product?.name ?? `Product ${item.productId}`,
        quantity: item.jumlah,
        price: Math.ceil(item.price),
      };
    });

    // --------------------------------
    // 7. Create Midtrans transaction
    // --------------------------------

    const parameter = {
      item_details: itemDetails,

      transaction_details: {
        order_id: order.order_id,
        gross_amount: Math.ceil(order.gross_amount),
      },

      payment_type: paymentType,
      bank_transfer: {
        bank: bank,
      },
    };

    console.log("Midtrans parameter:", parameter);

    const token = await coreApi.charge(parameter);

    // --------------------------------
    // 8. Return result
    // --------------------------------

    return NextResponse.json({
      success: true,
      orderId: order.order_id,
      status: order.status,
      grossAmount: order.gross_amount,
      token,
    });
  } catch (error) {
    console.error("Payment error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order/payment",
      },
      {
        status: 500,
      },
    );
  }
}
