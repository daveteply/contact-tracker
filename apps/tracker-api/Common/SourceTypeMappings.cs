using ContactTracker.DomainCore;
using ContactTracker.SharedDTOs;

namespace TrackerApi.Mappings;

public static class SourceTypeMappings
{
    public static SourceTypeDto ToDto(this SourceType direction)
    {
        return direction switch
        {
            SourceType.Email => SourceTypeDto.Email,
            SourceType.LinkedIn => SourceTypeDto.LinkedIn,
            SourceType.Website => SourceTypeDto.Website,
            SourceType.Recruiter => SourceTypeDto.Recruiter,
            SourceType.Referral => SourceTypeDto.Referral,
            _ => throw new ArgumentOutOfRangeException(nameof(direction), direction, null)
        };
    }

    public static SourceType ToDomain(this SourceTypeDto directionDto)
    {
        return directionDto switch
        {
            SourceTypeDto.Email => SourceType.Email,
            SourceTypeDto.LinkedIn => SourceType.LinkedIn,
            SourceTypeDto.Website => SourceType.Website,
            SourceTypeDto.Recruiter => SourceType.Recruiter,
            SourceTypeDto.Referral => SourceType.Referral,
            _ => throw new ArgumentOutOfRangeException(nameof(directionDto), directionDto, null)
        };
    }
}
