import { z } from 'zod';

export const CompanyCreateDtoSchema = z.object({
  name: z.string().max(100).optional(),
  website: z.union([z.null(), z.string().url().max(2048)]).optional(),
  industry: z.union([z.null(), z.string().max(100)]).optional(),
  sizeRange: z.union([z.null(), z.string().max(100)]).optional(),
  notes: z.union([z.null(), z.string()]).optional(),
});

export type CompanyCreateInput = z.infer<typeof CompanyCreateDtoSchema>;
