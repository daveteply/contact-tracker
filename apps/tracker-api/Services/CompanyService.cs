using Microsoft.EntityFrameworkCore;
using ContactTracker.TrackerAPI.Common;
using ContactTracker.SharedDTOs;

namespace ContactTracker.TrackerAPI.Services;

public class CompanyService : ICompanyService
{
    private readonly ContactTrackerDbContext _context;

    public CompanyService(ContactTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<List<CompanyReadDto>> GetAllCompaniesAsync()
    {
        var companies = await _context.Companies
            .AsNoTracking()
            .ToListAsync();

        return companies.Select(MapToReadDto).ToList();
    }

    public async Task<CompanyReadDto> GetCompanyByIdAsync(long id)
    {
        var company = await _context.Companies
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);

        if (company == null)
        {
            throw new ResourceNotFoundException(nameof(Company), id);
        }

        return MapToReadDto(company);
    }

    public async Task<CompanyReadDto> CreateCompanyAsync(CompanyCreateDto dto)
    {
        if (await _context.Companies.AnyAsync(c => c.Name.ToLower() == dto.Name.ToLower()))
        {
            throw new ValidationException("A company with this name already exists.",
                 new List<string> { "Company name must be unique." });
        }

        ValidateCompanyCreate(dto);

        var company = new Company
        {
            Name = dto.Name,
            Website = dto.Website,
            Industry = dto.Industry,
            SizeRange = dto.SizeRange,
            Notes = dto.Notes
        };

        _context.Companies.Add(company);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ContactTrackerDbContext.IsUniqueViolation(ex))
        {
            DuplicateFound();
        }

        return MapToReadDto(company);
    }

    public async Task<CompanyReadDto> UpdateCompanyAsync(long id, CompanyUpdateDto dto)
    {
        var existingCompany = await _context.Companies
            .FirstOrDefaultAsync(c => c.Id == id);

        if (existingCompany == null)
        {
            throw new ResourceNotFoundException(nameof(Company), id);
        }

        ValidateCompanyUpdate(dto);

        // Only update properties that are provided (not null)
        if (dto.Name is not null)
        {
            var exists = await _context.Companies
                .AnyAsync(c => c.Id != id && c.Name.ToLower() == dto.Name.ToLower());

            if (exists)
            {
                DuplicateFound();
            }

            existingCompany.Name = dto.Name;
        }

        if (dto.Website is not null)
            existingCompany.Website = dto.Website;

        if (dto.Industry is not null)
            existingCompany.Industry = dto.Industry;

        if (dto.SizeRange is not null)
            existingCompany.SizeRange = dto.SizeRange;

        if (dto.Notes is not null)
            existingCompany.Notes = dto.Notes;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ContactTrackerDbContext.IsUniqueViolation(ex))
        {
            DuplicateFound();
        }

        return MapToReadDto(existingCompany);
    }

    public async Task DeleteCompanyAsync(long id)
    {
        var company = await _context.Companies
            .FirstOrDefaultAsync(c => c.Id == id);

        if (company == null)
        {
            throw new ResourceNotFoundException(nameof(Company), id);
        }

        _context.Companies.Remove(company);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> CanDeleteCompany(long companyId)
    {
        var eventCount = await _context.Events.Where(e => e.CompanyId == companyId).CountAsync();
        return eventCount == 0;
    }

    public async Task<List<CompanyReadDto>> SearchCompaniesAsync(string q)
    {
        var searchTerm = q.Trim().ToLower();

        var companies = await _context.Companies
            .AsNoTracking()
            .Where(c => c.Name.ToLower().Contains(searchTerm))
            .ToListAsync();

        return companies.Select(MapToReadDto).ToList();
    }

    private static CompanyReadDto MapToReadDto(Company company)
    {
        return new CompanyReadDto(
            company.Id,
            company.Name,
            company.Website ?? string.Empty,
            company.Industry ?? string.Empty,
            company.SizeRange ?? string.Empty,
            company.Notes ?? string.Empty
        );
    }

    private void ValidateCompanyCreate(CompanyCreateDto dto)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            errors.Add("Company name is required");
        }

        if (errors.Count > 0)
        {
            throw new ValidationException("Company validation failed", errors);
        }
    }

    private void ValidateCompanyUpdate(CompanyUpdateDto dto)
    {
        var errors = new List<string>();

        // For update, Name can be null (meaning don't update it)
        // But if it IS provided, it shouldn't be empty/whitespace
        if (dto.Name is not null && string.IsNullOrWhiteSpace(dto.Name))
        {
            errors.Add("Company name cannot be empty");
        }

        if (errors.Count > 0)
        {
            throw new ValidationException("Company validation failed", errors);
        }
    }

    private static void DuplicateFound()
    {
        throw new ValidationException(
            "A company with this name already exists.",
            new List<string> { "Company name must be unique." }
        );
    }

}