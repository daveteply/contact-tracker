using ContactTracker.Libs.Shared.DTOs;
using ContactTracker.TrackerAPI.Common;

using Microsoft.EntityFrameworkCore;

namespace ContactTracker.TrackerAPI.Services;

public class ContactService : IContactService
{
    private readonly ContactTrackerDbContext _context;

    public ContactService(ContactTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<List<ContactReadDto>> GetAllContactsAsync()
    {
        var contacts = await _context.Contacts
            .AsNoTracking()
            .ToListAsync();

        return contacts.Select(MapToReadDto).ToList();
    }

    public async Task<ContactReadDto> GetContactByIdAsync(long id)
    {
        var contact = await _context.Contacts
             .AsNoTracking()
             .FirstOrDefaultAsync(c => c.Id == id);

        if (contact == null)
        {
            throw new ResourceNotFoundException(nameof(Contact), id);
        }

        return MapToReadDto(contact);
    }

    public async Task<ContactReadDto> CreateContactAsync(ContactCreateDto dto)
    {
        ValidateContactCreate(dto);

        var contact = new Contact
        {
            CompanyId = dto.CompanyId,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Title = dto.Title,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            LinkedInUrl = dto.LinkedInUrl,
            IsPrimaryRecruiter = dto.IsPrimaryRecruiter,
            Notes = dto.Notes
        };

        _context.Contacts.Add(contact);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ContactTrackerDbContext.IsUniqueViolation(ex))
        {
            DuplicateFound();
        }

        return MapToReadDto(contact);
    }

    public async Task<ContactReadDto> UpdateContactAsync(long id, ContactUpdateDto dto)
    {
        var existingContact = await _context.Contacts
            .FirstOrDefaultAsync(c => c.Id == id);

        if (existingContact == null)
        {
            throw new ResourceNotFoundException(nameof(Contact), id);
        }

        ValidateContactUpdate(dto);

        // Only update properties that are provided (not null)
        if (dto.FirstName is not null && dto.LastName is not null)
        {
            var exists = await _context.Contacts
                .AnyAsync(c => c.Id != id && c.FirstName.ToLower() == dto.FirstName.ToLower()
                    && c.LastName.ToLower() == dto.LastName.ToLower()
                );

            if (exists)
            {
                DuplicateFound();
            }

            existingContact.FirstName = dto.FirstName;
            existingContact.LastName = dto.LastName;
        }

        if (dto.CompanyId.HasValue)
            existingContact.CompanyId = dto.CompanyId;

        if (dto.FirstName is not null)
            existingContact.FirstName = dto.FirstName;

        if (dto.LastName is not null)
            existingContact.LastName = dto.LastName;

        if (dto.Title is not null)
            existingContact.Title = dto.Title;

        if (dto.Email is not null)
            existingContact.Email = dto.Email;

        if (dto.PhoneNumber is not null)
            existingContact.PhoneNumber = dto.PhoneNumber;

        if (dto.LinkedInUrl is not null)
            existingContact.LinkedInUrl = dto.LinkedInUrl;

        if (dto.IsPrimaryRecruiter.HasValue)
            existingContact.IsPrimaryRecruiter = dto.IsPrimaryRecruiter;

        if (dto.Notes is not null)
            existingContact.Notes = dto.Notes;

        _context.Contacts.Update(existingContact);
        
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ContactTrackerDbContext.IsUniqueViolation(ex))
        {
            DuplicateFound();
        }

        return MapToReadDto(existingContact);
    }

    public async Task DeleteContactAsync(long id)
    {
        var contact = await _context.Contacts
            .FirstOrDefaultAsync(c => c.Id == id);

        if (contact == null)
        {
            throw new ResourceNotFoundException(nameof(Contact), id);
        }

        _context.Contacts.Remove(contact);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> CanDeleteContact(long contactId)
    {
        var eventCount = await _context.Events.Where(e => e.ContactId == contactId).CountAsync();
        return eventCount == 0;
    }

    public async Task<List<ContactReadDto>> SearchContactsAsync(string q)
    {
        var searchTerm = q.Trim().ToLower();

        var contacts = await _context.Contacts
            .AsNoTracking()
            .Where(c => c.FirstName.ToLower().Contains(searchTerm)
                || c.LastName.ToLower().Contains(searchTerm)
            )
            .ToListAsync();

        return contacts.Select(MapToReadDto).ToList();
    }

    private static ContactReadDto MapToReadDto(Contact contact)
    {
        return new ContactReadDto(
            contact.Id,
            contact.CompanyId,
            contact.FirstName,
            contact.LastName,
            contact.Title ?? string.Empty,
            contact.Email ?? string.Empty,
            contact.PhoneNumber ?? string.Empty,
            contact.LinkedInUrl ?? string.Empty,
            contact.IsPrimaryRecruiter = false,
            contact.Notes ?? string.Empty
        );
    }

    private void ValidateContactCreate(ContactCreateDto dto)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(dto.FirstName))
        {
            errors.Add("Contact first name is required");
        }

        if (string.IsNullOrWhiteSpace(dto.LastName))
        {
            errors.Add("Contact last name is required");
        }

        if (errors.Count > 0)
        {
            throw new ValidationException("Contact validation failed", errors);
        }
    }

    private void ValidateContactUpdate(ContactUpdateDto dto)
    {
        var errors = new List<string>();

        // For update, fields can be null (meaning don't update them)
        // But if they ARE provided, they shouldn't be empty/whitespace
        if (dto.FirstName is not null && string.IsNullOrWhiteSpace(dto.FirstName))
        {
            errors.Add("Contact first name cannot be empty");
        }

        if (dto.LastName is not null && string.IsNullOrWhiteSpace(dto.LastName))
        {
            errors.Add("Contact last name cannot be empty");
        }

        if (errors.Count > 0)
        {
            throw new ValidationException("Contact validation failed", errors);
        }
    }

    private static void DuplicateFound()
    {
        throw new ValidationException(
            "A contact with this name already exists.",
            new List<string> { "Contact first and last name must be unique." }
        );
    }
}