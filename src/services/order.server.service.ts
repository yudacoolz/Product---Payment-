import { OrderStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

// Server-only order helpers. Do not import this file from Client Components.
export const searchStatusOrder = async (status: OrderStatus) => {
  const res = await prisma.order.findMany({
    where: {
      status: {
        equals: status,
      },
    },
    select: {
      order_id: true,
      status: true,
      gross_amount: true,
      createdAt: true,
      payment_name: true,
      payment_type: true,
      items: true,
    },
    take: 10,
  });

  return res;
};
