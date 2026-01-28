import { DirectionType, RoleLevel, SourceType } from '@contact-tracker/api-models';
import { z } from 'zod';

export const DirectionTypeSchema = z
  .enum([DirectionType.Inbound, DirectionType.Outbound])
  .or(z.literal(''))
  .refine((val) => val !== '', {
    message: 'Select a direction',
  });

export const RoleLevelSchema = z
  .enum([RoleLevel.EngineeringManager, RoleLevel.StaffEngineer])
  .or(z.literal(''))
  .refine((val) => val !== '', {
    message: 'Select a source',
  });

export const SourceTypeSchema = z
  .enum([
    SourceType.Email,
    SourceType.LinkedIn,
    SourceType.Website,
    SourceType.Recruiter,
    SourceType.Referral,
  ])
  .or(z.literal(''))
  .refine((val) => val !== '', {
    message: 'Select a source',
  });
