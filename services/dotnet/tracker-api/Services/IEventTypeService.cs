namespace tracker_api.Services;

public interface IEventTypeService
{
    Task<List<EventType>> GetAllEventTypesAsync();
    Task<EventType> GetEventTypeByIdAsync(int id);
    Task<EventType> CreateEventTypeAsync(EventType eventType);
    Task<EventType> UpdateEventTypeAsync(int id, EventType eventType);
    Task DeleteEventTypeAsync(int id);
}