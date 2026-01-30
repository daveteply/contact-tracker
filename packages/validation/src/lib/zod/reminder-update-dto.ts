import { z } from 'zod';

export const ReminderUpdateDtoSchema = z.object({
  remindAt: z.union([z.null(), z.string().datetime()]).optional(),
  completedAt: z.union([z.null(), z.string().datetime()]).optional(),
});

export type ReminderUpdateInput = z.infer<typeof ReminderUpdateDtoSchema>;
