export const ReminderSchema = {
  title: 'reminder schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    eventId: { type: 'string', maxLength: 100 },
    remindAt: { type: 'string', format: 'date-time' },
    completedAt: { type: ['string', 'null'], format: 'date-time' },
  },
  required: ['id', 'eventId', 'remindAt'],
} as const;
