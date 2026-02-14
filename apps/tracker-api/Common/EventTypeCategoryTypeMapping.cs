using ContactTracker.ServerDomain;
using ContactTracker.SharedDTOs;

namespace TrackerApi.Mappings;

public static class EventTypeCategoryTypeMappings
{
    public static EventTypeCategoryTypeDto ToDto(this EventTypeCategoryType direction)
    {
        return direction switch
        {
            EventTypeCategoryType.Discovery => EventTypeCategoryTypeDto.Discovery,
            EventTypeCategoryType.Networking => EventTypeCategoryTypeDto.Networking,
            EventTypeCategoryType.Application => EventTypeCategoryTypeDto.Application,
            EventTypeCategoryType.Communication => EventTypeCategoryTypeDto.Communication,
            EventTypeCategoryType.Assessment => EventTypeCategoryTypeDto.Assessment,
            EventTypeCategoryType.Interview => EventTypeCategoryTypeDto.Interview,
            EventTypeCategoryType.Offer => EventTypeCategoryTypeDto.Offer,
            EventTypeCategoryType.Outcome => EventTypeCategoryTypeDto.Outcome,
            _ => throw new ArgumentOutOfRangeException(nameof(direction), direction, null)
        };
    }

    public static EventTypeCategoryType ToDomain(this EventTypeCategoryTypeDto directionDto)
    {
        return directionDto switch
        {
            EventTypeCategoryTypeDto.Discovery => EventTypeCategoryType.Discovery,
            EventTypeCategoryTypeDto.Networking => EventTypeCategoryType.Networking,
            EventTypeCategoryTypeDto.Application => EventTypeCategoryType.Application,
            EventTypeCategoryTypeDto.Communication => EventTypeCategoryType.Communication,
            EventTypeCategoryTypeDto.Assessment => EventTypeCategoryType.Assessment,
            EventTypeCategoryTypeDto.Interview => EventTypeCategoryType.Interview,
            EventTypeCategoryTypeDto.Offer => EventTypeCategoryType.Offer,
            EventTypeCategoryTypeDto.Outcome => EventTypeCategoryType.Outcome,
            _ => throw new ArgumentOutOfRangeException(nameof(directionDto), directionDto, null)
        };
    }
}
