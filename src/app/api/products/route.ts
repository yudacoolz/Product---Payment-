import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";
import { createProductSchema } from "@/validations/product.validation";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to fetch products",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = createProductSchema.parse(body);

    const product = await prisma.product.create({
      data: validatedData,
    });

    return NextResponse.json(product, {
      status: 201,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid product data",
          errors: error.issues,
        },
        {
          status: 400,
        },
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to create product",
      },
      {
        status: 500,
      },
    );
  }
}
