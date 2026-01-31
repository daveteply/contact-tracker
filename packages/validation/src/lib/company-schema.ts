import { z } from 'zod';

// Helper to convert empty strings to undefined (for create)
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

// For updates, allow empty strings to be sent to backend for clearing fields
// Also handle null values from the backend
const updateOptionalString = z
  .literal('')
  .or(z.string().min(1))
  .or(z.null())
  .optional()
  .transform((val) => (val === null ? undefined : val));

const updateOptionalUrl = z
  .preprocess(
    (val) => val,
    z.literal('').or(z.string().url('Must be a valid URL').max(2048)).or(z.null()),
  )
  .optional()
  .transform((val) => (val === null ? undefined : val));

const updateName = z
  .string()
  .min(1, 'Company name is required')
  .max(100)
  .or(z.null())
  .optional()
  .transform((val) => (val === null ? undefined : val));

export const CompanyUpdateSchema = z
  .object({
    name: updateName,
    website: updateOptionalUrl,
    industry: updateOptionalString,
    sizeRange: updateOptionalString,
    notes: updateOptionalString,
  })
  .partial();

export type CompanyCreate = z.infer<typeof CompanyCreateSchema>;
export type CompanyUpdate = z.infer<typeof CompanyUpdateSchema>;
