import { z } from 'zod';
import { Company } from '@contact-tracker/api-models';

const EventSchema = z.any();
const ContactSchema = z.any();
const RoleSchema = z.any();

export const CompanySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(255),
  website: z.string().url('Invalid URL format').optional().or(z.literal('')),
  industry: z.string().max(100).optional(),
  sizeRange: z.string().optional(),
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),

  // Arrays for the relationships
  events: z.array(EventSchema).default([]),
  contacts: z.array(ContactSchema).default([]),
  roles: z.array(RoleSchema).default([]),
}) satisfies z.ZodType<Partial<Company>>;

export type CompanyFormData = z.infer<typeof CompanySchema>;
