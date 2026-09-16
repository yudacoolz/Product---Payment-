import z from "zod";

const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  jumlah: z.number(),
  price: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

const bankTransferSchema = z.object({
  bank: z.string(),
});

export const OrderItemsSchema = z.array(
  z.object({
    order_Item_id: z.coerce
      .number()
      .int()
      .positive("ID must be greater than 0"),
    jumlah: z.coerce.number().int().positive("Quantity must be greater than 0"),
    product: productSchema,
  }),
);

// { ** SNAP ** }
export const createOrderSchema = z.object({
  orderItems: OrderItemsSchema,
  payment_type: z.string().trim().min(1, "Name is required").max(100),
  bank_transfer: bankTransferSchema,
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;

// { ** CORE API ** }

// export const createOrderSchema = z.object({
//   orderItems: OrderItemsSchema,
//   // email: z.email("Email is not valid").optional(),
//   payment_type: z.string().trim().min(1, "Name is required").max(100),
//   bank_transfer: bankTransferSchema,
// });

// export type CreateOrderDto = z.infer<(typeof createOrderSchema)>;

export interface CreateOrderResponse {
  token: string;
  redirectUrl: string;
  orderId: string;
  gross_amount: number;
}
