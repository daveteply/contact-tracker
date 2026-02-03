using ContactTracker.SharedDTOs;

namespace ContactTracker.TrackerAPI.Services;

public interface IEventService
{
    Task<(List<EventReadDto> Items, PaginationMetadata Metadata)> GetAllEventsAsync(
        int page,
        int pageSize,
        HashSet<string> includeRelations);
    Task<EventReadDto> GetEventByIdAsync(long id, HashSet<string> includeRelations);
    Task<EventReadDto> CreateEventAsync(EventCreateDto @event);
    Task<EventReadDto> UpdateEventAsync(long id, EventUpdateDto @event);
    Task DeleteEventAsync(long id);
}