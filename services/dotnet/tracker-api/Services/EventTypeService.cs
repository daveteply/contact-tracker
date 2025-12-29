using Microsoft.EntityFrameworkCore;
using tracker_api.Common;

namespace tracker_api.Services;

public class EventTypeService : IEventTypeService
{
    private readonly ContactTrackerDbContext _context;

    public EventTypeService(ContactTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<List<EventType>> GetAllEventTypesAsync()
    {
        return await _context.EventTypes.AsNoTracking().ToListAsync();
    }

    public async Task<EventType> GetEventTypeByIdAsync(int id)
    {
        var type = await _context.EventTypes.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id);
        if (type == null) throw new ResourceNotFoundException(nameof(EventType), id);
        return type;
    }

    public async Task<EventType> CreateEventTypeAsync(EventType eventType)
    {
        ValidateEventType(eventType);

        if (await _context.EventTypes.AnyAsync(t => t.Id == eventType.Id))
        {
            throw new ValidationException("Conflict", new List<string> { $"An EventType with ID {eventType.Id} already exists." });
        }

        _context.EventTypes.Add(eventType);
        await _context.SaveChangesAsync();
        return eventType;
    }

    public async Task<EventType> UpdateEventTypeAsync(int id, EventType eventType)
    {
        var existing = await _context.EventTypes.FindAsync(id);
        if (existing == null) throw new ResourceNotFoundException(nameof(EventType), id);

        // Optional: Protect system-defined types
        if (existing.IsSystemDefined)
        {
            throw new ValidationException("Protected", new List<string> { "System-defined event types cannot be modified." });
        }

        ValidateEventType(eventType);

        existing.Name = eventType.Name;
        existing.Category = eventType.Category;
        // We usually don't allow changing IsSystemDefined via API

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task DeleteEventTypeAsync(int id)
    {
        var type = await _context.EventTypes.FindAsync(id);
        if (type == null) throw new ResourceNotFoundException(nameof(EventType), id);

        if (type.IsSystemDefined)
        {
            throw new ValidationException("Protected", new List<string> { "System-defined event types cannot be deleted." });
        }

        _context.EventTypes.Remove(type);
        await _context.SaveChangesAsync();
    }

    private void ValidateEventType(EventType type)
    {
        var errors = new List<string>();
        if (type.Id <= 0) errors.Add("Id must be greater than 0.");
        if (string.IsNullOrWhiteSpace(type.Name)) errors.Add("Name is required.");
        if (string.IsNullOrWhiteSpace(type.Category)) errors.Add("Category is required.");

        if (errors.Count > 0) throw new ValidationException("Validation failed", errors);
    }
}