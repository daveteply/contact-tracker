import { z } from 'zod';

export const EventTypeCreateDtoSchema = z.object({
  id: z.number().int(),
  name: z.string().max(100),
  category: z.union([z.null(), z.string().max(100)]).optional(),
  isSystemDefined: z.boolean(),
});

export type EventTypeCreateInput = z.infer<typeof EventTypeCreateDtoSchema>;
