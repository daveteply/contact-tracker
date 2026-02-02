import { z } from 'zod';
import {
  CompanySelectionSchema,
  emptyToUndefined,
  phoneRegex,
  updateOptionalBoolean,
  updateOptionalEmail,
  updateOptionalPhone,
  updateOptionalString,
  updateOptionalUrl,
  updateRequiredString,
} from './helpers/schema-helpers';

const contactCreateBase = {
  title: emptyToUndefined(z.string().max(100).optional()),
  email: emptyToUndefined(z.email('Must be a valid email').max(254).optional()),
  phoneNumber: emptyToUndefined(
    z.string().max(16).regex(phoneRegex, 'Must be a valid phone number').optional(),
  ),
  linkedInUrl: emptyToUndefined(z.url('Must be a valid URL').max(2048).optional()),
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
  ...contactCreateBase,
});

export const ContactUpdateSchema = z
  .object({
    firstName: updateRequiredString(100, 'First name is required'),
    lastName: updateRequiredString(100, 'Last name is required'),
    title: updateOptionalString(100),
    email: updateOptionalEmail(254),
    phoneNumber: updateOptionalPhone(16),
    linkedInUrl: updateOptionalUrl(2048),
    isPrimaryRecruiter: updateOptionalBoolean,
    notes: updateOptionalString(500),
    company: CompanySelectionSchema.or(z.null()).optional(),
  })
  .partial();

export type ContactCreate = z.infer<typeof ContactCreateSchema>;
export type ContactUpdate = z.infer<typeof ContactUpdateSchema>;
