import { z } from 'zod';
import { RoleLevelSchema } from './enum-schema';
import {
  emptyToUndefined,
  CompanySelectionSchema,
  updateRequiredString,
  updateOptionalUrl,
  updateOptionalString,
} from '../helpers/schema-helpers';

const roleCreateBase = {
  jobPostingUrl: emptyToUndefined(z.url('Must be a valid URL').max(2048).optional()),
  location: z.string().optional(),
  level: RoleLevelSchema,
  company: CompanySelectionSchema.or(z.null()).optional(),
};

export const RoleCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  ...roleCreateBase,
});

export const RoleUpdateSchema = z
  .object({
    title: updateRequiredString(100, 'Title is required'),
    jobPostingUrl: updateOptionalUrl(2048),
    location: updateOptionalString(100),
    level: RoleLevelSchema,
    company: CompanySelectionSchema.or(z.null()).optional(),
  })
  .partial();

export type RoleCreate = z.infer<typeof RoleCreateSchema>;
export type RoleUpdate = z.infer<typeof RoleUpdateSchema>;
