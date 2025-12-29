using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using tracker_api.Common;

namespace tracker_api.Tests;

/// <summary>
/// Integration tests for Contact API endpoints.
/// These tests use an in-memory database, so they won't affect your PostgreSQL database.
/// </summary>
public class ContactEndpointsTests : IClassFixture<CustomWebApplicationFactory>, IDisposable
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;
    private readonly ContactTrackerDbContext _context;

    public ContactEndpointsTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();

        // Get the database context from the factory
        _context = _factory.GetDbContext();

        // Clean database before each test
        CleanDatabase();
    }

    private void CleanDatabase()
    {
        _context.Contacts.RemoveRange(_context.Contacts);
        _context.Companies.RemoveRange(_context.Companies);
        _context.SaveChanges();
    }

    public void Dispose()
    {
        _client?.Dispose();
    }

    #region GET /api/contacts

    [Fact]
    public async Task GetAllContacts_WhenNoContacts_ReturnsEmptyList()
    {
        // Act
        var response = await _client.GetAsync("/api/contacts");

        // Assert
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<ApiResult<List<Contact>>>();

        Assert.NotNull(result);
        Assert.True(result.Success);
        Assert.NotNull(result.Data);
        Assert.Empty(result.Data);
    }

    [Fact]
    public async Task GetAllContacts_WhenContactsExist_ReturnsAllContacts()
    {
        // Arrange
        var company = new Company { Name = "Test Company", Industry = "Tech" };
        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        var contact1 = new Contact
        {
            FirstName = "John",
            LastName = "Doe",
            CompanyId = company.Id,
            Company = company
        };
        var contact2 = new Contact
        {
            FirstName = "Jane",
            LastName = "Smith",
            CompanyId = company.Id,
            Company = company
        };
        _context.Contacts.AddRange(contact1, contact2);
        await _context.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync("/api/contacts");

        // Assert
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<ApiResult<List<Contact>>>();

        Assert.NotNull(result);
        Assert.True(result.Success);
        Assert.NotNull(result.Data);
        Assert.Equal(2, result.Data.Count);
    }

    #endregion

    #region GET /api/contacts/{id}

    [Fact]
    public async Task GetContactById_WhenContactExists_ReturnsContact()
    {
        // Arrange
        var company = new Company { Name = "Test Company", Industry = "Tech" };
        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        var contact = new Contact
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john@test.com",
            CompanyId = company.Id,
            Company = company
        };
        _context.Contacts.Add(contact);
        await _context.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync($"/api/contacts/{contact.Id}");

        // Assert
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<ApiResult<Contact>>();

        Assert.NotNull(result);
        Assert.True(result.Success);
        Assert.NotNull(result.Data);
        Assert.Equal("John", result.Data.FirstName);
        Assert.Equal("Doe", result.Data.LastName);
        Assert.Equal("john@test.com", result.Data.Email);
    }

    [Fact]
    public async Task GetContactById_WhenContactDoesNotExist_ReturnsNotFound()
    {
        // Act
        var response = await _client.GetAsync("/api/contacts/99999");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<ApiResult<Contact>>();

        Assert.NotNull(result);
        Assert.False(result.Success);
    }

    #endregion

    #region POST /api/contacts

    [Fact]
    public async Task CreateContact_WithValidData_ReturnsCreatedContact()
    {
        // Arrange
        var company = new Company { Name = "Test Company", Industry = "Tech" };
        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        // When sending JSON to the API, we don't need to include the Company navigation property
        // The API will handle the relationship via CompanyId
        var newContact = new
        {
            FirstName = "Alice",
            LastName = "Johnson",
            Email = "alice@test.com",
            PhoneNumber = "555-0100",
            Title = "Engineer",
            CompanyId = company.Id
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/contacts", newContact);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<ApiResult<Contact>>();
        Assert.NotNull(result);
        Assert.True(result.Success);
        Assert.NotNull(result.Data);
        Assert.Equal("Alice", result.Data.FirstName);
        Assert.Equal("Johnson", result.Data.LastName);
        Assert.True(result.Data.Id > 0); // Verify ID was assigned

        // Verify Location header (if present)
        if (response.Headers.Location != null)
        {
            Assert.Contains($"/api/contacts/{result.Data.Id}", response.Headers.Location.ToString());
        }

        // Verify it's actually in the database
        var dbContact = await _context.Contacts.FindAsync(result.Data.Id);
        Assert.NotNull(dbContact);
        Assert.Equal("Alice", dbContact.FirstName);
    }

    [Fact]
    public async Task CreateContact_WithoutFirstName_ReturnsBadRequest()
    {
        // Arrange
        var company = new Company { Name = "Test Company", Industry = "Tech" };
        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        // Using anonymous object without FirstName will cause deserialization error
        // The API will return 400 BadRequest before reaching your validation
        var invalidJson = $@"{{
            ""LastName"": ""Johnson"",
            ""CompanyId"": {company.Id}
        }}";
        var content = new StringContent(invalidJson, System.Text.Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/contacts", content);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateContact_WithoutLastName_ReturnsBadRequest()
    {
        // Arrange
        var company = new Company { Name = "Test Company", Industry = "Tech" };
        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        // Using anonymous object without LastName will cause deserialization error
        var invalidJson = $@"{{
            ""FirstName"": ""Alice"",
            ""CompanyId"": {company.Id}
        }}";
        var content = new StringContent(invalidJson, System.Text.Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/contacts", content);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateContact_WithEmptyFirstName_ReturnsBadRequest()
    {
        // Arrange
        var company = new Company { Name = "Test Company", Industry = "Tech" };
        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        var invalidContact = new
        {
            FirstName = "",  // Empty string - this should reach your validation
            LastName = "Johnson",
            CompanyId = company.Id
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/contacts", invalidContact);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<ApiResult<Contact>>();
        Assert.NotNull(result);
        Assert.False(result.Success);
        Assert.NotNull(result.Errors);
        Assert.Contains(result.Errors, e => e.Contains("first name", StringComparison.OrdinalIgnoreCase));
    }

    #endregion

    #region PUT /api/contacts/{id}

    [Fact]
    public async Task UpdateContact_WithValidData_ReturnsUpdatedContact()
    {
        // Arrange
        var company = new Company { Name = "Test Company", Industry = "Tech" };
        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        var contact = new Contact
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john@test.com",
            CompanyId = company.Id,
            Company = company
        };
        _context.Contacts.Add(contact);
        await _context.SaveChangesAsync();

        var updatedContact = new
        {
            FirstName = "John",
            LastName = "Updated",
            Email = "john.updated@test.com",
            PhoneNumber = "555-9999",
            Title = "Senior Engineer",
            CompanyId = company.Id
        };

        // Act
        var response = await _client.PutAsJsonAsync($"/api/contacts/{contact.Id}", updatedContact);

        // Assert
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<ApiResult<Contact>>();
        Assert.NotNull(result);
        Assert.True(result.Success);
        Assert.NotNull(result.Data);
        Assert.Equal("Updated", result.Data.LastName);
        Assert.Equal("john.updated@test.com", result.Data.Email);
        Assert.Equal("555-9999", result.Data.PhoneNumber);

        // Verify database was updated - use a fresh context from the factory
        using var verifyScope = _factory.Services.CreateScope();
        var verifyContext = verifyScope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();
        var dbContact = await verifyContext.Contacts
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == contact.Id);
        Assert.NotNull(dbContact);
        Assert.Equal("Updated", dbContact.LastName);
    }

    [Fact]
    public async Task UpdateContact_WhenContactDoesNotExist_ReturnsNotFound()
    {
        // Arrange
        var company = new Company { Name = "Test Company", Industry = "Tech" };
        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        var updatedContact = new
        {
            FirstName = "John",
            LastName = "Doe",
            CompanyId = company.Id
        };

        // Act
        var response = await _client.PutAsJsonAsync("/api/contacts/99999", updatedContact);

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UpdateContact_WithInvalidData_ReturnsBadRequest()
    {
        // Arrange
        var company = new Company { Name = "Test Company", Industry = "Tech" };
        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        var contact = new Contact
        {
            FirstName = "John",
            LastName = "Doe",
            CompanyId = company.Id,
            Company = company
        };
        _context.Contacts.Add(contact);
        await _context.SaveChangesAsync();

        var invalidUpdate = new
        {
            FirstName = "", // Invalid
            LastName = "Doe",
            CompanyId = company.Id
        };

        // Act
        var response = await _client.PutAsJsonAsync($"/api/contacts/{contact.Id}", invalidUpdate);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    #endregion

    #region DELETE /api/contacts/{id}

    [Fact]
    public async Task DeleteContact_WhenContactExists_ReturnsNoContent()
    {
        // Arrange
        var company = new Company { Name = "Test Company", Industry = "Tech" };
        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        var contact = new Contact
        {
            FirstName = "John",
            LastName = "Doe",
            CompanyId = company.Id,
            Company = company
        };
        _context.Contacts.Add(contact);
        await _context.SaveChangesAsync();
        var contactId = contact.Id;

        // Act
        var response = await _client.DeleteAsync($"/api/contacts/{contactId}");

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        // Verify contact was deleted from database
        var getResponse = await _client.GetAsync($"/api/contacts/{contactId}");
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    [Fact]
    public async Task DeleteContact_WhenContactDoesNotExist_ReturnsNotFound()
    {
        // Act
        var response = await _client.DeleteAsync("/api/contacts/99999");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    #endregion
}
