namespace tracker_api.Services;

public interface IEventService
{
    Task<List<Event>> GetAllEventsAsync();
    Task<Event> GetEventByIdAsync(long id);
    Task<Event> CreateEventAsync(Event @event);
    Task<Event> UpdateEventAsync(long id, Event @event);
    Task DeleteEventAsync(long id);
}