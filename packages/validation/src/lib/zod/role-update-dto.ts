import { z } from 'zod';

export const RoleUpdateDtoSchema = z.object({
  companyId: z.union([z.null(), z.number().int()]).optional(),
  company: z
    .union([
      z.null(),
      z.object({
        name: z.union([z.null(), z.string().max(100)]).optional(),
        website: z.union([z.null(), z.string().url().max(2048)]).optional(),
        industry: z.union([z.null(), z.string().max(100)]).optional(),
        sizeRange: z.union([z.null(), z.string().max(100)]).optional(),
        notes: z.union([z.null(), z.string()]).optional(),
      }),
    ])
    .optional(),
  title: z.union([z.null(), z.string().max(100)]).optional(),
  jobPostingUrl: z.union([z.null(), z.string().url().max(2048)]).optional(),
  location: z.union([z.null(), z.string().max(100)]).optional(),
  level: z
    .union([z.literal('EngineeringManager'), z.literal('StaffEngineer'), z.literal(null)])
    .optional(),
});
