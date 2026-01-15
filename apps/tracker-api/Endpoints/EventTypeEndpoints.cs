using tracker_api.Services;
using tracker_api.Common;
using tracker_api.DTOs;

namespace tracker_api.Endpoints;

public static class EventTypeEndpoints
{
    public static void MapEventTypeEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/event-types")
            .WithName("EventTypes");

        group.MapGet("/", GetAllEventTypes)
            .WithName("GetAllEventTypes")
            .WithDescription("Get all event types");
    }

    private static async Task<IResult> GetAllEventTypes(IEventTypeService service)
    {
        var eventTypes = await service.GetAllEventTypesAsync();
        return Results.Ok(ApiResult<List<EventTypeReadDto>>.SuccessResult(eventTypes));
    }
}