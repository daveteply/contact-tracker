using System.Net;
using System.Net.Http.Json;
using Microsoft.Extensions.DependencyInjection;
using ContactTracker.TrackerAPI.Common;

namespace ContactTracker.TrackerAPI.Tests;

/// <summary>
/// Integration tests for Event Type API endpoints.
/// These tests use a PostgreSQL test database with proper cleanup between tests.
/// </summary>
[Collection("Database collection")]
public class EventTypeEndpointsTests : IAsyncDisposable
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public EventTypeEndpointsTests(DatabaseFixture databaseFixture)
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
    public async Task CreateEventType_WithManualId_ReturnsCreated()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var newType = new
        {
            Id = 101, // Manual ID required by DatabaseGeneratedOption.None
            Name = "Follow Up",
            Category = "Communication",
            IsSystemDefined = false
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/event-types", newType);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<ApiResult<EventType>>(CustomWebApplicationFactory.JsonOptions);
        Assert.Equal(101, result?.Data?.Id);
        Assert.Equal("Follow Up", result?.Data?.Name);
    }

    [Fact]
    public async Task CreateEventType_DuplicateId_ReturnsBadRequest()
    {
        // Arrange
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();

        var existing = new EventType { Id = 50, Name = "Existing", Category = "Test", IsSystemDefined = true };
        context.EventTypes.Add(existing);
        await context.SaveChangesAsync();

        var duplicate = new { Id = 50, Name = "New", Category = "Test", IsSystemDefined = false };

        // Act
        var response = await _client.PostAsJsonAsync("/api/event-types", duplicate);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    public async ValueTask DisposeAsync()
    {
        _client?.Dispose();
        await _factory.DisposeAsync();
    }
}