import { z } from 'zod';

export const ReminderInputSchema = z.object({
  eventId: z.number(),
  remindAt: z.date().or(z.string().datetime()),
  completedAt: z.date().or(z.string().datetime()).optional(),
});
export const ReminderUpdateSchema = ReminderInputSchema.partial().required({
  eventId: true,
});

export type ReminderInput = z.infer<typeof ReminderInputSchema>;
