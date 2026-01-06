using Microsoft.EntityFrameworkCore;
using tracker_api.Common;
using tracker_api.DTOs;

namespace tracker_api.Services;

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
        await _context.SaveChangesAsync();

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
        if (dto.CompanyId.HasValue)
            existingContact.CompanyId = dto.CompanyId;

        if (dto.FirstName != null)
            existingContact.FirstName = dto.FirstName;

        if (dto.LastName != null)
            existingContact.LastName = dto.LastName;

        if (dto.Title != null)
            existingContact.Title = dto.Title;

        if (dto.Email != null)
            existingContact.Email = dto.Email;

        if (dto.PhoneNumber != null)
            existingContact.PhoneNumber = dto.PhoneNumber;

        if (dto.LinkedInUrl != null)
            existingContact.LinkedInUrl = dto.LinkedInUrl;

        if (dto.IsPrimaryRecruiter.HasValue)
            existingContact.IsPrimaryRecruiter = dto.IsPrimaryRecruiter;

        if (dto.Notes != null)
            existingContact.Notes = dto.Notes;

        existingContact.UpdatedAt = DateTime.UtcNow;

        _context.Contacts.Update(existingContact);
        await _context.SaveChangesAsync();

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

    private static ContactReadDto MapToReadDto(Contact contact)
    {
        return new ContactReadDto(
            contact.Id,
            contact.CompanyId,
            contact.FirstName,
            contact.LastName,
            contact.Title,
            contact.Email,
            contact.PhoneNumber,
            contact.LinkedInUrl,
            contact.IsPrimaryRecruiter,
            contact.Notes
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
        if (dto.FirstName != null && string.IsNullOrWhiteSpace(dto.FirstName))
        {
            errors.Add("Contact first name cannot be empty");
        }

        if (dto.LastName != null && string.IsNullOrWhiteSpace(dto.LastName))
        {
            errors.Add("Contact last name cannot be empty");
        }

        if (errors.Count > 0)
        {
            throw new ValidationException("Contact validation failed", errors);
        }
    }
}