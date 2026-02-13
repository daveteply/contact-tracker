export const ContactSchema = {
  title: 'contact schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    serverId: { type: ['number', 'null'] },

    companyId: { type: 'string', maxLength: 100 },

    firstName: { type: 'string', maxLength: 100 },
    lastName: { type: 'string', maxLength: 100 },
    title: { type: ['string', 'null'], maxLength: 100 },
    email: { type: ['string', 'null'], maxLength: 2048 },
    phoneNumber: { type: ['string', 'null'], maxLength: 30 },
    linkedInUrl: { type: ['string', 'null'], maxLength: 2048 },
    isPrimaryRecruiter: { type: 'boolean' },
    notes: { type: ['string', 'null'], maxLength: 2048 },

    updatedAt: { type: 'string', format: 'date-time' },
  },
  // ALL indexed fields MUST be here for Dexie
  required: ['id', 'companyId', 'firstName', 'lastName'],
  indexes: ['companyId'],
} as const;
