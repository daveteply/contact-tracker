import { z } from 'zod';

export const EventCreateDtoSchema = z.object({
  companyId: z.union([z.null(), z.number().int()]).optional(),
  newCompany: z
    .union([
      z.null(),
      z.object({
        name: z.string().max(100).optional(),
        website: z.union([z.null(), z.string().url().max(2048)]).optional(),
        industry: z.union([z.null(), z.string().max(100)]).optional(),
        sizeRange: z.union([z.null(), z.string().max(100)]).optional(),
        notes: z.union([z.null(), z.string()]).optional(),
      }),
    ])
    .optional(),
  contactId: z.union([z.null(), z.number().int()]).optional(),
  newContact: z
    .union([
      z.null(),
      z.object({
        companyId: z.union([z.null(), z.number().int()]).optional(),
        firstName: z.string().max(100).optional(),
        lastName: z.string().max(100).optional(),
        title: z.union([z.null(), z.string().max(100)]).optional(),
        email: z.union([z.null(), z.string().email().max(254)]).optional(),
        phoneNumber: z.union([z.null(), z.string().max(16)]).optional(),
        linkedInUrl: z.union([z.null(), z.string().url().max(2048)]).optional(),
        isPrimaryRecruiter: z.union([z.null(), z.boolean()]).optional(),
        notes: z.union([z.null(), z.string()]).optional(),
      }),
    ])
    .optional(),
  roleId: z.union([z.null(), z.number().int()]).optional(),
  newRole: z
    .union([
      z.null(),
      z.object({
        companyId: z.union([z.null(), z.number().int()]).optional(),
        company: z
          .union([
            z.null(),
            z.object({
              name: z.string().max(100).optional(),
              website: z.union([z.null(), z.string().url().max(2048)]).optional(),
              industry: z.union([z.null(), z.string().max(100)]).optional(),
              sizeRange: z.union([z.null(), z.string().max(100)]).optional(),
              notes: z.union([z.null(), z.string()]).optional(),
            }),
          ])
          .optional(),
        title: z.string().max(100).optional(),
        jobPostingUrl: z.union([z.null(), z.string().url().max(2048)]).optional(),
        location: z.union([z.null(), z.string().max(100)]).optional(),
        level: z.enum(['EngineeringManager', 'StaffEngineer']).optional(),
      }),
    ])
    .optional(),
  eventTypeId: z.number().int().optional(),
  eventType: z
    .union([
      z.null(),
      z.object({
        id: z.number().int().optional(),
        name: z.string().optional(),
        category: z.string().optional(),
        isSystemDefined: z.boolean().optional(),
      }),
    ])
    .optional(),
  occurredAt: z.string().datetime({ offset: true }).optional(),
  summary: z.union([z.null(), z.string().max(256)]).optional(),
  details: z.union([z.null(), z.string().max(1024)]).optional(),
  source: z.enum(['Email', 'LinkedIn', 'Website', 'Recruiter', 'Referral']).optional(),
  direction: z.enum(['Inbound', 'Outbound']).optional(),
});

export type EventCreateInput = z.infer<typeof EventCreateDtoSchema>;
