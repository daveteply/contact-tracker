using System.Net;
using System.Net.Http.Json;
using tracker_api.Common;

namespace tracker_api.Tests;

public class EventEndpointsTests : IClassFixture<CustomWebApplicationFactory>, IDisposable
{
    private readonly HttpClient _client;
    private readonly ContactTrackerDbContext _context;

    public EventEndpointsTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
        _context = factory.GetDbContext();
        CleanDatabase();
    }

    private void CleanDatabase()
    {
        _context.Events.RemoveRange(_context.Events);
        _context.EventTypes.RemoveRange(_context.EventTypes);
        _context.SaveChanges();
    }

    [Fact]
    public async Task CreateEvent_WithValidData_ReturnsCreatedContact()
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
            Source = 1, // LinkedIn (Enum index)
            Direction = 1, // Outbound (Enum index)
            Summary = "Initial Outreach",
            Details = "Reached out via InMail"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/events", newEvent);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<ApiResult<Event>>();
        Assert.NotNull(result);
        Assert.True(result.Success);
        Assert.Equal("Initial Outreach", result?.Data?.Summary);
        Assert.Equal(eventType.Id, result?.Data?.EventTypeId);

        // Verify it exists in the DB
        var dbEvent = await _context.Events.FindAsync(result?.Data?.Id);
        Assert.NotNull(dbEvent);
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