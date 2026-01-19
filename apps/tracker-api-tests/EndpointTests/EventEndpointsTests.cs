using System.Net;
using System.Net.Http.Json;
using tracker_api.Common;
using tracker_api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace tracker_api.Tests;

public class EventEndpointsTests : IClassFixture<CustomWebApplicationFactory>, IDisposable
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;
    private readonly ContactTrackerDbContext _context;

    public EventEndpointsTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        _context = factory.GetDbContext();
        CleanDatabase();
    }

    private ContactTrackerDbContext GetFreshContext()
    {
        // Get a new context to see the latest changes
        return _factory.GetDbContext();
    }

    private void CleanDatabase()
    {
        _context.Events.RemoveRange(_context.Events);
        _context.EventTypes.RemoveRange(_context.EventTypes);
        _context.SaveChanges();
    }

    [Fact]
    public async Task CreateEvent_WithValidData_ReturnsEvent()
    {
        // Arrange
        // Since DatabaseGeneratedOption.None is set, we MUST provide a manual ID
        var eventType = new EventType
        {
            Id = 1,
            Name = "Interview",
            Category = "General",
            IsSystemDefined = true
        };

        _context.EventTypes.Add(eventType);
        await _context.SaveChangesAsync();

        // Create the payload matching the SourceType and DirectionType enums
        var newEvent = new
        {
            EventTypeId = eventType.Id,
            OccurredAt = DateTime.UtcNow,
            Source = SourceType.Email,
            Direction = DirectionType.Inbound,
            Summary = "Initial Outreach",
            Details = "Reached out via InMail"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/events", newEvent);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<ApiResult<Event>>(
            CustomWebApplicationFactory.JsonOptions);

        Assert.NotNull(result);
        Assert.True(result.Success);
        Assert.Equal("Initial Outreach", result?.Data?.Summary);
        Assert.Equal(eventType.Id, result?.Data?.EventTypeId);

        // Verify it exists in the DB
        var dbEvent = await _context.Events.FindAsync(result?.Data?.Id);
        Assert.NotNull(dbEvent);
    }

    [Fact]
    public async Task CreateEvent_WithExistingCompanyName_LinksToExistingCompany()
    {
        // Arrange
        var existingCompany = new Company { Name = "Existing Corp" };
        _context.Companies.Add(existingCompany);

        var eventType = new EventType { Id = 2, Name = "Call", Category = "General", IsSystemDefined = true };
        _context.EventTypes.Add(eventType);
        await _context.SaveChangesAsync();

        var dto = new EventCreateDto(
            CompanyId: null,
            NewCompany: new CompanyCreateDto("Existing Corp", null, null, null, null), // Matches existing name
            ContactId: null, NewContact: null, RoleId: null, NewRole: null,
            EventTypeId: 2, OccurredAt: DateTime.UtcNow, Summary: "Test", Details: "Test",
            Source: SourceType.Email, Direction: DirectionType.Inbound
        );

        // Act
        var response = await _client.PostAsJsonAsync("/api/events", dto);
        var result = await response.Content.ReadFromJsonAsync<ApiResult<EventReadDto>>(CustomWebApplicationFactory.JsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.Equal(existingCompany.Id, result?.Data?.CompanyId); // Verification: Linked to existing ID

        // Verify no second company was created in DB
        var companyCount = await _context.Companies.CountAsync(c => c.Name == "Existing Corp");
        Assert.Equal(1, companyCount);
    }

    [Fact]
    public async Task CreateEvent_WithNewCompanyAndRole_CreatesAndLinksBoth()
    {
        // Arrange
        var eventType = new EventType { Id = 3, Name = "Meeting", Category = "General", IsSystemDefined = true };
        _context.EventTypes.Add(eventType);
        await _context.SaveChangesAsync();

        var dto = new EventCreateDto(
            CompanyId: null,
            NewCompany: new CompanyCreateDto("Startup Inc", "https://startup.io", null, null, null),
            ContactId: null, NewContact: null,
            RoleId: null,
            NewRole: new RoleCreateDto(null, "Founding Engineer", null, "Remote", RoleLevel.EngineeringManager),
            EventTypeId: 3, OccurredAt: DateTime.UtcNow, Summary: "Founders Meeting", Details: "Initial chat",
            Source: SourceType.LinkedIn, Direction: DirectionType.Inbound
        );

        // Act
        var response = await _client.PostAsJsonAsync("/api/events", dto);
        var result = await response.Content.ReadFromJsonAsync<ApiResult<EventReadDto>>(CustomWebApplicationFactory.JsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.NotNull(result);
        Assert.NotNull(result.Data);

        // Check the database to ensure they are linked
        var dbEvent = await _context.Events
            .Include(e => e.Company)
            .Include(e => e.Role)
            .FirstOrDefaultAsync(e => e.Id == result.Data.Id);

        Assert.NotNull(dbEvent);
        Assert.NotNull(dbEvent.Company);
        Assert.NotNull(dbEvent.Role);
        Assert.Equal("Startup Inc", dbEvent.Company.Name);
        Assert.Equal("Founding Engineer", dbEvent.Role.Title);

        // CRITICAL: Verify the Role belongs to the new Company
        Assert.Equal(dbEvent.CompanyId, dbEvent.Role.CompanyId);
    }

    [Fact]
    public async Task UpdateEvent_WithExistingCompanyName_ReLinksEvent()
    {
        // Arrange
        var originalCompany = new Company { Name = "Original Corp" };
        var existingOtherCompany = new Company { Name = "Target Corp" };
        var @event = new Event
        {
            OccurredAt = DateTime.UtcNow,
            Source = SourceType.Email,
            Direction = DirectionType.Inbound,
            Company = originalCompany,
            EventTypeId = 1
        };

        _context.Companies.AddRange(originalCompany, existingOtherCompany);
        _context.Events.Add(@event);
        await _context.SaveChangesAsync();

        var updateDto = new EventUpdateDto(
            CompanyId: null,
            UpdateCompany: new CompanyUpdateDto("Target Corp", null, null, null, null), // Match existing
            ContactId: null, UpdateContact: null, RoleId: null, UpdateRole: null,
            EventTypeId: null, OccurredAt: null, Summary: "Updated Summary", Details: null,
            Source: null, Direction: null
        );

        // Act
        var response = await _client.PatchAsJsonAsync($"/api/events/{@event.Id}", updateDto);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var freshContext = GetFreshContext();
        var dbEvent = await freshContext.Events.Include(e => e.Company).FirstAsync(e => e.Id == @event.Id);
        Assert.Equal(existingOtherCompany.Id, dbEvent.CompanyId); // Linked to the other existing company
        Assert.Equal("Target Corp", dbEvent.Company?.Name);
    }

    [Fact]
    public async Task UpdateEvent_InlineCompanyNameChange_PreservesOtherCompanyFields()
    {
        // Arrange
        var company = new Company
        {
            Name = "Old Name",
            Website = "https://important-site.com",
            Notes = "Sensitive data"
        };
        var @event = new Event { OccurredAt = DateTime.UtcNow, Source = SourceType.Email, Direction = DirectionType.Inbound, Company = company, EventTypeId = 1 };

        _context.Events.Add(@event);
        await _context.SaveChangesAsync();

        var updateDto = new EventUpdateDto(
            CompanyId: null,
            UpdateCompany: new CompanyUpdateDto("New Name", null, null, null, null), // Only name provided
            ContactId: null, UpdateContact: null, RoleId: null, UpdateRole: null,
            EventTypeId: null, OccurredAt: null, Summary: null, Details: null,
            Source: null, Direction: null
        );

        // Act
        await _client.PatchAsJsonAsync($"/api/events/{@event.Id}", updateDto);

        // Assert
        using var freshContext = GetFreshContext();
        var dbCompany = await freshContext.Companies.FirstAsync(c => c.Id == company.Id);
        Assert.Equal("New Name", dbCompany.Name);
        Assert.Equal("https://important-site.com", dbCompany.Website); // Still exists!
        Assert.Equal("Sensitive data", dbCompany.Notes); // Still exists!
    }

    [Fact]
    public async Task UpdateEvent_WithNewCompanyAndRole_CreatesAndLinksBoth()
    {
        // Arrange
        var @event = new Event { OccurredAt = DateTime.UtcNow, Source = SourceType.Email, Direction = DirectionType.Inbound, EventTypeId = 1 };
        _context.Events.Add(@event);
        await _context.SaveChangesAsync();

        var updateDto = new EventUpdateDto(
            CompanyId: null,
            UpdateCompany: new CompanyUpdateDto("Brand New Startup", null, null, null, null),
            ContactId: null, UpdateContact: null,
            RoleId: null,
            UpdateRole: new RoleUpdateDto(null, "CTO", null, "Remote", RoleLevel.EngineeringManager),
            EventTypeId: null, OccurredAt: null, Summary: null, Details: null,
            Source: null, Direction: null
        );

        // Act
        await _client.PatchAsJsonAsync($"/api/events/{@event.Id}", updateDto);

        // Assert
        using var freshContext = GetFreshContext();
        var dbEvent = await freshContext.Events
            .Include(e => e.Company)
            .Include(e => e.Role)
            .FirstAsync(e => e.Id == @event.Id);

        Assert.NotNull(dbEvent.Company);
        Assert.NotNull(dbEvent.Role);
        Assert.Equal(dbEvent.CompanyId, dbEvent.Role.CompanyId); // They are linked to each other
        Assert.Equal("Brand New Startup", dbEvent.Company.Name);
        Assert.Equal("CTO", dbEvent.Role.Title);
    }

    [Fact]
    public async Task GetEventById_WhenMissing_ReturnsNotFound()
    {
        // Act
        var response = await _client.GetAsync("/api/events/9999");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    public void Dispose() => _client?.Dispose();
}