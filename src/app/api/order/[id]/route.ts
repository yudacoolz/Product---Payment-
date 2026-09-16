import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: {
      order_id: id,
    },
  });

  if (!order) {
    return NextResponse.json(
      {
        message: "Order dengan Id Tidak Ditemukan",
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json(order);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const body = await request.json();

    const updateOrder = await prisma.order.update({
      where: {
        order_id: id,
      },

      data: {
        status: body.status,
      },
    });

    return NextResponse.json(updateOrder);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "gagal update order",
      },
      {
        status: 500,
      },
    );
  }
}
