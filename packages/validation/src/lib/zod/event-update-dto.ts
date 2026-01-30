import { z } from 'zod';

export const EventUpdateDtoSchema = z.object({
  companyId: z.union([z.null(), z.number().int()]).optional(),
  updateCompany: z
    .union([
      z.null(),
      z.object({
        name: z.union([z.null(), z.string().max(100)]).optional(),
        website: z.preprocess(
          (v) => (v === '' ? undefined : v),
          z.union([z.null(), z.string().url().max(2048)]).optional(),
        ),
        industry: z.union([z.null(), z.string().max(100)]).optional(),
        sizeRange: z.union([z.null(), z.string().max(100)]).optional(),
        notes: z.union([z.null(), z.string()]).optional(),
      }),
    ])
    .optional(),
  contactId: z.union([z.null(), z.number().int()]).optional(),
  updateContact: z
    .union([
      z.null(),
      z.object({
        companyId: z.union([z.null(), z.number().int()]).optional(),
        firstName: z.union([z.null(), z.string().max(100)]).optional(),
        lastName: z.union([z.null(), z.string().max(100)]).optional(),
        title: z.union([z.null(), z.string().max(100)]).optional(),
        email: z.preprocess(
          (v) => (v === '' ? undefined : v),
          z.union([z.null(), z.string().email().max(254)]).optional(),
        ),
        phoneNumber: z.union([z.null(), z.string().max(16)]).optional(),
        linkedInUrl: z.preprocess(
          (v) => (v === '' ? undefined : v),
          z.union([z.null(), z.string().url().max(2048)]).optional(),
        ),
        isPrimaryRecruiter: z.union([z.null(), z.boolean()]).optional(),
        notes: z.union([z.null(), z.string()]).optional(),
      }),
    ])
    .optional(),
  roleId: z.union([z.null(), z.number().int()]).optional(),
  updateRole: z
    .union([
      z.null(),
      z.object({
        companyId: z.union([z.null(), z.number().int()]).optional(),
        company: z
          .union([
            z.null(),
            z.object({
              name: z.union([z.null(), z.string().max(100)]).optional(),
              website: z.preprocess(
                (v) => (v === '' ? undefined : v),
                z.union([z.null(), z.string().url().max(2048)]).optional(),
              ),
              industry: z.union([z.null(), z.string().max(100)]).optional(),
              sizeRange: z.union([z.null(), z.string().max(100)]).optional(),
              notes: z.union([z.null(), z.string()]).optional(),
            }),
          ])
          .optional(),
        title: z.union([z.null(), z.string().max(100)]).optional(),
        jobPostingUrl: z.preprocess(
          (v) => (v === '' ? undefined : v),
          z.union([z.null(), z.string().url().max(2048)]).optional(),
        ),
        location: z.union([z.null(), z.string().max(100)]).optional(),
        level: z.enum(['EngineeringManager', 'StaffEngineer', 'null']).optional(),
      }),
    ])
    .optional(),
  eventTypeId: z.union([z.null(), z.number().int()]).optional(),
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
  occurredAt: z.union([z.null(), z.string().datetime()]).optional(),
  summary: z.union([z.null(), z.string().max(256)]).optional(),
  details: z.union([z.null(), z.string().max(1024)]).optional(),
  source: z.enum(['Email', 'LinkedIn', 'Website', 'Recruiter', 'Referral', 'null']).optional(),
  direction: z.enum(['Inbound', 'Outbound', 'null']).optional(),
});

export type EventUpdateInput = z.infer<typeof EventUpdateDtoSchema>;
