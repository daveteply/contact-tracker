export const RoleSchema = {
  title: 'role schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    serverId: { type: ['number', 'null'] },

    companyId: { type: 'string', maxLength: 100 },

    title: { type: 'string', maxLength: 255 },
    jobPostingUrl: { type: ['string', 'null'], maxLength: 2048 },
    location: { type: ['string', 'null'], maxLength: 255 },
    level: { type: 'string' }, // Maps to RoleLevelType enum
    updatedAt: { type: 'string', format: 'date-time' },
  },
  // ALL indexed fields MUST be here for Dexie
  required: ['id', 'companyId', 'title'],
  indexes: ['companyId'],
} as const;
