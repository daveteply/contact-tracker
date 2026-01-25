import { z } from 'zod';

export const ContactInputSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  title: z.string().optional(),
  email: z.email('Myst be a valid email').optional(),
  phoneNumber: z.string().optional(),
  linkedInUrl: z.url('Must be a valid URL').optional(),
  isPrimaryRecruiter: z.boolean().default(false).optional(),
  notes: z.string().optional(),
});
export const ContactUpdateSchema = ContactInputSchema.partial();

export type ContactInput = z.infer<typeof ContactInputSchema>;
