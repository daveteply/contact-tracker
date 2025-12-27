using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore;
using tracker_api.Common;

namespace tracker_api.Services;

public class ContactService : IContactService
{
    private readonly ContactTrackerDbContext _context;

    public ContactService(ContactTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<List<Contact>> GetAllContactsAsync()
    {
        return await _context.Contacts
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Contact> GetContactByIdAsync(long id)
    {
        var contact = await _context.Contacts
             .AsNoTracking()
             .FirstOrDefaultAsync(c => c.Id == id);

        if (contact == null)
        {
            throw new ResourceNotFoundException(nameof(Contact), id);
        }

        return contact;
    }


    public async Task<Contact> CreateContactAsync(Contact contact)
    {
        ValidateContact(contact);

        _context.Contacts.Add(contact);
        await _context.SaveChangesAsync();

        return contact;
    }

    public async Task<Contact> UpdateContactAsync(long id, Contact contact)
    {
        var existingContact = await _context.Contacts
            .FirstOrDefaultAsync(c => c.Id == id);

        if (existingContact == null)
        {
            throw new ResourceNotFoundException(nameof(Contact), id);
        }

        ValidateContact(contact);

        // Update properties
        existingContact.Company = contact.Company;
        existingContact.CompanyId = contact.CompanyId;

        existingContact.FirstName = contact.FirstName;
        existingContact.LastName = contact.LastName;
        existingContact.Title = contact.Title;
        existingContact.Email = contact.Email;
        existingContact.PhoneNumber = contact.PhoneNumber;
        existingContact.LinkedInUrl = contact.LinkedInUrl;
        existingContact.IsPrimaryRecruiter = contact.IsPrimaryRecruiter;
        existingContact.Notes = contact.Notes;
        existingContact.UpdatedAt = DateTime.UtcNow;

        _context.Contacts.Update(existingContact);
        await _context.SaveChangesAsync();

        return existingContact;
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


    private void ValidateContact(Contact contact)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(contact.FirstName))
        {
            errors.Add("Contact first name is required");
        }

        if (string.IsNullOrWhiteSpace(contact.LastName))
        {
            errors.Add("Contact last name is required");
        }

        if (errors.Count > 0)
        {
            throw new ValidationException("Contact validation failed", errors);
        }
    }
}
