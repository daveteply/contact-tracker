using Microsoft.EntityFrameworkCore;
using ContactTracker.TrackerAPI.Common;
using ContactTracker.SharedDTOs;

namespace ContactTracker.TrackerAPI.Services;

public class EventTypeService : IEventTypeService
{
    private readonly ContactTrackerDbContext _context;

    public EventTypeService(ContactTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<List<EventTypeReadDto>> GetAllEventTypesAsync()
    {
        var eventTypes = await _context.EventTypes
            .AsNoTracking()
            .ToListAsync();

        return eventTypes.Select(MapToReadDto).ToList();
    }

    public async Task<EventTypeReadDto> GetEventTypeByIdAsync(int id)
    {
        var eventType = await _context.EventTypes
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);

        if (eventType == null)
        {
            throw new ResourceNotFoundException(nameof(EventType), id);
        }

        return MapToReadDto(eventType);
    }

    public async Task<EventTypeReadDto> CreateEventTypeAsync(EventTypeCreateDto dto)
    {
        ValidateEventTypeCreate(dto);

        if (await _context.EventTypes.AnyAsync(t => t.Id == dto.Id))
        {
            throw new ValidationException("Conflict", new List<string> { $"An EventType with ID {dto.Id} already exists." });
        }

        var eventType = new EventType
        {
            Id = dto.Id,
            Name = dto.Name,
            Category = dto.Category ?? "",
            IsSystemDefined = dto.IsSystemDefined
        };

        _context.EventTypes.Add(eventType);
        await _context.SaveChangesAsync();

        return MapToReadDto(eventType);
    }

    public async Task<EventTypeReadDto> UpdateEventTypeAsync(int id, EventTypeUpdateDto dto)
    {
        var existingEventType = await _context.EventTypes.FindAsync(id);

        if (existingEventType == null)
        {
            throw new ResourceNotFoundException(nameof(EventType), id);
        }

        // Protect system-defined types
        if (existingEventType.IsSystemDefined)
        {
            throw new ValidationException("Protected", new List<string> { "System-defined event types cannot be modified." });
        }

        ValidateEventTypeUpdate(dto);

        // Only update properties that are provided (not null)
        if (dto.Name is not null)
            existingEventType.Name = dto.Name;

        if (dto.Category is not null)
            existingEventType.Category = dto.Category;

        // Note: We usually don't allow changing IsSystemDefined via API
        // But if you want to allow it, uncomment:
        // if (dto.IsSystemDefined.HasValue)
        //     existingEventType.IsSystemDefined = dto.IsSystemDefined.Value;

        _context.EventTypes.Update(existingEventType);
        await _context.SaveChangesAsync();

        return MapToReadDto(existingEventType);
    }

    public async Task DeleteEventTypeAsync(int id)
    {
        var eventType = await _context.EventTypes.FindAsync(id);

        if (eventType == null)
        {
            throw new ResourceNotFoundException(nameof(EventType), id);
        }

        if (eventType.IsSystemDefined)
        {
            throw new ValidationException("Protected", new List<string> { "System-defined event types cannot be deleted." });
        }

        _context.EventTypes.Remove(eventType);
        await _context.SaveChangesAsync();
    }

    private static EventTypeReadDto MapToReadDto(EventType eventType)
    {
        return new EventTypeReadDto(
            eventType.Id,
            eventType.Name,
            eventType.Category,
            eventType.IsSystemDefined
        );
    }

    private void ValidateEventTypeCreate(EventTypeCreateDto dto)
    {
        var errors = new List<string>();

        if (dto.Id <= 0)
        {
            errors.Add("Id must be greater than 0");
        }

        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            errors.Add("Name is required");
        }

        if (string.IsNullOrWhiteSpace(dto.Category))
        {
            errors.Add("Category is required");
        }

        if (errors.Count > 0)
        {
            throw new ValidationException("EventType validation failed", errors);
        }
    }

    private void ValidateEventTypeUpdate(EventTypeUpdateDto dto)
    {
        var errors = new List<string>();

        // For update, fields can be null (meaning don't update them)
        // But if they ARE provided, they shouldn't be empty/whitespace
        if (dto.Name is not null && string.IsNullOrWhiteSpace(dto.Name))
        {
            errors.Add("Name cannot be empty");
        }

        if (dto.Category is not null && string.IsNullOrWhiteSpace(dto.Category))
        {
            errors.Add("Category cannot be empty");
        }

        if (errors.Count > 0)
        {
            throw new ValidationException("EventType validation failed", errors);
        }
    }
}