import { DirectionType, RoleLevel, SourceType } from '@contact-tracker/api-models';
import { z } from 'zod';

const directionSchema = z.enum(Object.values(DirectionType));
const sourceSchema = z.enum(Object.values(SourceType));
const roleLevelSchema = z.enum(Object.values(RoleLevel));

export const DirectionTypeSchema = z
  .enum(directionSchema.options)
  .or(z.literal(''))
  .refine((val) => val !== '', {
    message: 'Select a direction',
  });

export const RoleLevelSchema = z
  .enum(roleLevelSchema.options)
  .or(z.literal(''))
  .refine((val) => val !== '', {
    message: 'Select a source',
  });

export const SourceTypeSchema = z
  .enum(sourceSchema.options)
  .or(z.literal(''))
  .refine((val) => val !== '', {
    message: 'Select a source',
  });
