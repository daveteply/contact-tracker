import { z } from 'zod';
import {
  updateRequiredString,
  updateOptionalString,
  updateOptionalUrl,
} from '../helpers/schema-helpers';

// Helper to convert empty strings to undefined (for create)
const emptyToUndefined = z.preprocess(
  (val) => (val === '' ? undefined : val),
  z.string().max(100).optional(),
);

export const CompanyCreateSchema = z.object({
  name: z.string().min(1, 'Company name is required').max(100),
  website: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.url('Must be a valid URL').max(2048).optional(),
  ),
  industry: emptyToUndefined,
  sizeRange: emptyToUndefined,
  notes: z.preprocess((val) => (val === '' ? undefined : val), z.string().optional()),
});

export const CompanyUpdateSchema = z
  .object({
    name: updateRequiredString(100, 'Company name is required'),
    website: updateOptionalUrl(2048),
    industry: updateOptionalString(100),
    sizeRange: updateOptionalString(100),
    notes: updateOptionalString(500),
  })
  .partial();

export type CompanyCreate = z.infer<typeof CompanyCreateSchema>;
export type CompanyUpdate = z.infer<typeof CompanyUpdateSchema>;
