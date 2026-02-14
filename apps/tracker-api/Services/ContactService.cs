using Microsoft.EntityFrameworkCore;
using ContactTracker.TrackerAPI.Common;
using ContactTracker.SharedDTOs;
using ContactTracker.ServerDomain;

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
            .Include(e => e.Company)
            .AsNoTracking()
            .ToListAsync();

        return contacts.Select(MapToReadDto).ToList();
    }

    public async Task<ContactReadDto> GetContactByIdAsync(long id)
    {
        var contact = await _context.Contacts
             .Include(e => e.Company)
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
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Title = dto.Title,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            LinkedInUrl = dto.LinkedInUrl,
            IsPrimaryRecruiter = dto.IsPrimaryRecruiter,
            Notes = dto.Notes
        };

        await ResolveEntitiesAsync(dto, contact);

        _context.Contacts.Add(contact);

        try
        {
            await _context.SaveChangesAsync();

            // Ensure the company is loaded for the response DTO
            if (contact.CompanyId.HasValue && contact.Company == null)
            {
                await _context.Entry(contact).Reference(c => c.Company).LoadAsync();
            }
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
        if (dto.FirstName is not null || dto.LastName is not null)
        {
            var newFirst = dto.FirstName ?? existingContact.FirstName;
            var newLast = dto.LastName ?? existingContact.LastName;

            var exists = await _context.Contacts
                .AnyAsync(c => c.Id != id
                    && c.FirstName.ToLower() == newFirst.ToLower()
                    && c.LastName.ToLower() == newLast.ToLower());

            if (exists) DuplicateFound();

            existingContact.FirstName = newFirst;
            existingContact.LastName = newLast;
        }

        // Company
        if (dto.CompanyId == -1)
        {
            existingContact.CompanyId = null;
            existingContact.Company = null;
        }
        else if (dto.CompanyId.HasValue)
        {
            existingContact.CompanyId = dto.CompanyId;
            existingContact.Company = null;
        }
        else if (dto.UpdateCompany is not null)
        {
            await HandleInlineCompanyUpdate(existingContact, dto.UpdateCompany);
        }

        if (dto.Title is not null)
            existingContact.Title = string.IsNullOrEmpty(dto.Title) ? null : dto.Title;

        if (dto.Email is not null)
            existingContact.Email = string.IsNullOrEmpty(dto.Email) ? null : dto.Email;

        if (dto.PhoneNumber is not null)
            existingContact.PhoneNumber = string.IsNullOrEmpty(dto.PhoneNumber) ? null : dto.PhoneNumber;

        if (dto.LinkedInUrl is not null)
            existingContact.LinkedInUrl = string.IsNullOrEmpty(dto.LinkedInUrl) ? null : dto.LinkedInUrl;

        if (dto.IsPrimaryRecruiter.HasValue)
            existingContact.IsPrimaryRecruiter = dto.IsPrimaryRecruiter;

        if (dto.Notes is not null)
            existingContact.Notes = string.IsNullOrEmpty(dto.Notes) ? null : dto.Notes;

        _context.Contacts.Update(existingContact);

        try
        {
            await _context.SaveChangesAsync();
            await _context.Entry(existingContact).Reference(c => c.Company).LoadAsync();
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

    private async Task HandleInlineCompanyUpdate(Contact contact, CompanyUpdateDto updateDto)
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
            contact.CompanyId = existingCompany.Id;
            contact.Company = null;
            return;
        }

        // Create a new company (don't update the existing one)
        contact.Company = new Company { Name = newName };
        contact.CompanyId = null; // Will be assigned by EF after insert
    }

    private static ContactReadDto MapToReadDto(Contact contact)
    {
        return new ContactReadDto(
            contact.Id,
            contact.CompanyId,
            contact.Company is not null ? new CompanyReadDto(
                contact.Company.Id,
                contact.Company.Name,
                contact.Company.Website,
                contact.Company.Industry,
                contact.Company.SizeRange,
                contact.Company.Notes
            ) : null,
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

    private async Task ResolveEntitiesAsync(ContactCreateDto dto, Contact contact)
    {
        if (dto.CompanyId.HasValue)
        {
            contact.CompanyId = dto.CompanyId;
        }
        else if (dto.NewCompany is not null && !string.IsNullOrWhiteSpace(dto.NewCompany.Name))
        {
            var normalizedName = dto.NewCompany.Name.Trim();
            var existingCompany = await _context.Companies
                .FirstOrDefaultAsync(c => c.Name == normalizedName);

            if (existingCompany is not null)
                contact.CompanyId = existingCompany.Id;
            else
                contact.Company = new Company { Name = normalizedName };
        }
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