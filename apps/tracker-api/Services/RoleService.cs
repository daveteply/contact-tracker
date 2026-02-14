using Microsoft.EntityFrameworkCore;
using ContactTracker.TrackerAPI.Common;
using ContactTracker.SharedDTOs;
using ContactTracker.ServerDomain;
using TrackerApi.Mappings;

namespace ContactTracker.TrackerAPI.Services;

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
        ValidateRoleCreate(dto);

        if (await _context.Roles.AnyAsync(c => c.Title.ToLower() == dto.Title.ToLower()))
        {
            throw new ValidationException("A Role with this name already exists.",
                 new List<string> { "Role title must be unique." });
        }

        var role = new Role
        {
            Title = dto.Title,
            JobPostingUrl = dto.JobPostingUrl,
            Location = dto.Location,
            Level = RoleLevelTypeMappings.ToDomain(dto.Level)
        };

        await ResolveEntitiesAsync(dto, role);

        _context.Roles.Add(role);

        try
        {
            await _context.SaveChangesAsync();

            // Ensure the company is loaded for the response DTO
            if (role.CompanyId.HasValue && role.Company == null)
            {
                await _context.Entry(role).Reference(c => c.Company).LoadAsync();
            }
        }
        catch (DbUpdateException ex) when (ContactTrackerDbContext.IsUniqueViolation(ex))
        {
            DuplicateFound();
        }

        return MapToReadDto(role);
    }

    public async Task<RoleReadDto> UpdateRoleAsync(long id, RoleUpdateDto dto)
    {
        var existingRole = await _context.Roles
            .FirstOrDefaultAsync(r => r.Id == id);

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

            if (exists) DuplicateFound();


            existingRole.Title = dto.Title;
        }

        // Company
        if (dto.CompanyId == -1)
        {
            existingRole.CompanyId = null;
            existingRole.Company = null;
        }
        else if (dto.CompanyId.HasValue)
        {
            existingRole.CompanyId = dto.CompanyId;
            existingRole.Company = null; // Clear navigation so EF doesn't try to insert
        }
        else if (dto.UpdateCompany is not null)
        {
            await HandleInlineCompanyUpdate(existingRole, dto.UpdateCompany);
        }

        if (dto.JobPostingUrl is not null)
            existingRole.JobPostingUrl = string.IsNullOrEmpty(dto.JobPostingUrl) ? null : dto.JobPostingUrl;

        if (dto.Location is not null)
            existingRole.Location = string.IsNullOrEmpty(dto.Location) ? null : dto.Location;

        if (dto.Level.HasValue)
            existingRole.Level = RoleLevelTypeMappings.ToDomain(dto.Level.Value);

        _context.Roles.Update(existingRole);

        try
        {
            await _context.SaveChangesAsync();
            await _context.Entry(existingRole).Reference(c => c.Company).LoadAsync();
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
            .Include(r => r.Company)
            .AsNoTracking()
            .Where(c => c.Title.ToLower().Contains(searchTerm))
            .ToListAsync();

        return roles.Select(MapToReadDto).ToList();
    }

    private async Task HandleInlineCompanyUpdate(Role role, CompanyUpdateDto updateDto)
    {
        // Name is the only required field for Company
        if (string.IsNullOrWhiteSpace(updateDto.Name)) return;

        var newName = updateDto.Name.Trim();

        // Check if a company with this name already exists
        var existingCompany = await _context.Companies
            .FirstOrDefaultAsync(c => c.Name == newName);

        if (existingCompany is not null)
        {
            // Link to the existing company
            role.CompanyId = existingCompany.Id;
            role.Company = null;
            return;
        }

        // Create a new company (don't update the existing one)
        role.Company = new Company { Name = newName };
        role.CompanyId = null; // Will be assigned by EF after insert
    }

    private static RoleReadDto MapToReadDto(Role role)
    {
        return new RoleReadDto(
            role.Id,
            role.CompanyId,
            role.Company is not null ? new CompanyReadDto(
                role.Company.Id,
                role.Company.Name,
                role.Company.Website,
                role.Company.Industry,
                role.Company.SizeRange,
                role.Company.Notes
            ) : null,
            role.Title,
            role.JobPostingUrl,
            role.Location,
            RoleLevelTypeMappings.ToDto(role.Level)
        );
    }

    private async Task ResolveEntitiesAsync(RoleCreateDto dto, Role role)
    {
        if (dto.CompanyId.HasValue)
        {
            role.CompanyId = dto.CompanyId;
        }
        else if (dto.NewCompany is not null && !string.IsNullOrWhiteSpace(dto.NewCompany.Name))
        {
            var normalizedName = dto.NewCompany.Name.Trim();
            var existingCompany = await _context.Companies
                .FirstOrDefaultAsync(c => c.Name == normalizedName);

            if (existingCompany is not null)
                role.CompanyId = existingCompany.Id;
            else
                role.Company = new Company { Name = normalizedName };
        }
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

