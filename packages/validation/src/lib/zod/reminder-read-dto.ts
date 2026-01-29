import { z } from 'zod';

export const ReminderReadDtoSchema = z.object({
  id: z.number().int().optional(),
  eventId: z.number().int().optional(),
  remindAt: z.string().datetime({ offset: true }).optional(),
  completedAt: z.union([z.null(), z.string().datetime({ offset: true })]).optional(),
});

export type ReminderReadInput = z.infer<typeof ReminderReadDtoSchema>;
