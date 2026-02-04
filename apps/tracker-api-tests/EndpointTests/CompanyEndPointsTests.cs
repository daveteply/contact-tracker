using System.Net;
using System.Net.Http.Json;
using ContactTracker.TrackerAPI.Common;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using ContactTracker.SharedDTOs;

namespace ContactTracker.TrackerAPI.Tests;

/// <summary>
/// Integration tests for Company API endpoints.
/// These tests use a PostgreSQL test database with proper cleanup between tests.
/// </summary>
[Collection("Database collection")]
public class CompanyEndpointsTests : IAsyncDisposable
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public CompanyEndpointsTests(DatabaseFixture databaseFixture)
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
            .ReadFromJsonAsync<ApiResult<Company>>(CustomWebApplicationFactory.JsonOptions);

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
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var company = new Company
        {
            Name = "Dream Corp",
            Industry = "Software"
        };

        context.Companies.Add(company);
        await context.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync("/api/companies");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content
            .ReadFromJsonAsync<ApiResult<List<Company>>>(CustomWebApplicationFactory.JsonOptions);

        Assert.NotNull(result);
        Assert.NotNull(result!.Data);
        Assert.Single(result.Data);
        Assert.Equal("Dream Corp", result.Data[0].Name);
    }

    [Fact]
    public async Task GetCompany_ById_ReturnsCompany()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var company = new Company
        {
            Name = "Stripe",
            Industry = "FinTech"
        };

        context.Companies.Add(company);
        await context.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync($"/api/companies/{company.Id}");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content
            .ReadFromJsonAsync<ApiResult<Company>>(CustomWebApplicationFactory.JsonOptions);

        Assert.NotNull(result);
        Assert.NotNull(result!.Data);
        Assert.Equal(company.Id, result.Data!.Id);
        Assert.Equal("Stripe", result.Data.Name);
    }

    [Fact]
    public async Task GetCompany_WithUnknownId_ReturnsNotFound()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var company = new Company { Name = "TempCo" };
        context.Companies.Add(company);
        await context.SaveChangesAsync();

        var unknownId = company.Id + 1;

        // Act
        var response = await _client.GetAsync($"/api/companies/{unknownId}");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task SearchCompany_ReturnsCompany()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var company = new Company
        {
            Name = "Search the World",
            Industry = "Software"
        };

        context.Companies.Add(company);
        await context.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync("/api/companies/search?q=earch");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        // Assert
        var result = await response.Content.ReadFromJsonAsync<ApiResult<List<Company>>>(CustomWebApplicationFactory.JsonOptions);

        Assert.NotNull(result);
        Assert.NotNull(result!.Data);
    }

    [Fact]
    public async Task SearchCompany_ReturnsCompanies()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        context.Companies.Add(new Company { Name = "Search the World", Industry = "Software" });
        context.Companies.Add(new Company { Name = "Software R Us", Industry = "Software" });
        context.Companies.Add(new Company { Name = "Building the World", Industry = "Software" });
        await context.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync("/api/companies/search?q=world");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        // Assert
        var result = await response.Content.ReadFromJsonAsync<ApiResult<List<Company>>>(CustomWebApplicationFactory.JsonOptions);

        Assert.NotNull(result);
        Assert.NotNull(result!.Data);
        Assert.Equal(2, result.Data.Count);
    }

    [Fact]
    public async Task CreateCompany_WithDuplicateName_ReturnsConflict()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        context.Companies.Add(new Company { Name = "OpenAI" });
        await context.SaveChangesAsync();

        var duplicate = new
        {
            Name = "openai"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/companies", duplicate);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var result = await response.Content
            .ReadFromJsonAsync<ApiResult<object>>(CustomWebApplicationFactory.JsonOptions);

        Assert.False(result!.Success);
    }

    [Fact]
    public async Task UpdateCompany_ToExistingName_ReturnsBadRequest()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var c1 = new Company { Name = "Google" };
        var c2 = new Company { Name = "Amazon" };
        context.Companies.AddRange(c1, c2);
        await context.SaveChangesAsync();

        var update = new
        {
            Name = "google"
        };

        // Act
        var response = await _client.PatchAsJsonAsync(
            $"/api/companies/{c2.Id}", update);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task UpdateCompany_WithSameName_DoesNotFail()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var company = new Company { Name = "Netflix" };
        context.Companies.Add(company);
        await context.SaveChangesAsync();

        var update = new
        {
            Name = "netflix"
        };

        // Act
        var response = await _client.PatchAsJsonAsync(
            $"/api/companies/{company.Id}", update);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task CanDeleteCompany_WithNoRelatedEvents_ReturnsTrue()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var company = new Company
        {
            Name = "Stripe",
            Industry = "FinTech"
        };
        context.Companies.Add(company);
        await context.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync($"/api/companies/{company.Id}/can-delete");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<bool>(CustomWebApplicationFactory.JsonOptions);
        Assert.True(result);
    }

    [Fact]
    public async Task CanDeleteCompany_WithRelatedEvents_ReturnsFalse()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var company = new Company
        {
            Name = "Stripe",
            Industry = "FinTech"
        };
        context.Companies.Add(company);
        await context.SaveChangesAsync();

        // Get or create EventType
        var eventType = await context.EventTypes.FirstOrDefaultAsync();
        if (eventType == null)
        {
            eventType = new EventType
            {
                Id = 1,
                Name = "Meeting",
                Category = EventTypeCategoryType.Application,
                IsSystemDefined = true
            };
            context.EventTypes.Add(eventType);
            await context.SaveChangesAsync();
        }
        // If eventType already exists, don't add it again - just use its Id

        var eventItem = new Event
        {
            CompanyId = company.Id,
            EventTypeId = eventType.Id,
            Source = SourceType.Email,
            Direction = DirectionType.Inbound,
            OccurredAt = DateTime.UtcNow
        };
        context.Events.Add(eventItem);
        await context.SaveChangesAsync();

        // Act
        var response = await _client.GetAsync($"/api/companies/{company.Id}/can-delete");

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