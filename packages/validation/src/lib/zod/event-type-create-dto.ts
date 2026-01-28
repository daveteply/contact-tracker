import { z } from 'zod';

export const EventTypeCreateDtoSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().max(100).optional(),
  category: z.union([z.null(), z.string().max(100)]).optional(),
  isSystemDefined: z.boolean().optional(),
});
