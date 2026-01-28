import { z } from 'zod';

export const ContactReadDtoSchema = z.object({
  id: z.number().int().optional(),
  companyId: z.union([z.null(), z.number().int()]).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  title: z.union([z.null(), z.string()]).optional(),
  email: z.union([z.null(), z.string()]).optional(),
  phoneNumber: z.union([z.null(), z.string()]).optional(),
  linkedInUrl: z.union([z.null(), z.string()]).optional(),
  isPrimaryRecruiter: z.union([z.null(), z.boolean()]).optional(),
  notes: z.union([z.null(), z.string()]).optional(),
});
