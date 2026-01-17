import { z } from 'zod';
import { DirectionTypeSchema, SourceTypeSchema } from './enum-schema';

export const EventInputSchema = z.object({
  company: z.object(
    {
      id: z.number().optional(),
      name: z.string().min(1),
      isNew: z.boolean(),
    },
    "Company can't be empty",
  ),
  contact: z.object(
    {
      id: z.number().optional(),
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      isNew: z.boolean(),
    },
    "Contact can't be empty",
  ),
  role: z.object(
    {
      id: z.number().optional(),
      title: z.string().min(1),
      isNew: z.boolean(),
    },
    "Role can't be empty",
  ),
  eventTypeId: z.number('Select an event type'),
  occurredAt: z.coerce.date('Must be a valid date'),
  summary: z.string().optional(),
  details: z.string().optional(),
  source: SourceTypeSchema,
  direction: DirectionTypeSchema,
});

export const EventUpdateSchema = EventInputSchema.partial();

export type EventInput = z.infer<typeof EventInputSchema>;

export type EventFormValues = z.input<typeof EventInputSchema>;
