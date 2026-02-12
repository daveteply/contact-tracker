import { DirectionTypeDto, RoleLevelTypeDto, SourceTypeDto } from '@contact-tracker/api-models';
import { z } from 'zod';

const directionSchema = z.enum(Object.values(DirectionTypeDto));
const sourceSchema = z.enum(Object.values(SourceTypeDto));
const roleLevelSchema = z.enum(Object.values(RoleLevelTypeDto));

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
