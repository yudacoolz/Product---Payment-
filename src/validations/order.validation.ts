import z from "zod";

export const createOrderSchema = z.object({
  productId: z.coerce.number().int().positive("ID must be greater than 0"),
  quantity: z.coerce.number().int().positive("Quantity must be greater than 0"),
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.email("Email is not valid").optional(),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;

export interface CreateOrderResponse {
  token: string;
  redirectUrl: string;
  orderId: string;
  grossAmount: number;
}
