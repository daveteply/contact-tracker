import { z } from 'zod';

export const ReminderCreateDtoSchema = z.object({
  eventId: z.number().int().optional(),
  remindAt: z.string().datetime({ offset: true }).optional(),
});
