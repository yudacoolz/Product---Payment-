import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface PaginationDto {
  page: number;
  limit: number;
}

interface Meta {
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  total: number;
  totalPages: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const skip = (page - 1) * limit;
  try {
    const orders = await prisma.order.findMany({
      take: limit,
      skip: skip,
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

    const totalOrders = await prisma.order.findMany();

    const totalData = totalOrders.length;
    const totalPages = totalData / limit;

    const meta: Meta = {
      page,
      limit,
      totalPages,
      total: totalData,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return NextResponse.json({ data: orders, meta });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "Failed to get Orders",
      },
      {
        status: 500,
      },
    );
  }
}
