import { RoleReadDto } from '@contact-tracker/api-models';
import { RoleFormValues } from '../role-schema';

export function mapRoleDtoToFormValues(dto: RoleReadDto): RoleFormValues {
  return {
    title: dto.title,
    jobPostingUrl: dto.jobPostingUrl ?? undefined,
    location: dto.location ?? undefined,
    level: dto.level,
    company: {
      id: dto.company?.id,
      name: dto.company?.name ?? '',
      isNew: false, // Explicitly tell the form this is an existing entity
    },
  };
}
