import { z } from 'zod';

export const EventTypeInputSchema = z.object({
  id: z.number().nullish(),
  name: z.string().min(1),
  category: z.string().min(1),
  isSystemDefined: z.boolean().default(false),
});

export type EventTypeInput = z.infer<typeof EventTypeInputSchema>;
