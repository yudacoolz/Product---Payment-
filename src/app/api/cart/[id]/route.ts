import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    console.log("body patch cart item : ", body);

    const cartItem = await prisma.cartItem.update({
      where: {
        cartItemId: Number(id),
      },
      data: {
        jumlah: body,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to update cart item",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    await prisma.cartItem.delete({
      where: {
        cartItemId: Number(id),
      },
    });

    return NextResponse.json({
      message: "Cart item deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to delete cart item",
      },
      {
        status: 500,
      },
    );
  }
}
