import { z } from 'zod';

export const ContactInputSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  title: z.string().optional(),
  email: z.email('Email must be valid').optional(),
  phoneNumber: z.string().optional(),
  linkedInUrl: z.url('Url must be valid').optional(),
  isPrimaryRecruiter: z.boolean().default(false),
  notes: z.string().optional(),
});
export const ContactUpdateSchema = ContactInputSchema.partial();

export type ContactInput = z.infer<typeof ContactInputSchema>;
