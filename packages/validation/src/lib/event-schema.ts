import { z } from 'zod';
import { DirectionTypeSchema, SourceTypeSchema } from './enum-schema';
import {
  CompanySelectionSchema,
  ContactSelectionSchema,
  RoleSelectionSchema,
  updateOptionalString,
} from './helpers/schema-helpers';

export const EventCreateSchema = z.object({
  company: CompanySelectionSchema.or(z.null()).optional(),
  contact: ContactSelectionSchema.or(z.null()).optional(),
  role: RoleSelectionSchema.or(z.null()).optional(),
  eventTypeId: z.number('Select an event type'),
  occurredAt: z.coerce.date('Must be a valid date'),
  summary: z.string().optional(),
  details: z.string().optional(),
  source: SourceTypeSchema,
  direction: DirectionTypeSchema,
});

export const EventUpdateSchema = z
  .object({
    company: CompanySelectionSchema.or(z.null()).optional(),
    contact: ContactSelectionSchema.or(z.null()).optional(),
    role: RoleSelectionSchema.or(z.null()).optional(),
    eventTypeId: z.number('Select an event type'),
    occurredAt: z.coerce.date('Must be a valid date'),
    summary: updateOptionalString(256),
    details: updateOptionalString(1024),
    source: SourceTypeSchema,
    direction: DirectionTypeSchema,
  })
  .partial();

export type EventCreate = z.infer<typeof EventCreateSchema>;
export type EventUpdate = z.infer<typeof EventUpdateSchema>;

// export type EventFormValues = z.input<typeof EventInputSchema>;
