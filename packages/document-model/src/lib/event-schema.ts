export const EventSchema = {
  title: 'event schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    serverId: { type: ['number', 'null'] },

    companyId: { type: 'string', maxLength: 100 },
    contactId: { type: 'string', maxLength: 100 },
    roleId: { type: 'string', maxLength: 100 },

    eventTypeId: { type: 'string', maxLength: 100 },
    occurredAt: { type: 'string', format: 'date-time', maxLength: 100 },

    summary: { type: ['string', 'null'], maxLength: 500 },
    details: { type: ['string', 'null'] },
    source: { type: 'string' }, // Email, LinkedIn, etc.
    direction: { type: 'string' }, // Inbound, Outbound
    updatedAt: { type: 'string', format: 'date-time' },
  },
  // ALL indexed fields MUST be here for Dexie
  required: [
    'id',
    'occurredAt',
    'source',
    'direction',
    'eventTypeId',
    'companyId',
    'contactId',
    'roleId',
  ],
  indexes: ['companyId', 'contactId', 'roleId', 'occurredAt'],
} as const;
