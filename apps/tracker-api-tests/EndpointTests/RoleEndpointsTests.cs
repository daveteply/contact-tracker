using System.Net;
using System.Net.Http.Json;
using tracker_api.Common;

namespace tracker_api.Tests;

public class RoleEndpointsTests : IClassFixture<CustomWebApplicationFactory>, IDisposable
{
    private readonly HttpClient _client;
    private readonly ContactTrackerDbContext _context;

    public RoleEndpointsTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
        _context = factory.GetDbContext();
        CleanDatabase();
    }

    private void CleanDatabase()
    {
        _context.Roles.RemoveRange(_context.Roles);
        _context.Companies.RemoveRange(_context.Companies);
        _context.SaveChanges();
    }

    [Fact]
    public async Task CreateRole_WithValidData_ReturnsCreated()
    {
        // Arrange
        var company = new Company { Name = "Dream Corp", Industry = "Software" };
        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

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
        var role = new Role
        {
            Title = "Staff Software Engineer",
        };

        _context.Roles.Add(role);
        await _context.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync("/api/roles/search?q=So");

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
        _context.Roles.Add(new Role { Title = "Staff Software Engineer", });
        _context.Roles.Add(new Role { Title = "Tech Writer", });
        _context.Roles.Add(new Role { Title = "Jr Software Engineer", });
        await _context.SaveChangesAsync();

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

    public void Dispose() => _client?.Dispose();
}