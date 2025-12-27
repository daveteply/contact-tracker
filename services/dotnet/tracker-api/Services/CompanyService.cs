using Microsoft.EntityFrameworkCore;
using tracker_api.Common;

namespace tracker_api.Services;

public class CompanyService : ICompanyService
{
    private readonly ContactTrackerDbContext _context;

    public CompanyService(ContactTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<List<Company>> GetAllCompaniesAsync()
    {
        return await _context.Companies
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Company> GetCompanyByIdAsync(long id)
    {
        var company = await _context.Companies
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);

        if (company == null)
        {
            throw new ResourceNotFoundException(nameof(Company), id);
        }

        return company;
    }

    public async Task<Company> CreateCompanyAsync(Company company)
    {
        ValidateCompany(company);

        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        return company;
    }

    public async Task<Company> UpdateCompanyAsync(long id, Company company)
    {
        var existingCompany = await _context.Companies
            .FirstOrDefaultAsync(c => c.Id == id);

        if (existingCompany == null)
        {
            throw new ResourceNotFoundException(nameof(Company), id);
        }

        ValidateCompany(company);

        // Update properties
        existingCompany.Name = company.Name;
        existingCompany.Website = company.Website;
        existingCompany.Industry = company.Industry;
        existingCompany.SizeRange = company.SizeRange;
        existingCompany.Notes = company.Notes;
        existingCompany.UpdatedAt = DateTime.UtcNow;

        _context.Companies.Update(existingCompany);
        await _context.SaveChangesAsync();

        return existingCompany;
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

    private void ValidateCompany(Company company)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(company.Name))
        {
            errors.Add("Company name is required");
        }

        if (errors.Count > 0)
        {
            throw new ValidationException("Company validation failed", errors);
        }
    }
}
