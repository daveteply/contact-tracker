using Microsoft.EntityFrameworkCore;
using ContactTracker.TrackerAPI.Common;
using ContactTracker.SharedDTOs;

namespace ContactTracker.TrackerAPI.Services;

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
        var eventDtos = events.Select(e => MapToReadDto(e)).ToList();

        var metadata = new PaginationMetadata(
        page,
        pageSize,
        totalPages,
        totalCount,
        HasPrevious: page > 1,
        HasNext: page < totalPages);

        return (eventDtos, metadata);
    }

    public async Task<EventReadDtoWithRelations> GetEventByIdAsync(long id, HashSet<string> includeRelations)
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

        var @event = await query.FirstOrDefaultAsync(e => e.Id == id);

        if (@event == null)
        {
            throw new ResourceNotFoundException(nameof(Event), id);
        }

        return MapToReadDto(@event);
    }

    public async Task<EventReadDtoWithRelations> CreateEventAsync(EventCreateDto dto)
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

    public async Task<EventReadDtoWithRelations> UpdateEventAsync(long id, EventUpdateDto dto)
    {
        var @event = await _context.Events
            .FirstOrDefaultAsync(e => e.Id == id);

        if (@event == null)
        {
            throw new ResourceNotFoundException(nameof(Event), id);
        }

        ValidateEventUpdate(dto);

        // Only update properties that are provided (not null)
        if (dto.EventTypeId.HasValue)
            @event.EventTypeId = dto.EventTypeId.Value;

        if (dto.OccurredAt.HasValue)
            @event.OccurredAt = dto.OccurredAt.Value;

        if (dto.Summary is not null)
            @event.Summary = string.IsNullOrEmpty(dto.Summary) ? null : dto.Summary;

        if (dto.Details is not null)
            @event.Details = string.IsNullOrEmpty(dto.Details) ? null : dto.Details;

        if (dto.Source.HasValue)
            @event.Source = dto.Source.Value;

        if (dto.Direction.HasValue)
            @event.Direction = dto.Direction.Value;

        // Company
        if (dto.CompanyId.HasValue)
        {
            @event.CompanyId = dto.CompanyId;
            @event.Company = null; // Clear navigation so EF doesn't try to insert
        }
        else if (dto.UpdateCompany is not null)
        {
            await HandleInlineCompanyUpdate(@event, dto.UpdateCompany);
        }

        // Role
        if (dto.RoleId.HasValue)
        {
            @event.RoleId = dto.RoleId;
            @event.Role = null;  // Clear navigation so EF doesn't try to insert
        }
        else if (dto.UpdateRole is not null)
        {
            await HandleInlineRoleUpdate(@event, dto.UpdateRole);
        }

        // Contact
        if (dto.ContactId.HasValue)
        {
            @event.ContactId = dto.ContactId;
            @event.Contact = null; // Clear navigation so EF doesn't try to insert
        }
        else if (dto.UpdateContact is not null)
        {
            await HandleInlineContactUpdate(@event, dto.UpdateContact);
        }

        _context.Events.Update(@event);
        await _context.SaveChangesAsync();

        // Reload the related entities to return them in the response
        await _context.Entry(@event).Reference(e => e.Company).LoadAsync();
        await _context.Entry(@event).Reference(e => e.Contact).LoadAsync();
        await _context.Entry(@event).Reference(e => e.Role).LoadAsync();
        await _context.Entry(@event).Reference(e => e.EventType).LoadAsync();

        return MapToReadDto(@event);
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

    private static EventReadDtoWithRelations MapToReadDto(Event @event)
    {
        return new EventReadDtoWithRelations(
            @event.Id,
            @event.CompanyId,
            @event.Company is not null ? new CompanyReadDto(
                @event.Company.Id,
                @event.Company.Name,
                @event.Company.Website,
                @event.Company.Industry,
                @event.Company.SizeRange,
                @event.Company.Notes
            ) : null,
            @event.ContactId,
            @event.Contact is not null ? new ContactReadDto(
                @event.Contact.Id,
                @event.Contact.CompanyId,
                @event.Contact.Company is not null ? new CompanyReadDto(
                    @event.Contact.Company.Id,
                    @event.Contact.Company.Name,
                    @event.Contact.Company.Website,
                    @event.Contact.Company.Industry,
                    @event.Contact.Company.SizeRange,
                    @event.Contact.Company.Notes
                ) : null,
                @event.Contact.FirstName,
                @event.Contact.LastName,
                @event.Contact.Title,
                @event.Contact.Email,
                @event.Contact.PhoneNumber,
                @event.Contact.LinkedInUrl,
                @event.Contact.IsPrimaryRecruiter,
                @event.Contact.Notes
            ) : null,
            @event.RoleId,
            @event.Role is not null ? new RoleReadDto(
                @event.Role.Id,
                @event.CompanyId,
                @event.Company is not null ? new CompanyReadDto(
                @event.Company.Id,
                @event.Company.Name,
                @event.Company.Website,
                @event.Company.Industry,
                @event.Company.SizeRange,
                @event.Company.Notes
            ) : null,
                @event.Role.Title,
                @event.Role.JobPostingUrl,
                @event.Role.Location,
                @event.Role.Level
            ) : null,
            @event.EventTypeId,
            @event.EventType is not null ? new EventTypeReadDto(
                @event.EventType.Id,
                @event.EventType.Name,
                @event.EventType.Category,
                @event.EventType.IsSystemDefined
            ) : null,
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
        else if (dto.NewCompany is not null && !string.IsNullOrWhiteSpace(dto.NewCompany.Name))
        {
            var normalizedName = dto.NewCompany.Name.Trim();
            var existingCompany = await _context.Companies
                .FirstOrDefaultAsync(c => c.Name == normalizedName);

            if (existingCompany is not null)
                @event.CompanyId = existingCompany.Id;
            else
                @event.Company = new Company { Name = normalizedName };
        }

        // Resolve Role (Link to the company object resolved above)
        if (dto.RoleId.HasValue)
        {
            @event.RoleId = dto.RoleId;
        }
        else if (dto.NewRole is not null && !string.IsNullOrWhiteSpace(dto.NewRole.Title))
        {
            // Try to find existing role within the specific company
            var title = dto.NewRole.Title.Trim();
            var compId = @event.CompanyId;

            // If company is also new, we check by name instead of ID
            Role? existingRole = compId.HasValue
            ? await _context.Roles.FirstOrDefaultAsync(r => r.CompanyId == compId
                && r.Title == title) : null;

            if (existingRole is not null)
            {
                @event.RoleId = existingRole.Id;
            }
            else
            {
                @event.Role = new Role { Title = title };
                // link navigation properties
                if (@event.Company is not null) @event.Role.Company = @event.Company;
                else if (@event.CompanyId.HasValue) @event.Role.CompanyId = @event.CompanyId;
            }
        }

        // Finally, contact
        if (dto.ContactId.HasValue)
        {
            @event.ContactId = dto.ContactId;
        }
        else if (dto.NewContact is not null)
        {
            var first = dto.NewContact.FirstName.Trim();
            var last = dto.NewContact.LastName.Trim();

            var existingContact = await _context.Contacts
               .FirstOrDefaultAsync(c => c.FirstName == first && c.LastName == last);

            if (existingContact is not null)
            {
                @event.ContactId = existingContact.Id;
            }
            else
            {
                @event.Contact = new Contact { FirstName = first, LastName = last, Email = dto.NewContact.Email };

                // Link Contact to the Company context as well
                if (@event.Company is not null) @event.Contact.Company = @event.Company;
                else if (@event.CompanyId.HasValue) @event.Contact.CompanyId = @event.CompanyId;
            }
        }
    }

    private async Task HandleInlineCompanyUpdate(Event @event, CompanyUpdateDto updateDto)
    {
        // Name is the only required field for Company
        if (string.IsNullOrWhiteSpace(updateDto.Name)) return;

        var newName = updateDto.Name.Trim();

        // Check if a company with this name already exists
        var existingCompany = await _context.Companies
            .FirstOrDefaultAsync(c => c.Name == newName);

        if (existingCompany is not null)
        {
            // Link to the existing company
            @event.CompanyId = existingCompany.Id;
            @event.Company = null;
            return;
        }

        // Create a new company (don't update the existing one)
        @event.Company = new Company { Name = newName };
        @event.CompanyId = null; // Will be assigned by EF after insert
    }

    private async Task HandleInlineRoleUpdate(Event @event, RoleUpdateDto updateDto)
    {
        if (string.IsNullOrWhiteSpace(updateDto.Title)) return;

        var newTitle = updateDto.Title.Trim();

        // Determine the Company context for this Role
        long? compId = @event.CompanyId;
        if (compId == null && @event.Company is not null)
        {
            compId = @event.Company.Id;
        }

        // Check if a role with this title already exists (for deduplication)
        Role? existingRole = null;
        if (compId.HasValue)
        {
            existingRole = await _context.Roles
                .FirstOrDefaultAsync(r => r.CompanyId == compId && r.Title == newTitle);
        }

        if (existingRole is not null)
        {
            // Link to the existing role
            @event.RoleId = existingRole.Id;
            @event.Role = null;
            return;
        }

        // Create a new role (don't update the existing one)
        @event.Role = new Role
        {
            Title = newTitle,
            CompanyId = compId,
            Company = @event.Company,
            Location = updateDto.Location,
            Level = updateDto.Level ?? RoleLevel.EngineeringManager,
            JobPostingUrl = updateDto.JobPostingUrl
        };
        @event.RoleId = null; // Will be assigned by EF after insert
    }

    private async Task HandleInlineContactUpdate(Event @event, ContactUpdateDto updateDto)
    {
        // Sanitization
        var first = updateDto.FirstName?.Trim();
        var last = updateDto.LastName?.Trim();

        if (string.IsNullOrWhiteSpace(first) || string.IsNullOrWhiteSpace(last)) return;

        // Deduplication: Does this Contact already exist?
        // We check by name since Email isn't provided in this focused UX.
        var existing = await _context.Contacts
             .FirstOrDefaultAsync(c => c.FirstName == first.Trim() && c.LastName == last.Trim());

        if (existing is not null)
        {
            @event.ContactId = existing.Id;
            @event.Contact = null; // Use the existing ID, don't update the object
            return;
        }

        // Create a new contact (don't update the existing one)
        @event.Contact = new Contact
        {
            FirstName = first,
            LastName = last
        };
        @event.ContactId = null; // Will be assigned by EF after insert
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
