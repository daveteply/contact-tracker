using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using tracker_api.Common;
using tracker_api.DTOs;

namespace tracker_api.Tests;

/// <summary>
/// Integration tests for Event API endpoints.
/// These tests use a PostgreSQL test database with proper cleanup between tests.
/// </summary>
[Collection("Database collection")]
public class EventEndpointsTests : IAsyncDisposable
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public EventEndpointsTests(DatabaseFixture databaseFixture)
    {
        _factory = new CustomWebApplicationFactory(databaseFixture);
        _client = _factory.CreateClient();

        // Clean database before each test
        CleanDatabase().GetAwaiter().GetResult();
    }

    private async Task CleanDatabase()
    {
        await _factory.ResetDatabaseAsync();
    }

    [Fact]
    public async Task CreateEvent_WithValidData_ReturnsEvent()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        // EventTypes are seeded, so we can use the seeded IDs
        // Or verify they exist first
        var eventType = await context.EventTypes.FirstOrDefaultAsync(et => et.Name == "Applied");

        // If not seeded in test DB, create one
        if (eventType == null)
        {
            eventType = new EventType
            {
                Id = 1,
                Name = "Interview",
                Category = "General",
                IsSystemDefined = true
            };
            context.EventTypes.Add(eventType);
            await context.SaveChangesAsync();
        }

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
        using var verifyScope = _factory.Services.CreateScope();
        var verifyContext = verifyScope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();
        var dbEvent = await verifyContext.Events.FindAsync(result?.Data?.Id);
        Assert.NotNull(dbEvent);
    }

    [Fact]
    public async Task CreateEvent_WithExistingCompanyName_LinksToExistingCompany()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var existingCompany = new Company { Name = "Existing Corp" };
        context.Companies.Add(existingCompany);

        // Use a seeded event type or create one
        var eventType = await context.EventTypes.FirstOrDefaultAsync();
        if (eventType == null)
        {
            eventType = new EventType { Id = 2, Name = "Call", Category = "General", IsSystemDefined = true };
            context.EventTypes.Add(eventType);
        }

        await context.SaveChangesAsync();

        var dto = new EventCreateDto(
            CompanyId: null,
            NewCompany: new CompanyCreateDto("Existing Corp", null, null, null, null), // Matches existing name
            ContactId: null, NewContact: null, RoleId: null, NewRole: null,
            EventTypeId: eventType.Id, OccurredAt: DateTime.UtcNow, Summary: "Test", Details: "Test",
            EventType: null,
            Source: SourceType.Email, Direction: DirectionType.Inbound
        );

        // Act
        var response = await _client.PostAsJsonAsync("/api/events", dto);
        var result = await response.Content.ReadFromJsonAsync<ApiResult<EventReadDto>>(CustomWebApplicationFactory.JsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.Equal(existingCompany.Id, result?.Data?.CompanyId); // Verification: Linked to existing ID

        // Verify no second company was created in DB
        using var verifyScope = _factory.Services.CreateScope();
        var verifyContext = verifyScope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();
        var companyCount = await verifyContext.Companies.CountAsync(c => c.Name == "Existing Corp");
        Assert.Equal(1, companyCount);
    }

    [Fact]
    public async Task CreateEvent_WithNewCompanyAndRole_CreatesAndLinksBoth()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var eventType = await context.EventTypes.FirstOrDefaultAsync();
        if (eventType == null)
        {
            eventType = new EventType { Id = 3, Name = "Meeting", Category = "General", IsSystemDefined = true };
            context.EventTypes.Add(eventType);
            await context.SaveChangesAsync();
        }

        var dto = new EventCreateDto(
            CompanyId: null,
            NewCompany: new CompanyCreateDto("Startup Inc", "https://startup.io", null, null, null),
            ContactId: null, NewContact: null,
            RoleId: null,
            NewRole: new RoleCreateDto(null, "Founding Engineer", null, "Remote", RoleLevel.EngineeringManager),
            EventTypeId: eventType.Id, OccurredAt: DateTime.UtcNow, Summary: "Founders Meeting", Details: "Initial chat",
            EventType: null,
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
        using var verifyScope = _factory.Services.CreateScope();
        var verifyContext = verifyScope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();
        var dbEvent = await verifyContext.Events
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
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var eventType = await context.EventTypes.FirstOrDefaultAsync();
        if (eventType == null)
        {
            eventType = new EventType { Id = 1, Name = "Applied", Category = "Application", IsSystemDefined = true };
            context.EventTypes.Add(eventType);
        }

        var originalCompany = new Company { Name = "Original Corp" };
        var existingOtherCompany = new Company { Name = "Target Corp" };
        var @event = new Event
        {
            OccurredAt = DateTime.UtcNow,
            Source = SourceType.Email,
            Direction = DirectionType.Inbound,
            Company = originalCompany,
            EventTypeId = eventType.Id
        };

        context.Companies.AddRange(originalCompany, existingOtherCompany);
        context.Events.Add(@event);
        await context.SaveChangesAsync();

        var updateDto = new EventUpdateDto(
            CompanyId: null,
            UpdateCompany: new CompanyUpdateDto("Target Corp", null, null, null, null), // Match existing
            ContactId: null, UpdateContact: null, RoleId: null, UpdateRole: null,
            EventTypeId: null, OccurredAt: null, Summary: "Updated Summary", Details: null,
            EventType: null,
            Source: null, Direction: null
        );

        // Act
        var response = await _client.PatchAsJsonAsync($"/api/events/{@event.Id}", updateDto);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var verifyScope = _factory.Services.CreateScope();
        var verifyContext = verifyScope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();
        var dbEvent = await verifyContext.Events.Include(e => e.Company).FirstAsync(e => e.Id == @event.Id);
        Assert.Equal(existingOtherCompany.Id, dbEvent.CompanyId); // Linked to the other existing company
        Assert.Equal("Target Corp", dbEvent.Company?.Name);
    }

    [Fact]
    public async Task UpdateEvent_InlineCompanyNameChange_PreservesOtherCompanyFields()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var eventType = await context.EventTypes.FirstOrDefaultAsync();
        if (eventType == null)
        {
            eventType = new EventType { Id = 1, Name = "Applied", Category = "Application", IsSystemDefined = true };
            context.EventTypes.Add(eventType);
        }

        var company = new Company
        {
            Name = "Old Name",
            Website = "https://important-site.com",
            Notes = "Sensitive data"
        };
        var @event = new Event
        {
            OccurredAt = DateTime.UtcNow,
            Source = SourceType.Email,
            Direction = DirectionType.Inbound,
            Company = company,
            EventTypeId = eventType.Id
        };

        context.Events.Add(@event);
        await context.SaveChangesAsync();

        var updateDto = new EventUpdateDto(
            CompanyId: null,
            UpdateCompany: new CompanyUpdateDto("New Name", null, null, null, null), // Only name provided
            ContactId: null, UpdateContact: null, RoleId: null, UpdateRole: null,
            EventTypeId: null, OccurredAt: null, Summary: null, Details: null,
            EventType: null,
            Source: null, Direction: null
        );

        // Act
        await _client.PatchAsJsonAsync($"/api/events/{@event.Id}", updateDto);

        // Assert
        using var verifyScope = _factory.Services.CreateScope();
        var verifyContext = verifyScope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();
        var dbCompany = await verifyContext.Companies.FirstAsync(c => c.Id == company.Id);
        Assert.Equal("Old Name", dbCompany.Name);
        Assert.Equal("https://important-site.com", dbCompany.Website); // Still exists!
        Assert.Equal("Sensitive data", dbCompany.Notes); // Still exists!
    }

    [Fact]
    public async Task UpdateEvent_WithNewCompanyAndRole_CreatesAndLinksBoth()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var eventType = await context.EventTypes.FirstOrDefaultAsync();
        if (eventType == null)
        {
            eventType = new EventType { Id = 1, Name = "Applied", Category = "Application", IsSystemDefined = true };
            context.EventTypes.Add(eventType);
        }

        var @event = new Event
        {
            OccurredAt = DateTime.UtcNow,
            Source = SourceType.Email,
            Direction = DirectionType.Inbound,
            EventTypeId = eventType.Id
        };
        context.Events.Add(@event);
        await context.SaveChangesAsync();

        var updateDto = new EventUpdateDto(
            CompanyId: null,
            UpdateCompany: new CompanyUpdateDto("Brand New Startup", null, null, null, null),
            ContactId: null, UpdateContact: null,
            RoleId: null,
            UpdateRole: new RoleUpdateDto(null, "CTO", null, "Remote", RoleLevel.EngineeringManager),
            EventTypeId: null, OccurredAt: null, Summary: null, Details: null,
            EventType: null,
            Source: null, Direction: null
        );

        // Act
        await _client.PatchAsJsonAsync($"/api/events/{@event.Id}", updateDto);

        // Assert
        using var verifyScope = _factory.Services.CreateScope();
        var verifyContext = verifyScope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();
        var dbEvent = await verifyContext.Events
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

    public async ValueTask DisposeAsync()
    {
        _client?.Dispose();
        await _factory.DisposeAsync();
    }
}