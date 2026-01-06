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
        var result = await response.Content.ReadFromJsonAsync<ApiResult<Role>>();
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

    public void Dispose() => _client?.Dispose();
}