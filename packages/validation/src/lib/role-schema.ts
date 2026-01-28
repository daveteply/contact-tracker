import { z } from 'zod';
import { RoleLevelSchema } from './enum-schema';

export const RoleInputSchema = z.object({
  company: z.object(
    {
      id: z.number().optional(),
      name: z.string().min(1),
      isNew: z.boolean(),
    },
    "Company can't be empty",
  ),
  title: z.string().min(1),
  jobPostingUrl: z.url('Must be a valid URL').optional(),
  location: z.string().optional(),
  level: RoleLevelSchema,
});

export const RoleUpdateSchema = RoleInputSchema.partial();

export type RoleInput = z.infer<typeof RoleInputSchema>;

export type RoleFormValues = z.input<typeof RoleInputSchema>;
