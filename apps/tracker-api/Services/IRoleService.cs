using tracker_api.DTOs;

namespace tracker_api.Services;

public interface IRoleService
{
    Task<List<RoleReadDto>> GetAllRolesAsync();
    Task<RoleReadDto> GetRoleByIdAsync(long id);
    Task<RoleReadDto> CreateRoleAsync(RoleCreateDto role);
    Task<RoleReadDto> UpdateRoleAsync(long id, RoleUpdateDto role);
    Task DeleteRoleAsync(long id);
}