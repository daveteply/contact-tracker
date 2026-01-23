import { z } from 'zod';

export const CompanyInputSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  website: z.url('Must be a valid URL').nullish().or(z.literal('')),
  industry: z.string().nullish(),
  sizeRange: z.string().nullish(),
  notes: z.string().nullish(),
});
export const CompanyUpdateSchema = CompanyInputSchema.partial();

export type CompanyInput = z.infer<typeof CompanyInputSchema>;
