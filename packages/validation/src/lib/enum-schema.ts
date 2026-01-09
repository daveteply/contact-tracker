import {
  DirectionType,
  RoleLevel,
  SourceType,
} from '@contact-tracker/api-models';
import { z } from 'zod';

export const DirectionTypeSchema = z.union([
  z.literal(DirectionType.Inbound),
  z.literal(DirectionType.Outbound),
]);

export const RoleLevelSchema = z.union([
  z.literal(RoleLevel.EngineeringManager),
  z.literal(RoleLevel.StaffEngineer),
]);

export const SourceTypeSchema = z.union([
  z.literal(SourceType.Email),
  z.literal(SourceType.LinkedIn),
  z.literal(SourceType.Website),
  z.literal(SourceType.Recruiter),
  z.literal(SourceType.Referral),
]);
