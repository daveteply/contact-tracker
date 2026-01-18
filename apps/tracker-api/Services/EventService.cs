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

    public async Task<(List<EventReadDtoWithRelations> Items, PaginationMetadata Metadata)> GetAllEventsAsync(
        int page,
        int pageSize,
        HashSet<string> includeRelations)
    {
        var query = _context.Events.AsQueryable();

        if (includeRelations.Contains("company"))
            query = query.Include(e => e.Company);

        if (includeRelations.Contains("contact"))
            query = query.Include(e => e.Contact);

        if (includeRelations.Contains("role"))
            query = query.Include(e => e.Role);

        if (includeRelations.Contains("eventtype"))
            query = query.Include(e => e.EventType);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        // Apply pagination and ordering
        var events = await query
            .OrderByDescending(e => e.OccurredAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Apply pagination and ordering
        // Transform Models to DTOs
        var eventDtos = events.Select(e => new EventReadDtoWithRelations(
            e.Id,
            e.CompanyId,
            e.Company != null ? new CompanyReadDto(
                e.Company.Id,
                e.Company.Name,
                e.Company.Website,
                e.Company.Industry,
                e.Company.SizeRange,
                e.Company.Notes
            ) : null,
            e.ContactId,
            e.Contact != null ? new ContactReadDto(
                e.Contact.Id,
                e.Contact.CompanyId,
                e.Contact.FirstName,
                e.Contact.LastName,
                e.Contact.Title,
                e.Contact.Email,
                e.Contact.PhoneNumber,
                e.Contact.LinkedInUrl,
                e.Contact.IsPrimaryRecruiter,
                e.Contact.Notes
            ) : null,
            e.RoleId,
            e.Role != null ? new RoleReadDto(
                e.Role.Id,
                e.Role.CompanyId,
                e.Role.Title,
                e.Role.JobPostingUrl,
                e.Role.Location,
                e.Role.Level
            ) : null,
            e.EventTypeId,
            e.OccurredAt,
            e.Summary,
            e.Details,
            e.Source,
            e.Direction,
            e.EventType != null ? new EventTypeReadDto(
                e.EventType.Id,
                e.EventType.Name,
                e.EventType.Category,
                e.EventType.IsSystemDefined
            ) : null
        )).ToList();

        var metadata = new PaginationMetadata(
        page,
        pageSize,
        totalPages,
        totalCount,
        HasPrevious: page > 1,
        HasNext: page < totalPages);

        return (eventDtos, metadata);
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

        // Resolve entities: either link existing ID or process "New" DTOs
        await ResolveEntitiesAsync(dto, @event);

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


    private async Task ResolveEntitiesAsync(EventCreateDto dto, Event @event)
    {
        // Resolve Company First
        if (dto.CompanyId.HasValue)
        {
            @event.CompanyId = dto.CompanyId;
        }
        else if (dto.NewCompany != null)
        {
            var existingCompany = await _context.Companies
                .FirstOrDefaultAsync(c => c.Name.ToLower() == dto.NewCompany.Name.ToLower());

            if (existingCompany != null)
                @event.CompanyId = existingCompany.Id;
            else
                @event.Company = new Company { Name = dto.NewCompany.Name };
        }

        // Resolve Role (Link to the company object resolved above)
        if (dto.RoleId.HasValue)
        {
            @event.RoleId = dto.RoleId;
        }
        else if (dto.NewRole != null)
        {
            // Try to find existing role within the specific company
            var roleTitle = dto.NewRole.Title;
            var compId = @event.CompanyId;

            // If company is also new, we check by name instead of ID
            Role? existingRole = compId.HasValue
                ? await _context.Roles.FirstOrDefaultAsync(r => r.CompanyId == compId && r.Title == roleTitle)
                : null;

            if (existingRole != null)
            {
                @event.RoleId = existingRole.Id;
            }
            else
            {
                @event.Role = new Role { Title = roleTitle };
                // link navigation properties
                if (@event.Company != null)
                    @event.Role.Company = @event.Company;
                else if (@event.CompanyId.HasValue)
                    @event.Role.CompanyId = @event.CompanyId;
            }
        }

        // Finally, contact
        if (dto.ContactId.HasValue)
        {
            @event.ContactId = dto.ContactId;
        }
        else if (dto.NewContact != null)
        {
            var existingContact = await _context.Contacts
                .FirstOrDefaultAsync(c => c.FirstName == dto.NewContact.FirstName
                    && c.LastName == dto.NewContact.LastName
                    && c.Email == dto.NewContact.Email);

            if (existingContact != null)
                @event.ContactId = existingContact.Id;
            else
                @event.Contact = new Contact
                {
                    FirstName = dto.NewContact.FirstName,
                    LastName = dto.NewContact.LastName
                };
        }
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
