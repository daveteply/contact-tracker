using ContactTracker.Libs.Shared.DTOs;

namespace ContactTracker.TrackerAPI.Services;

public interface IContactService
{
    /// <summary>
    /// Get all contacts
    /// </summary>
    Task<List<ContactReadDto>> GetAllContactsAsync();

    /// <summary>
    /// Get contact by ID
    /// </summary>
    Task<ContactReadDto> GetContactByIdAsync(long id);

    /// <summary>
    /// Create a new contact
    /// </summary>
    Task<ContactReadDto> CreateContactAsync(ContactCreateDto contact);

    /// <summary>
    /// Update an existing contact
    /// </summary>
    Task<ContactReadDto> UpdateContactAsync(long id, ContactUpdateDto contact);

    /// <summary>
    /// Search Contacts by First or Last Name
    /// </summary>
    /// <param name="q">Name search string</param>
    /// <returns></returns>
    Task<List<ContactReadDto>> SearchContactsAsync(string q);

    /// <summary>
    /// Delete a contact by ID
    /// </summary>
    Task DeleteContactAsync(long id);

    /// <summary>
    /// Checks for related records
    /// </summary>
    /// <param name="contactId"></param>
    /// <returns></returns>
    Task<bool> CanDeleteContact(long contactId);
}
