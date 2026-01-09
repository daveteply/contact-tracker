import { z } from 'zod';

export const CompanyInputSchema = z.object({
  name: z.string().min(1),
  website: z.string().url().optional().or(z.literal('')),
  industry: z.string().optional(),
  sizeRange: z.string().optional(),
  notes: z.string().optional(),
});
export const CompanyUpdateSchema = CompanyInputSchema.partial();

export type CompanyInput = z.infer<typeof CompanyInputSchema>;
