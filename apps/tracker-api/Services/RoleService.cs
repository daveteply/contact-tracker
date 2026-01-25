using Microsoft.EntityFrameworkCore;
using tracker_api.Common;
using tracker_api.DTOs;

namespace tracker_api.Services;

public class RoleService : IRoleService
{
    private readonly ContactTrackerDbContext _context;

    public RoleService(ContactTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<List<RoleReadDto>> GetAllRolesAsync()
    {
        var roles = await _context.Roles
            .Include(r => r.Company)
            .AsNoTracking()
            .ToListAsync();

        return roles.Select(MapToReadDto).ToList();
    }

    public async Task<RoleReadDto> GetRoleByIdAsync(long id)
    {
        var role = await _context.Roles
            .Include(r => r.Company)
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == id);

        if (role == null)
        {
            throw new ResourceNotFoundException(nameof(Role), id);
        }

        return MapToReadDto(role);
    }

    public async Task<RoleReadDto> CreateRoleAsync(RoleCreateDto dto)
    {
        if (await _context.Roles.AnyAsync(c => c.Title.ToLower() == dto.Title.ToLower()))
        {
            throw new ValidationException("A Role with this name already exists.",
                 new List<string> { "Role title must be unique." });
        }
        ValidateRoleCreate(dto);

        var role = new Role
        {
            CompanyId = dto.CompanyId,
            Title = dto.Title,
            JobPostingUrl = dto.JobPostingUrl,
            Location = dto.Location,
            Level = dto.Level
        };

        _context.Roles.Add(role);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ContactTrackerDbContext.IsUniqueViolation(ex))
        {
            DuplicateFound();
        }

        return MapToReadDto(role);
    }

    public async Task<RoleReadDto> UpdateRoleAsync(long id, RoleUpdateDto dto)
    {
        var existingRole = await _context.Roles.FirstOrDefaultAsync(r => r.Id == id);

        if (existingRole == null)
        {
            throw new ResourceNotFoundException(nameof(Role), id);
        }

        ValidateRoleUpdate(dto);

        // Only update properties that are provided (not null)
        if (dto.Title is not null)
        {
            var exists = await _context.Roles
                .AnyAsync(c => c.Id != id && c.Title.ToLower() == dto.Title.ToLower());

            if (exists)
            {
                DuplicateFound();
            }

            existingRole.Title = dto.Title;
        }

        if (dto.CompanyId.HasValue)
            existingRole.CompanyId = dto.CompanyId;

        if (dto.Title is not null)
            existingRole.Title = dto.Title;

        if (dto.JobPostingUrl is not null)
            existingRole.JobPostingUrl = dto.JobPostingUrl;

        if (dto.Location is not null)
            existingRole.Location = dto.Location;

        if (dto.Level.HasValue)
            existingRole.Level = dto.Level.Value;

        _context.Roles.Update(existingRole);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ContactTrackerDbContext.IsUniqueViolation(ex))
        {
            DuplicateFound();
        }

        return MapToReadDto(existingRole);
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

    public async Task<bool> CanDeleteRole(long roleId)
    {
        var eventCount = await _context.Events.Where(e => e.RoleId == roleId).CountAsync();
        return eventCount == 0;
    }


    public async Task<List<RoleReadDto>> SearchRolesAsync(string q)
    {
        var searchTerm = q.Trim().ToLower();

        var roles = await _context.Roles
            .AsNoTracking()
            .Where(c => c.Title.ToLower().Contains(searchTerm))
            .ToListAsync();

        return roles.Select(MapToReadDto).ToList();
    }

    private static RoleReadDto MapToReadDto(Role role)
    {
        return new RoleReadDto(
            role.Id,
            role.CompanyId,
            role.Company is not null ? new CompanyReadDto(
                role.Company.Id,
                role.Company.Name,
                role.Company.Website ?? string.Empty,
                role.Company.Industry ?? string.Empty,
                role.Company.SizeRange ?? string.Empty,
                role.Company.Notes ?? string.Empty
            ) : null,
            role.Title,
            role.JobPostingUrl ?? string.Empty,
            role.Location ?? string.Empty,
            role.Level
        );
    }

    private void ValidateRoleCreate(RoleCreateDto dto)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            errors.Add("Role title is required");
        }

        if (errors.Count > 0)
        {
            throw new ValidationException("Role validation failed", errors);
        }
    }

    private void ValidateRoleUpdate(RoleUpdateDto dto)
    {
        var errors = new List<string>();

        // For update, Title can be null (meaning don't update it)
        // But if it IS provided, it shouldn't be empty/whitespace
        if (dto.Title is not null && string.IsNullOrWhiteSpace(dto.Title))
        {
            errors.Add("Role title cannot be empty");
        }

        if (errors.Count > 0)
        {
            throw new ValidationException("Role validation failed", errors);
        }
    }

    private static void DuplicateFound()
    {
        throw new ValidationException(
            "A Role with this Title already exists.",
            new List<string> { "Role Title must be unique." }
        );
    }
}

