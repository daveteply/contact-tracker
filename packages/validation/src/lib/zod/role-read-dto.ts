import { z } from 'zod';

export const RoleReadDtoSchema = z.object({
  id: z.number().int().optional(),
  companyId: z.union([z.null(), z.number().int()]).optional(),
  company: z
    .union([
      z.null(),
      z.object({
        id: z.number().int().optional(),
        name: z.string().optional(),
        website: z.union([z.null(), z.string()]).optional(),
        industry: z.union([z.null(), z.string()]).optional(),
        sizeRange: z.union([z.null(), z.string()]).optional(),
        notes: z.union([z.null(), z.string()]).optional(),
      }),
    ])
    .optional(),
  title: z.string().optional(),
  jobPostingUrl: z.union([z.null(), z.string()]).optional(),
  location: z.union([z.null(), z.string()]).optional(),
  level: z.enum(['EngineeringManager', 'StaffEngineer']).optional(),
});

export type RoleReadInput = z.infer<typeof RoleReadDtoSchema>;
