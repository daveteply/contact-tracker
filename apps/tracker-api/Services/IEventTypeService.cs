using ContactTracker.SharedDTOs;

namespace ContactTracker.TrackerAPI.Services;

public interface IEventTypeService
{
    Task<List<EventTypeReadDto>> GetAllEventTypesAsync();
    Task<EventTypeReadDto> GetEventTypeByIdAsync(long id);
    Task<EventTypeReadDto> CreateEventTypeAsync(EventTypeCreateDto eventType);
    Task<EventTypeReadDto> UpdateEventTypeAsync(long id, EventTypeUpdateDto eventType);
    Task DeleteEventTypeAsync(long id);
}