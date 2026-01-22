using System.Net;
using System.Net.Http.Json;
using tracker_api.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace tracker_api.Tests;

/// <summary>
/// Integration tests for Role API endpoints.
/// These tests use a PostgreSQL test database with proper cleanup between tests.
/// </summary>
[Collection("Database collection")]
public class RoleEndpointsTests : IAsyncDisposable
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public RoleEndpointsTests(DatabaseFixture databaseFixture)
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
    public async Task CreateRole_WithValidData_ReturnsCreated()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var company = new Company { Name = "Dream Corp", Industry = "Software" };
        context.Companies.Add(company);
        await context.SaveChangesAsync();

        var newRole = new
        {
            Title = "Staff Engineer",
            Level = RoleLevel.StaffEngineer,
            CompanyId = company.Id,
            Location = "Remote"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/roles", newRole);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<ApiResult<Role>>(
            CustomWebApplicationFactory.JsonOptions
        );
        Assert.Equal("Staff Engineer", result?.Data?.Title);
        Assert.Equal(company.Id, result?.Data?.CompanyId);
    }

    [Fact]
    public async Task CreateRole_WithEmptyTitle_ReturnsBadRequest()
    {
        // Arrange
        var invalidRole = new { Title = "" };

        // Act
        var response = await _client.PostAsJsonAsync("/api/roles", invalidRole);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task SearchRole_ReturnsRole()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var role = new Role
        {
            Title = "Staff Software Engineer",
            // Don't need a company since CompanyId is nullable
        };

        context.Roles.Add(role);
        await context.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync("/api/roles/search?q=So");

        // Get detailed error
        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new Exception($"Search failed with {response.StatusCode}: {errorContent}");
        }

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        // Assert
        var result = await response.Content.ReadFromJsonAsync<ApiResult<List<Role>>>(
            CustomWebApplicationFactory.JsonOptions
        );

        Assert.NotNull(result);
        Assert.NotNull(result!.Data);
    }

    [Fact]
    public async Task SearchRole_ReturnsRolesFromList()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        context.Roles.Add(new Role { Title = "Staff Software Engineer", });
        context.Roles.Add(new Role { Title = "Tech Writer", });
        context.Roles.Add(new Role { Title = "Jr Software Engineer", });
        await context.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync("/api/roles/search?q=So");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        // Assert
        var result = await response.Content.ReadFromJsonAsync<ApiResult<List<Role>>>(
             CustomWebApplicationFactory.JsonOptions
        );

        Assert.NotNull(result);
        Assert.NotNull(result!.Data);
        Assert.Equal(2, result.Data.Count);
    }

    [Fact]
    public async Task CanDeleteRole_WithNoRelatedEvents_ReturnsTrue()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var role = new Role
        {
            Title = "Software Tester"
        };
        context.Roles.Add(role);
        await context.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync($"/api/roles/{role.Id}/can-delete");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<bool>(CustomWebApplicationFactory.JsonOptions);
        Assert.True(result);
    }

    [Fact]
    public async Task CanDeleteRole_WithRelatedEvents_ReturnsFalse()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var role = new Role
        {
            Title = "Software Tester"
        };
        context.Roles.Add(role);
        await context.SaveChangesAsync();

        // Get or create EventType
        var eventType = await context.EventTypes.FirstOrDefaultAsync();
        if (eventType == null)
        {
            eventType = new EventType
            {
                Id = 1,
                Name = "Meeting",
                Category = "Testing Category",
                IsSystemDefined = true
            };
            context.EventTypes.Add(eventType);
            await context.SaveChangesAsync();
        }
        // If eventType already exists, don't add it again - just use its Id

        var eventItem = new Event
        {
            RoleId = role.Id,
            EventTypeId = eventType.Id,
            Source = SourceType.Email,
            Direction = DirectionType.Inbound,
            OccurredAt = DateTime.UtcNow
        };
        context.Events.Add(eventItem);
        await context.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync($"/api/roles/{role.Id}/can-delete");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<bool>(CustomWebApplicationFactory.JsonOptions);
        Assert.False(result);
    }

    public async ValueTask DisposeAsync()
    {
        _client?.Dispose();
        await _factory.DisposeAsync();
    }
}