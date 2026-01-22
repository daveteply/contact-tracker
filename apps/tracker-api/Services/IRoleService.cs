using tracker_api.DTOs;

namespace tracker_api.Services;

public interface IRoleService
{
    /// <summary>
    /// Get all roles
    /// </summary>
    /// <returns></returns>
    Task<List<RoleReadDto>> GetAllRolesAsync();

    /// <summary>
    /// Get role by Id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<RoleReadDto> GetRoleByIdAsync(long id);

    /// <summary>
    /// Create a new role
    /// </summary>
    /// <param name="role"></param>
    /// <returns></returns>
    Task<RoleReadDto> CreateRoleAsync(RoleCreateDto role);

    /// <summary>
    /// Update an existing Role
    /// </summary>
    /// <param name="id"></param>
    /// <param name="role"></param>
    /// <returns></returns>
    Task<RoleReadDto> UpdateRoleAsync(long id, RoleUpdateDto role);

    /// <summary>
    /// Search Roles by title
    /// </summary>
    /// <param name="q">Name search string</param>
    Task<List<RoleReadDto>> SearchRolesAsync(string q);

    /// <summary>
    /// Delete a Role
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task DeleteRoleAsync(long id);

    /// <summary>
    /// Checks for related records
    /// </summary>
    /// <param name="roleId"></param>
    /// <returns></returns>
    Task<bool> CanDeleteRole(long roleId);
}