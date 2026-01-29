import { z } from 'zod';

export const ReminderCreateDtoSchema = z.object({
  eventId: z.number().int(),
  remindAt: z.string().datetime({ offset: true }),
});

export type ReminderCreateInput = z.infer<typeof ReminderCreateDtoSchema>;
