using tracker_api.DTOs;

namespace tracker_api.Services;

public interface IEventTypeService
{
    Task<List<EventTypeReadDto>> GetAllEventTypesAsync();
    Task<EventTypeReadDto> GetEventTypeByIdAsync(int id);
    Task<EventTypeReadDto> CreateEventTypeAsync(EventTypeCreateDto eventType);
    Task<EventTypeReadDto> UpdateEventTypeAsync(int id, EventTypeUpdateDto eventType);
    Task DeleteEventTypeAsync(int id);
}