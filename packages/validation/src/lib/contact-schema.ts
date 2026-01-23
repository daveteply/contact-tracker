import { z } from 'zod';

export const ContactInputSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  title: z.string().nullish(),
  email: z.email('Email must be valid').nullish(),
  phoneNumber: z.string().nullish(),
  linkedInUrl: z.url('Url must be valid').nullish(),
  isPrimaryRecruiter: z.boolean().default(false),
  notes: z.string().nullish(),
});
export const ContactUpdateSchema = ContactInputSchema.partial();

export type ContactInput = z.infer<typeof ContactInputSchema>;
