using System.Net;
using System.Net.Http.Json;
using ContactTracker.SharedDTOs;
using ContactTracker.TrackerAPI.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ContactTracker.TrackerAPI.Tests;

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
    public async Task CreateRole_WithExistingCompanyId_ReturnsCreated()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var company = new Company { Name = "Dream Corp", Industry = "Software" };
        context.Companies.Add(company);
        await context.SaveChangesAsync();

        var newRole = new RoleCreateDto(
            CompanyId: company.Id,
            Company: null,
            Title: "Staff Engineer",
            JobPostingUrl: null,
            Location: "Remote",
            Level: RoleLevel.StaffEngineer
        );

        // Act
        var response = await _client.PostAsJsonAsync("/api/roles", newRole);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<ApiResult<RoleReadDto>>(
            CustomWebApplicationFactory.JsonOptions
        );
        Assert.NotNull(result?.Data);
        Assert.Equal("Staff Engineer", result.Data.Title);
        Assert.Equal(company.Id, result.Data.CompanyId);
        Assert.NotNull(result.Data.Company);
        Assert.Equal("Dream Corp", result.Data.Company.Name);
    }

    [Fact]
    public async Task CreateRole_WithNewCompany_CreatesCompanyAndRole()
    {
        // Arrange
        var newRole = new RoleCreateDto(
            CompanyId: null,
            Company: new CompanyCreateDto(
                Name: "Startup Inc",
                Website: null,
                Industry: null,
                SizeRange: null,
                Notes: null
            ),
            Title: "Engineering Manager",
            JobPostingUrl: null,
            Location: "San Francisco",
            Level: RoleLevel.EngineeringManager
        );

        // Act
        var response = await _client.PostAsJsonAsync("/api/roles", newRole);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<ApiResult<RoleReadDto>>(
            CustomWebApplicationFactory.JsonOptions
        );
        Assert.NotNull(result?.Data);
        Assert.Equal("Engineering Manager", result.Data.Title);
        Assert.NotNull(result.Data.Company);
        Assert.Equal("Startup Inc", result.Data.Company.Name);

        // Verify company was created in database
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();
        var company = await context.Companies.FirstOrDefaultAsync(c => c.Name == "Startup Inc");
        Assert.NotNull(company);
    }

    [Fact]
    public async Task CreateRole_WithExistingCompanyName_DeduplicatesCompany()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var existingCompany = new Company { Name = "Tech Giant" };
        context.Companies.Add(existingCompany);
        await context.SaveChangesAsync();

        var newRole = new RoleCreateDto(
            CompanyId: null,
            Company: new CompanyCreateDto(
                Name: "Tech Giant", // Same name as existing
                Website: null,
                Industry: null,
                SizeRange: null,
                Notes: null
            ),
            Title: "Senior Engineer",
            JobPostingUrl: null,
            Location: "New York",
            Level: RoleLevel.StaffEngineer
        );

        // Act
        var response = await _client.PostAsJsonAsync("/api/roles", newRole);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<ApiResult<RoleReadDto>>(
            CustomWebApplicationFactory.JsonOptions
        );
        Assert.NotNull(result?.Data);
        Assert.Equal(existingCompany.Id, result.Data.CompanyId); // Should link to existing company

        // Verify no duplicate company was created
        var companyCount = await context.Companies.CountAsync(c => c.Name == "Tech Giant");
        Assert.Equal(1, companyCount);
    }

    [Fact]
    public async Task UpdateRole_WithNewCompany_SwitchesToNewCompany()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var oldCompany = new Company { Name = "Old Corp" };
        var role = new Role
        {
            Title = "Developer",
            Level = RoleLevel.StaffEngineer,
            Company = oldCompany
        };
        context.Roles.Add(role);
        await context.SaveChangesAsync();

        var updateDto = new RoleUpdateDto(
            CompanyId: null,
            Company: new CompanyUpdateDto(
                Name: "New Corp",
                Website: null,
                Industry: null,
                SizeRange: null,
                Notes: null
            ),
            Title: null,
            JobPostingUrl: null,
            Location: null,
            Level: null
        );

        // Act
        var response = await _client.PatchAsJsonAsync($"/api/roles/{role.Id}", updateDto);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<ApiResult<RoleReadDto>>(
            CustomWebApplicationFactory.JsonOptions
        );
        Assert.NotNull(result?.Data);
        Assert.NotNull(result.Data.Company);
        Assert.Equal("New Corp", result.Data.Company.Name);
        Assert.NotEqual(oldCompany.Id, result.Data.CompanyId); // Should have different company
    }

    [Fact]
    public async Task UpdateRole_WithExistingCompanyId_SwitchesToExistingCompany()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var company1 = new Company { Name = "Company One" };
        var company2 = new Company { Name = "Company Two" };
        var role = new Role
        {
            Title = "Developer",
            Level = RoleLevel.StaffEngineer,
            Company = company1
        };
        context.Companies.Add(company2);
        context.Roles.Add(role);
        await context.SaveChangesAsync();

        var updateDto = new RoleUpdateDto(
            CompanyId: company2.Id,
            Company: null,
            Title: null,
            JobPostingUrl: null,
            Location: null,
            Level: null
        );

        // Act
        var response = await _client.PatchAsJsonAsync($"/api/roles/{role.Id}", updateDto);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<ApiResult<RoleReadDto>>(
            CustomWebApplicationFactory.JsonOptions
        );
        Assert.NotNull(result?.Data);
        Assert.Equal(company2.Id, result.Data.CompanyId);
        Assert.Equal("Company Two", result.Data.Company?.Name);
    }

    [Fact]
    public async Task CreateRole_WithEmptyTitle_ReturnsBadRequest()
    {
        // Arrange
        var invalidRole = new RoleCreateDto(
            CompanyId: null,
            Company: null,
            Title: "",
            JobPostingUrl: null,
            Location: null,
            Level: RoleLevel.StaffEngineer
        );

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
            Level = RoleLevel.StaffEngineer
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
        var result = await response.Content.ReadFromJsonAsync<ApiResult<List<RoleReadDto>>>(
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

        context.Roles.Add(new Role { Title = "Staff Software Engineer", Level = RoleLevel.StaffEngineer });
        context.Roles.Add(new Role { Title = "Tech Writer", Level = RoleLevel.StaffEngineer });
        context.Roles.Add(new Role { Title = "Jr Software Engineer", Level = RoleLevel.StaffEngineer });
        await context.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync("/api/roles/search?q=So");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        // Assert
        var result = await response.Content.ReadFromJsonAsync<ApiResult<List<RoleReadDto>>>(
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
            Title = "Software Tester",
            Level = RoleLevel.StaffEngineer
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
            Title = "Software Tester",
            Level = RoleLevel.StaffEngineer
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