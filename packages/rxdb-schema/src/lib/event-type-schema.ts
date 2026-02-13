export const EventTypeSchema = {
  title: 'event type schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    name: { type: 'string' },
    category: { type: 'string' }, // Discovery, Networking, etc.
    isSystemDefined: { type: 'boolean' },
  },
  required: ['id', 'name', 'category', 'isSystemDefined'],
} as const;
