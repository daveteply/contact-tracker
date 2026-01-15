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

        group.MapGet("/search", SearchRoles)
            .WithName("SearchRole")
            .WithDescription("Search role by title");
    }

    private static async Task<IResult> GetAllRoles(IRoleService service)
    {
        try
        {
            var roles = await service.GetAllRolesAsync();
            return Results.Ok(ApiResult<List<RoleReadDto>>.SuccessResult(roles));
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    private static async Task<IResult> GetRoleById(long id, IRoleService service)
    {
        try
        {
            var role = await service.GetRoleByIdAsync(id);
            var result = ApiResult<RoleReadDto>.SuccessResult(role, "Role retrieved successfully");
            return Results.Ok(ApiResult<RoleReadDto>.SuccessResult(role));
        }
        catch (ResourceNotFoundException ex)
        {
            return Results.NotFound(ApiResult<RoleReadDto>.FailureResult(ex.UserFriendlyMessage!));
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    private static async Task<IResult> CreateRole(RoleCreateDto role, IRoleService service)
    {
        try
        {
            var createdRole = await service.CreateRoleAsync(role);
            var result = ApiResult<RoleReadDto>.SuccessResult(createdRole, "Role created successfully");
            return Results.Created($"/api/roles/{createdRole.Id}", ApiResult<RoleReadDto>.SuccessResult(createdRole));
        }
        catch (ValidationException ex)
        {
            return Results.BadRequest(ApiResult<RoleReadDto>.FailureResult(ex.UserFriendlyMessage!, ex.Errors));
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    private static async Task<IResult> UpdateRole(long id, RoleUpdateDto role, IRoleService service)
    {
        try
        {
            var updatedRole = await service.UpdateRoleAsync(id, role);
            var result = ApiResult<RoleReadDto>.SuccessResult(updatedRole, "Role updated successfully");
            return Results.Ok(ApiResult<RoleReadDto>.SuccessResult(updatedRole));
        }
        catch (ResourceNotFoundException ex)
        {
            return Results.NotFound(ApiResult<RoleReadDto>.FailureResult(ex.UserFriendlyMessage!));
        }
        catch (ValidationException ex)
        {
            return Results.BadRequest(ApiResult<RoleReadDto>.FailureResult(ex.UserFriendlyMessage!, ex.Errors));
        }
        catch (Exception ex)
        {
            return HandleException(ex);
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
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    private static async Task<IResult> SearchRoles(string q, IRoleService service)
    {
        try
        {
            var roles = await service.SearchRolesAsync(q);
            var result = ApiResult<List<RoleReadDto>>.SuccessResult(roles, "Roles searched successfully");
            return Results.Ok(result);
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    private static IResult HandleException(Exception ex)
    {
        var result = ApiResult<object>.FailureResult(
            "An unexpected error occurred",
            ex.Message);
        return Results.StatusCode(StatusCodes.Status500InternalServerError);
    }
}