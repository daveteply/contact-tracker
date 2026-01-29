import { z } from 'zod';

export const ReminderUpdateDtoSchema = z.object({
  remindAt: z.union([z.null(), z.string().datetime({ offset: true })]).optional(),
  completedAt: z.union([z.null(), z.string().datetime({ offset: true })]).optional(),
});

export type ReminderUpdateInput = z.infer<typeof ReminderUpdateDtoSchema>;
