import { z } from 'zod';
import { DirectionTypeSchema, SourceTypeSchema } from './enum-schema';
import {
  CompanySelectionSchema,
  ContactSelectionSchema,
  emptyToUndefined,
  RoleSelectionSchema,
  updateOptionalString,
} from './helpers/schema-helpers';

export const EventCreateSchema = z.object({
  // Relations: Optional and Composable to match Role/Contact patterns
  company: CompanySelectionSchema.or(z.null()).optional(),
  contact: ContactSelectionSchema.or(z.null()).optional(),
  role: RoleSelectionSchema.or(z.null()).optional(),

  // Event specifics
  eventTypeId: z
    .number({ message: 'Select an event type' })
    .nullable()
    .refine((val) => val !== null && val > 0, {
      message: 'Select an event type',
    }),

  occurredAt: z.coerce.date({ message: 'Must be a valid date' }),

  // Text fields aligned with .NET MaxLength attributes
  summary: emptyToUndefined(z.string().max(256).optional()), // Matches [MaxLength(256)]
  details: emptyToUndefined(z.string().max(1024).optional()), // Matches [MaxLength(1024)]

  // Enums
  source: SourceTypeSchema.nullable().refine((val) => val !== null, {
    message: 'Select a source',
  }),
  direction: DirectionTypeSchema,
});

export const EventUpdateSchema = z
  .object({
    company: CompanySelectionSchema.or(z.null()).optional(),
    contact: ContactSelectionSchema.or(z.null()).optional(),
    role: RoleSelectionSchema.or(z.null()).optional(),
    eventTypeId: z
      .number({ message: 'Select an event type' })
      .nullable()
      .refine((val): val is number => val !== null && val > 0, {
        message: 'Select an event type',
      }),
    occurredAt: z.coerce.date('Must be a valid date'),
    summary: updateOptionalString(256),
    details: updateOptionalString(1024),
    source: SourceTypeSchema,
    direction: DirectionTypeSchema,
  })
  .partial();

export type EventCreate = z.infer<typeof EventCreateSchema>;
export type EventUpdate = z.infer<typeof EventUpdateSchema>;

export type EventFormValues = z.input<typeof EventCreateSchema>;
