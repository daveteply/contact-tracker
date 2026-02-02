import z from 'zod';

/** Collapse empty string → undefined for create schemas */
export const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => (val === '' ? undefined : val), schema);

/** Update: allow '' | string(min 1) | null, collapse null → undefined */
export const updateOptionalString = (maxLength: number) =>
  z
    .literal('')
    .or(z.string().min(1).max(maxLength))
    .or(z.null())
    .optional()
    .transform((val) => (val === null ? undefined : val));

/** Update: allow '' | valid-url | null, collapse null → undefined */
export const updateOptionalUrl = (maxLength: number) =>
  z
    .preprocess(
      (val) => val,
      z.literal('').or(z.string().url('Must be a valid URL').max(maxLength)).or(z.null()),
    )
    .optional()
    .transform((val) => (val === null ? undefined : val));

/** Update: allow '' | valid-email | null, collapse null → undefined */
export const updateOptionalEmail = (maxLength: number) =>
  z
    .preprocess(
      (val) => val,
      z.literal('').or(z.string().email('Must be a valid email').max(maxLength)).or(z.null()),
    )
    .optional()
    .transform((val) => (val === null ? undefined : val));

/** Update: allow '' | valid-phone | null, collapse null → undefined.
 *  Uses a simple E.164-ish regex; tighten as needed for your audience. */
export const phoneRegex = /^\+?[\d\s\-().]{1,16}$/;
export const updateOptionalPhone = (maxLength: number) =>
  z
    .preprocess(
      (val) => val,
      z
        .literal('')
        .or(z.string().max(maxLength).regex(phoneRegex, 'Must be a valid phone number'))
        .or(z.null()),
    )
    .optional()
    .transform((val) => (val === null ? undefined : val));

/** Update: allow true | false | null, collapse null → undefined */
export const updateOptionalBoolean = z
  .boolean()
  .or(z.null())
  .optional()
  .transform((val) => (val === null ? undefined : val));

export const EntitySelectionSchema = z.object({
  id: z.number().optional(),
  isNew: z.boolean(),
  displayValue: z.string().optional(),
});

// Specific shape for Company in a selection context
export const CompanySelectionSchema = EntitySelectionSchema.extend({
  name: z.string().min(1, 'Company name is required'),
});

export const updateName = (maxLength: number) =>
  z
    .string()
    .min(1)
    .max(maxLength)
    .or(z.null())
    .optional()
    .transform((val) => (val === null ? undefined : val));
