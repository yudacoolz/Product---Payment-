import { prisma } from "@/lib/prisma";

// Server-only product helpers. Do not import this file from Client Components.
export const searchProduct = async (query: string) => {
  const res = await prisma.product.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      jumlah: true,
    },
    take: 10,
  });

  return res;
};

export const searchPrice = async (priceMin?: number, priceMax?: number) => {
  const res = await prisma.product.findMany({
    where: {
      price: {
        gte: priceMin,
        lte: priceMax,
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      jumlah: true,
    },
    take: 10,
  });

  return res;
};
