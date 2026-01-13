import { z } from 'zod';
import { DirectionTypeSchema, SourceTypeSchema } from './enum-schema';

export const EventInputSchema = z.object({
  companyId: z.number().optional(),
  contactId: z.number().optional(),
  roleId: z.number().optional(),
  eventTypeId: z.number(),
  occurredAt: z.coerce.date(),
  summary: z.string().optional(),
  details: z.string().optional(),
  source: SourceTypeSchema,
  direction: DirectionTypeSchema,
});

export const EventUpdateSchema = EventInputSchema.partial();

export type EventInput = z.infer<typeof EventInputSchema>;

export type EventFormValues = z.input<typeof EventInputSchema>;
