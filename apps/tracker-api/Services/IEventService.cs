using tracker_api.DTOs;

namespace tracker_api.Services;

public interface IEventService
{
    Task<List<EventReadDto>> GetAllEventsAsync();
    Task<EventReadDto> GetEventByIdAsync(long id);
    Task<EventReadDto> CreateEventAsync(EventCreateDto @event);
    Task<EventReadDto> UpdateEventAsync(long id, EventUpdateDto @event);
    Task DeleteEventAsync(long id);
}