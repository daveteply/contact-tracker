using tracker_api.Services;
using tracker_api.Common;
using tracker_api.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace tracker_api.Endpoints;

public static class EventEndpoints
{
    public static void MapEventEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/events")
            .WithName("Events");

        group.MapGet("/", GetAllEvents)
            .WithName("GetAllEvents")
            .WithDescription("Get all events with pagination. Use 'include' for related entities");

        group.MapGet("/{id}", GetEventById)
            .WithName("GetEventById")
            .WithDescription("Get an event by ID");

        group.MapPost("/", CreateEvent)
            .WithName("CreateEvent")
            .WithDescription("Create a new event");

        group.MapPatch("/{id}", UpdateEvent)
            .WithName("UpdateEvent")
            .WithDescription("Update an existing event");

        group.MapDelete("/{id}", DeleteEvent)
            .WithName("DeleteEvent")
            .WithDescription("Delete an event");
    }

    private static async Task<IResult> GetAllEvents(
        [FromServices] IEventService service,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? include = null)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 100) pageSize = 100;

        HashSet<string> includeRelations;
        if (!string.IsNullOrWhiteSpace(include))
        {
            // Explicit list: "company,contact,role"
            includeRelations = ParseIncludeParameter(include);
        }
        else
        {
            // Default: no related entities
            includeRelations = new HashSet<string>();
        }

        var (items, metadata) = await service.GetAllEventsAsync(page, pageSize, includeRelations);

        var result = ApiResult<List<EventReadDtoWithRelations>>.SuccessResult(items, "Events retrieved", metadata);

        return Results.Ok(result);
    }

    private static async Task<IResult> GetEventById(long id, [FromServices] IEventService service)
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

    private static async Task<IResult> CreateEvent(EventCreateDto @event, [FromServices] IEventService service)
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

    private static async Task<IResult> UpdateEvent(long id, EventUpdateDto @event, [FromServices] IEventService service)
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

    private static async Task<IResult> DeleteEvent(long id, [FromServices] IEventService service)
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

    private static HashSet<string> ParseIncludeParameter(string include)
    {
        var validIncludes = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "company", "contact", "role", "eventtype"
        };

        return include
            .Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(x => x.Trim())
            .Where(x => validIncludes.Contains(x))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
    }
}