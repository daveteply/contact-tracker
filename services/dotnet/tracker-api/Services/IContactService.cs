namespace tracker_api.Services;


public interface IContactService
{
    /// <summary>
    /// Get all contacts
    /// </summary>
    Task<List<Contact>> GetAllContactsAsync();

    /// <summary>
    /// Get contact by ID
    /// </summary>
    Task<Contact> GetContactByIdAsync(long id);

    /// <summary>
    /// Create a new contact
    /// </summary>
    Task<Contact> CreateContactAsync(Contact contact);

    /// <summary>
    /// Update an existing contact
    /// </summary>
    Task<Contact> UpdateContactAsync(long id, Contact contact);

    /// <summary>
    /// Delete a contact by ID
    /// </summary>
    Task DeleteContactAsync(long id);
}
