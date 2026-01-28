import { z } from 'zod';

export const CompanyReadDtoSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().optional(),
  website: z.union([z.null(), z.string()]).optional(),
  industry: z.union([z.null(), z.string()]).optional(),
  sizeRange: z.union([z.null(), z.string()]).optional(),
  notes: z.union([z.null(), z.string()]).optional(),
});
