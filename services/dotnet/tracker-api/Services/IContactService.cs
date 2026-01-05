using tracker_api.DTOs;

namespace tracker_api.Services;


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
    /// Delete a contact by ID
    /// </summary>
    Task DeleteContactAsync(long id);
}
