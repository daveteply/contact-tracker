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
            e.Company is not null ? new CompanyReadDto(
                e.Company.Id,
                e.Company.Name,
                e.Company.Website,
                e.Company.Industry,
                e.Company.SizeRange,
                e.Company.Notes
            ) : null,
            e.ContactId,
            e.Contact is not null ? new ContactReadDto(
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
            e.Role is not null ? new RoleReadDto(
                e.Role.Id,
                e.Role.CompanyId,
                e.Role.Title,
                e.Role.JobPostingUrl,
                e.Role.Location,
                e.Role.Level
            ) : null,
            e.EventTypeId,
            e.EventType is not null ? new EventTypeReadDto(
                e.EventType.Id,
                e.EventType.Name,
                e.EventType.Category,
                e.EventType.IsSystemDefined
            ) : null,
            e.OccurredAt,
            e.Summary,
            e.Details,
            e.Source,
            e.Direction
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
        ValidateEventUpdate(dto);

        var @event = await _context.Events
            .Include(e => e.Company)
            .Include(e => e.Contact)
            .Include(e => e.Role)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (@event == null)
        {
            throw new ResourceNotFoundException(nameof(Event), id);
        }

        // Only update properties that are provided (not null)
        if (dto.EventTypeId.HasValue)
            @event.EventTypeId = dto.EventTypeId.Value;

        if (dto.OccurredAt.HasValue)
            @event.OccurredAt = dto.OccurredAt.Value;

        if (dto.Summary is not null)
            @event.Summary = dto.Summary;

        if (dto.Details is not null)
            @event.Details = dto.Details;

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
        if (string.IsNullOrWhiteSpace(updateDto.Name)) return;

        var newName = updateDto.Name.Trim();

        // Check if a DIFFERENT company with this name already exists
        var existingDifferentCompany = await _context.Companies
            .FirstOrDefaultAsync(c => c.Name == newName && c.Id != @event.CompanyId);

        if (existingDifferentCompany is not null)
        {
            // Re-link to the existing different company
            @event.CompanyId = existingDifferentCompany.Id;
            @event.Company = null; // Clear navigation
            return;
        }

        // Now handle updating the current company or creating a new one
        if (@event.CompanyId.HasValue)
        {
            // Event is linked to a company - update it
            Company? companyToUpdate = @event.Company;

            if (companyToUpdate == null)
            {
                // Navigation not loaded, fetch it
                companyToUpdate = await _context.Companies.FindAsync(@event.CompanyId.Value);
            }

            if (companyToUpdate is not null)
            {
                companyToUpdate.Name = newName;
                // CRITICAL: Mark the company as modified so EF tracks the change
                _context.Entry(companyToUpdate).State = EntityState.Modified;
            }
        }
        else
        {
            // Event has no company - create a new one
            @event.Company = new Company { Name = newName };
        }
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

        // Check if a DIFFERENT role with this title exists in the same company
        if (compId.HasValue)
        {
            var existingDifferentRole = await _context.Roles
                .FirstOrDefaultAsync(r => r.CompanyId == compId
                    && r.Title == newTitle.Trim()
                    && r.Id != @event.RoleId);

            if (existingDifferentRole is not null)
            {
                // Re-link to existing role
                @event.RoleId = existingDifferentRole.Id;
                @event.Role = null;
                return;
            }
        }

        // Update existing role or create new one
        if (@event.RoleId.HasValue)
        {
            // Event is linked to a role - update it
            Role? roleToUpdate = @event.Role;

            if (roleToUpdate == null)
            {
                // Navigation not loaded, fetch it
                roleToUpdate = await _context.Roles.FindAsync(@event.RoleId.Value);
            }

            if (roleToUpdate is not null)
            {
                roleToUpdate.Title = newTitle;
                // Update other fields if provided
                if (updateDto.Location is not null) roleToUpdate.Location = updateDto.Location;
                if (updateDto.Level.HasValue) roleToUpdate.Level = updateDto.Level.Value;
                if (updateDto.JobPostingUrl is not null) roleToUpdate.JobPostingUrl = updateDto.JobPostingUrl;

                // CRITICAL: Mark the role as modified
                _context.Entry(roleToUpdate).State = EntityState.Modified;
            }
        }
        else
        {
            // Event has no role - create a new one
            @event.Role = new Role
            {
                Title = newTitle,
                CompanyId = compId,
                Company = @event.Company,
                Location = updateDto.Location,
                Level = updateDto.Level ?? RoleLevel.EngineeringManager,
                JobPostingUrl = updateDto.JobPostingUrl
            };
        }
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

        // 3. Update or Create
        if (@event.Contact is not null)
        {
            // Update the name of the contact currently attached to the event
            @event.Contact.FirstName = first;
            @event.Contact.LastName = last;
        }
        else
        {
            // Create a brand new contact
            @event.Contact = new Contact
            {
                FirstName = first,
                LastName = last
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
