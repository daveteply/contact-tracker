using Microsoft.EntityFrameworkCore;
using tracker_api.Common;
using tracker_api.DTOs;

namespace tracker_api.Services;

public class EventService : IEventService
{
    private readonly ContactTrackerDbContext _context;

    public EventService(ContactTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<List<EventReadDto>> GetAllEventsAsync()
    {
        var events = await _context.Events
            .Include(e => e.EventType)
            .AsNoTracking()
            .ToListAsync();

        return events.Select(MapToReadDto).ToList();
    }

    public async Task<EventReadDto> GetEventByIdAsync(long id)
    {
        var @event = await _context.Events
             .Include(e => e.EventType)
             .AsNoTracking()
             .FirstOrDefaultAsync(e => e.Id == id);

        if (@event == null)
        {
            throw new ResourceNotFoundException(nameof(Event), id);
        }

        return MapToReadDto(@event);
    }

    public async Task<EventReadDto> CreateEventAsync(EventCreateDto dto)
    {
        ValidateEventCreate(dto);

        var @event = new Event
        {
            CompanyId = dto.CompanyId,
            ContactId = dto.ContactId,
            RoleId = dto.RoleId,
            EventTypeId = dto.EventTypeId,
            OccurredAt = dto.OccurredAt,
            Summary = dto.Summary,
            Details = dto.Details,
            Source = dto.Source,
            Direction = dto.Direction
        };

        _context.Events.Add(@event);
        await _context.SaveChangesAsync();

        return MapToReadDto(@event);
    }

    public async Task<EventReadDto> UpdateEventAsync(long id, EventUpdateDto dto)
    {
        var existingEvent = await _context.Events
            .FirstOrDefaultAsync(e => e.Id == id);

        if (existingEvent == null)
        {
            throw new ResourceNotFoundException(nameof(Event), id);
        }

        ValidateEventUpdate(dto);

        // Only update properties that are provided (not null)
        if (dto.CompanyId.HasValue)
            existingEvent.CompanyId = dto.CompanyId;

        if (dto.ContactId.HasValue)
            existingEvent.ContactId = dto.ContactId;

        if (dto.RoleId.HasValue)
            existingEvent.RoleId = dto.RoleId;

        if (dto.EventTypeId.HasValue)
            existingEvent.EventTypeId = dto.EventTypeId.Value;

        if (dto.OccurredAt.HasValue)
            existingEvent.OccurredAt = dto.OccurredAt.Value;

        if (dto.Summary != null)
            existingEvent.Summary = dto.Summary;

        if (dto.Details != null)
            existingEvent.Details = dto.Details;

        if (dto.Source.HasValue)
            existingEvent.Source = dto.Source.Value;

        if (dto.Direction.HasValue)
            existingEvent.Direction = dto.Direction.Value;

        existingEvent.UpdatedAt = DateTime.UtcNow;

        _context.Events.Update(existingEvent);
        await _context.SaveChangesAsync();

        return MapToReadDto(existingEvent);
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

    private static EventReadDto MapToReadDto(Event @event)
    {
        return new EventReadDto(
            @event.Id,
            @event.CompanyId,
            @event.ContactId,
            @event.RoleId,
            @event.EventTypeId,
            @event.OccurredAt,
            @event.Summary,
            @event.Details,
            @event.Source,
            @event.Direction
        );
    }

    private void ValidateEventCreate(EventCreateDto dto)
    {
        var errors = new List<string>();

        if (dto.OccurredAt == default)
        {
            errors.Add("Event occurrence date is required");
        }

        if (dto.EventTypeId <= 0)
        {
            errors.Add("Valid Event Type is required");
        }

        if (errors.Count > 0)
        {
            throw new ValidationException("Event validation failed", errors);
        }
    }

    private void ValidateEventUpdate(EventUpdateDto dto)
    {
        var errors = new List<string>();

        // For update, fields can be null (meaning don't update them)
        // But if they ARE provided, they should be valid
        if (dto.OccurredAt.HasValue && dto.OccurredAt.Value == default)
        {
            errors.Add("Event occurrence date cannot be default value");
        }

        if (dto.EventTypeId.HasValue && dto.EventTypeId.Value <= 0)
        {
            errors.Add("Event Type must be valid if provided");
        }

        if (errors.Count > 0)
        {
            throw new ValidationException("Event validation failed", errors);
        }
    }
}