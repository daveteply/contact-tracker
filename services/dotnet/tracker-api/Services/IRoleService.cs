namespace tracker_api.Services;

public interface IRoleService
{
    Task<List<Role>> GetAllRolesAsync();
    Task<Role> GetRoleByIdAsync(long id);
    Task<Role> CreateRoleAsync(Role role);
    Task<Role> UpdateRoleAsync(long id, Role role);
    Task DeleteRoleAsync(long id);
}