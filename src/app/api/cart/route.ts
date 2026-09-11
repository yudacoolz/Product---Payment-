import { prisma } from "@/lib/prisma";
import { createCartSchema } from "@/validations/cart.validation";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET() {
  try {
    const cart = await prisma.cart.findFirst({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    return NextResponse.json(cart);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Failed to fetch cart" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createCartSchema.parse(body);

    let cart = await prisma.cart.findFirst();
    if (!cart) {
      cart = await prisma.cart.create({ data: {} });
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        ...validatedData,
        cartId: cart.cartId,
      },
    });

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid cart data", errors: error.issues },
        { status: 400 },
      );
    }

    console.error(error);
    return NextResponse.json(
      { message: "Failed to create cart item" },
      { status: 500 },
    );
  }
}
