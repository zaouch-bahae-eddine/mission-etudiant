import z from "zod";

export const paginationFilterSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
});

export type PaginationFilterDto = z.infer<typeof paginationFilterSchema>;
