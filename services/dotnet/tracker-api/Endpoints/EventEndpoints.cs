using tracker_api.Services;
using tracker_api.Common;
using tracker_api.DTOs;

namespace tracker_api.Endpoints;

public static class EventEndpoints
{
    public static void MapEventEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/events")
                .WithName("Events");

        group.MapGet("/", GetAllEvents)
            .WithName("GetAllEvents")
            .WithDescription("Get all events");

        group.MapGet("/{id}", GetEventById)
            .WithName("GetEventById")
            .WithDescription("Get an event by ID");

        group.MapPost("/", CreateEvent)
            .WithName("CreateEvent")
            .WithDescription("Create a new event");

        group.MapPut("/{id}", UpdateEvent)
            .WithName("UpdateEvent")
            .WithDescription("Update an existing event");

        group.MapDelete("/{id}", DeleteEvent)
            .WithName("DeleteEvent")
            .WithDescription("Delete an event");
    }

    private static async Task<IResult> GetAllEvents(IEventService service)
    {
        var events = await service.GetAllEventsAsync();
        return Results.Ok(ApiResult<List<EventReadDto>>.SuccessResult(events));
    }

    private static async Task<IResult> GetEventById(long id, IEventService service)
    {
        try
        {
            var @event = await service.GetEventByIdAsync(id);
            return Results.Ok(ApiResult<EventReadDto>.SuccessResult(@event));
        }
        catch (ResourceNotFoundException ex)
        {
            return Results.NotFound(ApiResult<EventReadDto>.FailureResult(ex.UserFriendlyMessage!));
        }
    }

    private static async Task<IResult> CreateEvent(EventCreateDto @event, IEventService service)
    {
        try
        {
            var createdEvent = await service.CreateEventAsync(@event);
            return Results.Created($"/api/events/{createdEvent.Id}",
                ApiResult<EventReadDto>.SuccessResult(createdEvent));
        }
        catch (ValidationException ex)
        {
            return Results.BadRequest(ApiResult<EventReadDto>.FailureResult(ex.UserFriendlyMessage!, ex.Errors));
        }
    }

    private static async Task<IResult> UpdateEvent(long id, EventUpdateDto @event, IEventService service)
    {
        try
        {
            var updated = await service.UpdateEventAsync(id, @event);
            return Results.Ok(ApiResult<EventReadDto>.SuccessResult(updated));
        }
        catch (ResourceNotFoundException ex)
        {
            return Results.NotFound(ApiResult<EventReadDto>.FailureResult(ex.UserFriendlyMessage!));
        }
        catch (ValidationException ex)
        {
            return Results.BadRequest(ApiResult<EventReadDto>.FailureResult(ex.UserFriendlyMessage!, ex.Errors));
        }
    }

    private static async Task<IResult> DeleteEvent(long id, IEventService service)
    {
        try
        {
            await service.DeleteEventAsync(id);
            return Results.NoContent();
        }
        catch (ResourceNotFoundException ex)
        {
            return Results.NotFound(ApiResult<Event>.FailureResult(ex.UserFriendlyMessage!));
        }
    }
}