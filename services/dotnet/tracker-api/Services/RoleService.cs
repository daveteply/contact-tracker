using Microsoft.EntityFrameworkCore;
using tracker_api.Common;

namespace tracker_api.Services;

public class RoleService : IRoleService
{
    private readonly ContactTrackerDbContext _context;

    public RoleService(ContactTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<List<Role>> GetAllRolesAsync()
    {
        return await _context.Roles
            .Include(r => r.Company)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Role> GetRoleByIdAsync(long id)
    {
        var role = await _context.Roles
            .Include(r => r.Company)
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == id);

        if (role == null)
        {
            throw new ResourceNotFoundException(nameof(Role), id);
        }

        return role;
    }

    public async Task<Role> CreateRoleAsync(Role role)
    {
        ValidateRole(role);

        _context.Roles.Add(role);
        await _context.SaveChangesAsync();

        return role;
    }

    public async Task<Role> UpdateRoleAsync(long id, Role role)
    {
        var existingRole = await _context.Roles.FirstOrDefaultAsync(r => r.Id == id);

        if (existingRole == null)
        {
            throw new ResourceNotFoundException(nameof(Role), id);
        }

        ValidateRole(role);

        existingRole.Title = role.Title;
        existingRole.JobPostingUrl = role.JobPostingUrl;
        existingRole.Location = role.Location;
        existingRole.Level = role.Level;
        existingRole.CompanyId = role.CompanyId;
        existingRole.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return existingRole;
    }

    public async Task DeleteRoleAsync(long id)
    {
        var role = await _context.Roles.FindAsync(id);

        if (role == null)
        {
            throw new ResourceNotFoundException(nameof(Role), id);
        }

        _context.Roles.Remove(role);
        await _context.SaveChangesAsync();
    }

    private void ValidateRole(Role role)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(role.Title))
        {
            errors.Add("Role title is required");
        }

        if (errors.Count > 0)
        {
            throw new ValidationException("Role validation failed", errors);
        }
    }
}