using System.Net;
using System.Net.Http.Json;
using tracker_api.Common;

namespace tracker_api.Tests;

public class CompanyEndpointsTests : IClassFixture<CustomWebApplicationFactory>, IDisposable
{
    private readonly HttpClient _client;
    private readonly ContactTrackerDbContext _context;

    public CompanyEndpointsTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
        _context = factory.GetDbContext();
        CleanDatabase();
    }

    private void CleanDatabase()
    {
        _context.Companies.RemoveRange(_context.Companies);
        _context.SaveChanges();
    }

    [Fact]
    public async Task CreateCompany_WithValidData_ReturnsCreated()
    {
        // Arrange
        var newCompany = new
        {
            Name = "OpenAI",
            Website = "https://openai.com",
            Industry = "AI Research",
            SizeRange = "1000+",
            Notes = "High hiring bar"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/companies", newCompany);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var result = await response.Content
            .ReadFromJsonAsync<ApiResult<Company>>();

        Assert.NotNull(result);
        Assert.NotNull(result!.Data);
        Assert.Equal("OpenAI", result.Data!.Name);
        Assert.Equal("AI Research", result.Data.Industry);
        Assert.Equal("1000+", result.Data.SizeRange);
    }

    [Fact]
    public async Task CreateCompany_WithEmptyName_ReturnsBadRequest()
    {
        // Arrange
        var invalidCompany = new
        {
            Name = ""
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/companies", invalidCompany);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetCompanies_ReturnsCompanies()
    {
        // Arrange
        var company = new Company
        {
            Name = "Dream Corp",
            Industry = "Software"
        };

        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync("/api/companies");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content
            .ReadFromJsonAsync<ApiResult<List<Company>>>();

        Assert.NotNull(result);
        Assert.NotNull(result!.Data);
        Assert.Single(result.Data);
        Assert.Equal("Dream Corp", result.Data[0].Name);
    }

    [Fact]
    public async Task GetCompany_ById_ReturnsCompany()
    {
        // Arrange
        var company = new Company
        {
            Name = "Stripe",
            Industry = "FinTech"
        };

        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync($"/api/companies/{company.Id}");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content
            .ReadFromJsonAsync<ApiResult<Company>>();

        Assert.NotNull(result);
        Assert.NotNull(result!.Data);
        Assert.Equal(company.Id, result.Data!.Id);
        Assert.Equal("Stripe", result.Data.Name);
    }

    [Fact]
    public async Task GetCompany_WithUnknownId_ReturnsNotFound()
    {
        // Arrange
        var company = new Company { Name = "TempCo" };
        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        var unknownId = company.Id + 1;

        // Act
        var response = await _client.GetAsync($"/api/companies/{unknownId}");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    public void Dispose() => _client?.Dispose();
}
