using System.Net;
using System.Net.Http.Json;
using tracker_api.Common;

namespace tracker_api.Tests;

public class EventTypeEndpointsTests : IClassFixture<CustomWebApplicationFactory>, IDisposable
{
    private readonly HttpClient _client;
    private readonly ContactTrackerDbContext _context;

    public EventTypeEndpointsTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
        _context = factory.GetDbContext();
        CleanDatabase();
    }

    private void CleanDatabase()
    {
        _context.EventTypes.RemoveRange(_context.EventTypes);
        _context.SaveChanges();
    }

    [Fact]
    public async Task CreateEventType_WithManualId_ReturnsCreated()
    {
        // Arrange
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
        var existing = new EventType { Id = 50, Name = "Existing", Category = "Test", IsSystemDefined = true };
        _context.EventTypes.Add(existing);
        await _context.SaveChangesAsync();

        var duplicate = new { Id = 50, Name = "New", Category = "Test", IsSystemDefined = false };

        // Act
        var response = await _client.PostAsJsonAsync("/api/event-types", duplicate);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    public void Dispose() => _client?.Dispose();
}