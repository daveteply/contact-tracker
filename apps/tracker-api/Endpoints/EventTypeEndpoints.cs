using tracker_api.Services;
using tracker_api.Common;
using tracker_api.DTOs;

namespace tracker_api.Endpoints;

public static class EventTypeEndpoints
{
    public static void MapEventTypeEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/event-types").WithName("EventTypes");

        group.MapGet("/", async (IEventTypeService s) =>
            Results.Ok(ApiResult<List<EventTypeReadDto>>.SuccessResult(await s.GetAllEventTypesAsync())))
            .WithName("GetAllEventTypes").WithDescription("Get all event types");

        group.MapPost("/", async (EventTypeCreateDto et, IEventTypeService s) =>
        {
            try
            {
                var created = await s.CreateEventTypeAsync(et);
                return Results.Created($"/api/event-types/{created.Id}", ApiResult<EventTypeReadDto>.SuccessResult(created));
            }
            catch (ValidationException ex)
            {
                return Results.BadRequest(ApiResult<EventType>.FailureResult(ex.UserFriendlyMessage!, ex.Errors));
            }
        }).WithName("CreateEventType").WithDescription("Create a new event type");

        // MapGet{id}, MapPut, MapDelete would follow the same pattern...
    }
}