import { z } from 'zod';
import {
  CompanySelectionSchema,
  emptyToUndefined,
  phoneRegex,
  updateName,
} from './helpers/schema-helpers';

const contactBase = {
  title: emptyToUndefined(z.string().max(100).optional()),
  email: emptyToUndefined(z.string().email('Must be a valid email').max(254).optional()),
  phoneNumber: emptyToUndefined(
    z.string().max(16).regex(phoneRegex, 'Must be a valid phone number').optional(),
  ),
  linkedInUrl: emptyToUndefined(z.string().url('Must be a valid URL').max(2048).optional()),
  isPrimaryRecruiter: z
    .boolean()
    .or(z.null())
    .optional()
    .transform((val) => (val === null ? undefined : val)),
  notes: emptyToUndefined(z.string().optional()),
  company: CompanySelectionSchema.or(z.null()).optional(),
};

export const ContactCreateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  ...contactBase,
});

export const ContactUpdateSchema = ContactCreateSchema.partial().extend({
  firstName: updateName(100),
  lastName: updateName(100),
});

export type ContactCreate = z.infer<typeof ContactCreateSchema>;
export type ContactUpdate = z.infer<typeof ContactUpdateSchema>;
