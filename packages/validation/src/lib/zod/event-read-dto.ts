import { z } from 'zod';

export const EventReadDtoSchema = z.object({
  id: z.number().int().optional(),
  companyId: z.union([z.null(), z.number().int()]).optional(),
  contactId: z.union([z.null(), z.number().int()]).optional(),
  roleId: z.union([z.null(), z.number().int()]).optional(),
  eventTypeId: z.number().int().optional(),
  occurredAt: z.string().datetime({ offset: true }).optional(),
  summary: z.union([z.null(), z.string()]).optional(),
  details: z.union([z.null(), z.string()]).optional(),
  source: z.enum(['Email', 'LinkedIn', 'Website', 'Recruiter', 'Referral']).optional(),
  direction: z.enum(['Inbound', 'Outbound']).optional(),
});

export type EventReadInput = z.infer<typeof EventReadDtoSchema>;
