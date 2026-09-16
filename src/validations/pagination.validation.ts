import z from "zod";

export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
});

export type PaginationDto = z.infer<typeof paginationSchema>;
