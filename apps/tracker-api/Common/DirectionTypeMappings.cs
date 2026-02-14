using ContactTracker.ServerDomain;
using ContactTracker.SharedDTOs;

namespace TrackerApi.Mappings;

public static class DirectionTypeMappings
{
    public static DirectionTypeDto ToDto(this DirectionType direction)
    {
        return direction switch
        {
            DirectionType.Inbound => DirectionTypeDto.Inbound,
            DirectionType.Outbound => DirectionTypeDto.Outbound,
            _ => throw new ArgumentOutOfRangeException(nameof(direction), direction, null)
        };
    }

    public static DirectionType ToDomain(this DirectionTypeDto directionDto)
    {
        return directionDto switch
        {
            DirectionTypeDto.Inbound => DirectionType.Inbound,
            DirectionTypeDto.Outbound => DirectionType.Outbound,
            _ => throw new ArgumentOutOfRangeException(nameof(directionDto), directionDto, null)
        };
    }
}
