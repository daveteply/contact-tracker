using ContactTracker.Libs.Shared.DTOs;

namespace ContactTracker.TrackerAPI.Services;

public interface IEventService
{
    Task<(List<EventReadDtoWithRelations> Items, PaginationMetadata Metadata)> GetAllEventsAsync(
        int page,
        int pageSize,
        HashSet<string> includeRelations);
    Task<EventReadDtoWithRelations> GetEventByIdAsync(long id, HashSet<string> includeRelations);
    Task<EventReadDtoWithRelations> CreateEventAsync(EventCreateDto @event);
    Task<EventReadDtoWithRelations> UpdateEventAsync(long id, EventUpdateDto @event);
    Task DeleteEventAsync(long id);
}