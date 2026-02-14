export const CompanySchema = {
  title: 'company schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    serverId: { type: ['number', 'null'] },

    name: { type: 'string', maxLength: 100 },
    website: { type: ['string', 'null'], maxLength: 2048 },
    industry: { type: ['string', 'null'], maxLength: 100 },
    sizeRange: { type: ['string', 'null'], maxLength: 100 },
    notes: { type: ['string', 'null'], maxLength: 2048 },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  required: ['id', 'name'],
} as const;
