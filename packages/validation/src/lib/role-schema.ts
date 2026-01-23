import { z } from 'zod';
import { RoleLevelSchema } from './enum-schema';

export const RoleInputSchema = z.object({
  companyId: z.number().nullish(),
  title: z.string().min(1),
  jobPostingUrl: z.string().url().nullish().or(z.literal('')),
  location: z.string().nullish(),
  level: RoleLevelSchema,
});
export const RoleUpdateSchema = RoleInputSchema.partial();

export type RoleInput = z.infer<typeof RoleInputSchema>;
