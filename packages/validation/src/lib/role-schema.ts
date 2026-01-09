import { z } from 'zod';
import { RoleLevelSchema } from './enum-schema';

export const RoleInputSchema = z.object({
  companyId: z.number().optional(),
  title: z.string().min(1),
  jobPostingUrl: z.string().url().optional().or(z.literal('')),
  location: z.string().optional(),
  level: RoleLevelSchema,
});
export const RoleUpdateSchema = RoleInputSchema.partial();

export type RoleInput = z.infer<typeof RoleInputSchema>;
