import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadServiceSB } from "@/services/upload_supabase.service";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to fetch product",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        jumlah: body.jumlah,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to update product",
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

    const photosKeys = await prisma.photo.findMany({
      where: {
        refId: id,
      },
    });

    const pathKeys = photosKeys.map((item) => item.key);

    console.log("pathKeys.length : ", pathKeys.length);

    if (pathKeys.length > 0) {
      await uploadServiceSB.deleteByRefId(pathKeys);
    }

    await prisma.product.delete({
      where: {
        id: id,
      },
    });

    if (pathKeys.length > 0) {
      await prisma.photo.deleteMany({
        where: {
          refId: id,
        },
      });
    }

    return NextResponse.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to delete product",
      },
      {
        status: 500,
      },
    );
  }
}
