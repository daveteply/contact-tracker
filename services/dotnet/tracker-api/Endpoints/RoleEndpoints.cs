using tracker_api.Services;
using tracker_api.Common;
using tracker_api.DTOs;

namespace tracker_api.Endpoints;

public static class RoleEndpoints
{
    public static void MapRoleEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/roles")
            .WithName("Roles");

        group.MapGet("/", GetAllRoles)
            .WithName("GetAllRoles")
            .WithDescription("Get all roles");

        group.MapGet("/{id}", GetRoleById)
            .WithName("GetRoleById")
            .WithDescription("Get a role by ID");

        group.MapPost("/", CreateRole)
            .WithName("CreateRole")
            .WithDescription("Create a new role");

        group.MapPut("/{id}", UpdateRole)
            .WithName("UpdateRole")
            .WithDescription("Update an existing role");

        group.MapDelete("/{id}", DeleteRole)
            .WithName("DeleteRole")
            .WithDescription("Delete a role");
    }

    private static async Task<IResult> GetAllRoles(IRoleService service)
    {
        var roles = await service.GetAllRolesAsync();
        return Results.Ok(ApiResult<List<RoleReadDto>>.SuccessResult(roles));
    }

    private static async Task<IResult> GetRoleById(long id, IRoleService service)
    {
        try
        {
            var role = await service.GetRoleByIdAsync(id);
            return Results.Ok(ApiResult<RoleReadDto>.SuccessResult(role));
        }
        catch (ResourceNotFoundException ex)
        {
            return Results.NotFound(ApiResult<RoleReadDto>.FailureResult(ex.UserFriendlyMessage!));
        }
    }

    private static async Task<IResult> CreateRole(RoleCreateDto role, IRoleService service)
    {
        try
        {
            var createdRole = await service.CreateRoleAsync(role);
            return Results.Created($"/api/roles/{createdRole.Id}", ApiResult<RoleReadDto>.SuccessResult(createdRole));
        }
        catch (ValidationException ex)
        {
            return Results.BadRequest(ApiResult<RoleReadDto>.FailureResult(ex.UserFriendlyMessage!, ex.Errors));
        }
    }

    private static async Task<IResult> UpdateRole(long id, RoleUpdateDto role, IRoleService service)
    {
        try
        {
            var updated = await service.UpdateRoleAsync(id, role);
            return Results.Ok(ApiResult<RoleReadDto>.SuccessResult(updated));
        }
        catch (ResourceNotFoundException ex)
        {
            return Results.NotFound(ApiResult<RoleReadDto>.FailureResult(ex.UserFriendlyMessage!));
        }
        catch (ValidationException ex)
        {
            return Results.BadRequest(ApiResult<RoleReadDto>.FailureResult(ex.UserFriendlyMessage!, ex.Errors));
        }
    }

    private static async Task<IResult> DeleteRole(long id, IRoleService service)
    {
        try
        {
            await service.DeleteRoleAsync(id);
            return Results.NoContent();
        }
        catch (ResourceNotFoundException ex)
        {
            return Results.NotFound(ApiResult<Role>.FailureResult(ex.UserFriendlyMessage!));
        }
    }
}