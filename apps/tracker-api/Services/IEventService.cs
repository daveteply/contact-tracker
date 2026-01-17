using tracker_api.DTOs;

namespace tracker_api.Services;

public interface IEventService
{
    Task<(List<EventReadDtoWithRelations> Items, PaginationMetadata Metadata)> GetAllEventsAsync(
        int page,
        int pageSize,
        HashSet<string> includeRelations);
    Task<EventReadDto> GetEventByIdAsync(long id);
    Task<EventReadDto> CreateEventAsync(EventCreateDto @event);
    Task<EventReadDto> UpdateEventAsync(long id, EventUpdateDto @event);
    Task DeleteEventAsync(long id);
}