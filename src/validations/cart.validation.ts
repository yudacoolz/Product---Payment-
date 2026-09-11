import { z } from "zod";

export const createCartSchema = z.object({
  productId: z.coerce.number().positive("productId must available"),
  jumlah: z.coerce.number().positive("Jumlah must be greater than 0"),
});

export const updateCartSchema = createCartSchema.partial();

export type CreateCartDto = z.infer<typeof createCartSchema>;

export type UpdateCartDto = z.infer<typeof updateCartSchema>;
