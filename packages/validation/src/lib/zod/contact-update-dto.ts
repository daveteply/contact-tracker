import { z } from 'zod';

export const ContactUpdateDtoSchema = z.object({
  companyId: z.union([z.null(), z.number().int()]).optional(),
  firstName: z.union([z.null(), z.string().max(100)]).optional(),
  lastName: z.union([z.null(), z.string().max(100)]).optional(),
  title: z.union([z.null(), z.string().max(100)]).optional(),
  email: z.union([z.null(), z.string().email().max(254)]).optional(),
  phoneNumber: z.union([z.null(), z.string().max(16)]).optional(),
  linkedInUrl: z.union([z.null(), z.string().url().max(2048)]).optional(),
  isPrimaryRecruiter: z.union([z.null(), z.boolean()]).optional(),
  notes: z.union([z.null(), z.string()]).optional(),
});
