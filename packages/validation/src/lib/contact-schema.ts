import { z } from 'zod';
import {
  emptyToUndefined,
  phoneRegex,
  updateOptionalBoolean,
  updateOptionalEmail,
  updateOptionalPhone,
  updateOptionalString,
  updateOptionalUrl,
} from './helpers/schema-helpers';

export const ContactCreateSchema = z.object({
  companyId: z
    .number()
    .int()
    .positive()
    .or(z.null())
    .optional()
    .transform((val) => (val === null ? undefined : val)),

  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),

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
});

/** For required-on-create string fields that become optional on update */
const updateName = (maxLength: number) =>
  z
    .string()
    .min(1)
    .max(maxLength)
    .or(z.null())
    .optional()
    .transform((val) => (val === null ? undefined : val));

export const ContactUpdateSchema = z
  .object({
    companyId: z
      .number()
      .int()
      .positive()
      .or(z.null())
      .optional()
      .transform((val) => (val === null ? undefined : val)),

    firstName: updateName(100),
    lastName: updateName(100),

    title: updateOptionalString(100),
    email: updateOptionalEmail(254),
    phoneNumber: updateOptionalPhone(16),
    linkedInUrl: updateOptionalUrl(2048),

    isPrimaryRecruiter: updateOptionalBoolean,

    notes: updateOptionalString(255), // no explicit max in DTO; pick a reasonable default
  })
  .partial();

export type ContactCreate = z.infer<typeof ContactCreateSchema>;
export type ContactUpdate = z.infer<typeof ContactUpdateSchema>;
