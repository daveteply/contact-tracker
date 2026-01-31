import { z } from 'zod';

// Helper to convert empty strings to undefined
const emptyToUndefined = z.preprocess(
  (val) => (val === '' ? undefined : val),
  z.string().max(100).optional(),
);

export const CompanyCreateSchema = z.object({
  name: z.string().min(1, 'Company name is required').max(100),
  website: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().url('Must be a valid URL').max(2048).optional(),
  ),
  industry: emptyToUndefined,
  sizeRange: emptyToUndefined,
  notes: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional()),
});

export const CompanyUpdateSchema = CompanyCreateSchema.partial();

export type CompanyCreate = z.infer<typeof CompanyCreateSchema>;
export type CompanyUpdate = z.infer<typeof CompanyUpdateSchema>;
