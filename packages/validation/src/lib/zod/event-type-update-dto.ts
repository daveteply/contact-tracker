import { z } from 'zod';

export const EventTypeUpdateDtoSchema = z.object({
  name: z.union([z.null(), z.string().max(100)]).optional(),
  category: z.union([z.null(), z.string().max(100)]).optional(),
  isSystemDefined: z.union([z.null(), z.boolean()]).optional(),
});
