using Microsoft.EntityFrameworkCore;
using tracker_api.Common;

namespace tracker_api.Services;

public class EventService : IEventService
{
    private readonly ContactTrackerDbContext _context;

    public EventService(ContactTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<List<Event>> GetAllEventsAsync()
    {
        return await _context.Events
            .Include(e => e.EventType) // Including related data often helpful for events
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Event> GetEventByIdAsync(long id)
    {
        var @event = await _context.Events
             .Include(e => e.EventType)
             .AsNoTracking()
             .FirstOrDefaultAsync(e => e.Id == id);

        if (@event == null)
        {
            throw new ResourceNotFoundException(nameof(Event), id);
        }

        return @event;
    }

    public async Task<Event> CreateEventAsync(Event @event)
    {
        ValidateEvent(@event);

        _context.Events.Add(@event);
        await _context.SaveChangesAsync();

        return @event;
    }

    public async Task<Event> UpdateEventAsync(long id, Event @event)
    {
        var existingEvent = await _context.Events
            .FirstOrDefaultAsync(e => e.Id == id);

        if (existingEvent == null)
        {
            throw new ResourceNotFoundException(nameof(Event), id);
        }

        ValidateEvent(@event);

        // Update properties
        existingEvent.CompanyId = @event.CompanyId;
        existingEvent.ContactId = @event.ContactId;
        existingEvent.RoleId = @event.RoleId;
        existingEvent.EventTypeId = @event.EventTypeId;
        existingEvent.OccurredAt = @event.OccurredAt;
        existingEvent.Summary = @event.Summary;
        existingEvent.Details = @event.Details;
        existingEvent.Source = @event.Source;
        existingEvent.Direction = @event.Direction;
        existingEvent.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return existingEvent;
    }

    public async Task DeleteEventAsync(long id)
    {
        var @event = await _context.Events.FindAsync(id);

        if (@event == null)
        {
            throw new ResourceNotFoundException(nameof(Event), id);
        }

        _context.Events.Remove(@event);
        await _context.SaveChangesAsync();
    }

    private void ValidateEvent(Event @event)
    {
        var errors = new List<string>();

        if (@event.OccurredAt == default)
        {
            errors.Add("Event occurrence date is required");
        }

        if (@event.EventTypeId <= 0)
        {
            errors.Add("Valid Event Type is required");
        }

        if (errors.Count > 0)
        {
            throw new ValidationException("Event validation failed", errors);
        }
    }
}