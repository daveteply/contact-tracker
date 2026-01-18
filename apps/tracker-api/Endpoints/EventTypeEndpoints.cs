using tracker_api.Services;
using tracker_api.Common;
using tracker_api.DTOs;
using Microsoft.AspNetCore.Mvc;

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

        group.MapGet("/{id}", GetEventTypeById)
            .WithName("GetEventTypeById")
            .WithDescription("Get an event type by ID");

        group.MapPost("/", CreateEventType)
            .WithName("CreateEventType")
            .WithDescription("Create a new Event type");

        group.MapPut("/{id}", UpdateEventType)
            .WithName("UpdateEventType")
            .WithDescription("Update an existing event type");

        group.MapDelete("/{id}", DeleteEventType)
            .WithName("DeleteEventType")
            .WithDescription("Delete an event type");
    }

    private static async Task<IResult> GetAllEventTypes([FromServices] IEventTypeService service)
    {
        var eventTypes = await service.GetAllEventTypesAsync();
        return Results.Ok(ApiResult<List<EventTypeReadDto>>.SuccessResult(eventTypes));
    }

    private static async Task<IResult> GetEventTypeById(int id, [FromServices] IEventTypeService service)
    {
        try
        {
            var eventType = await service.GetEventTypeByIdAsync(id);
            return Results.Ok(ApiResult<EventTypeReadDto>.SuccessResult(eventType));
        }
        catch (ResourceNotFoundException ex)
        {
            return Results.NotFound(ApiResult<EventTypeReadDto>.FailureResult(ex.UserFriendlyMessage!));
        }
    }

    private static async Task<IResult> CreateEventType(EventTypeCreateDto eventType, [FromServices] IEventTypeService service)
    {
        try
        {
            var createdEventType = await service.CreateEventTypeAsync(eventType);
            return Results.Created($"/api/event-types/{createdEventType.Id}",
                ApiResult<EventTypeReadDto>.SuccessResult(createdEventType));
        }
        catch (ValidationException ex)
        {
            return Results.BadRequest(ApiResult<EventTypeReadDto>.FailureResult(ex.UserFriendlyMessage!, ex.Errors));
        }
    }

    private static async Task<IResult> UpdateEventType(int id, EventTypeUpdateDto eventType, [FromServices] IEventTypeService service)
    {
        try
        {
            var updated = await service.UpdateEventTypeAsync(id, eventType);
            return Results.Ok(ApiResult<EventTypeReadDto>.SuccessResult(updated));
        }
        catch (ResourceNotFoundException ex)
        {
            return Results.NotFound(ApiResult<EventTypeReadDto>.FailureResult(ex.UserFriendlyMessage!));
        }
        catch (ValidationException ex)
        {
            return Results.BadRequest(ApiResult<EventTypeReadDto>.FailureResult(ex.UserFriendlyMessage!, ex.Errors));
        }
    }

    private static async Task<IResult> DeleteEventType(int id, [FromServices] IEventTypeService service)
    {
        try
        {
            await service.DeleteEventTypeAsync(id);
            return Results.NoContent();
        }
        catch (ResourceNotFoundException ex)
        {
            return Results.NotFound(ApiResult<EventType>.FailureResult(ex.UserFriendlyMessage!));
        }
    }
}