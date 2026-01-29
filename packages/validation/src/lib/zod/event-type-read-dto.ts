import { z } from 'zod';

export const EventTypeReadDtoSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().optional(),
  category: z.string().optional(),
  isSystemDefined: z.boolean().optional(),
});

export type EventTypeReadInput = z.infer<typeof EventTypeReadDtoSchema>;
