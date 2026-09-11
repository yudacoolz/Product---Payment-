import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),

  description: z.string().trim().min(1, "Description is required"),

  price: z.coerce.number().positive("Price must be greater than 0"),
  jumlah: z.coerce.number().positive("Jumlah must be greater than 0"),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductDto = z.infer<typeof createProductSchema>;

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
