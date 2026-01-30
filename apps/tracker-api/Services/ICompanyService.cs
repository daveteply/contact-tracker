using ContactTracker.SharedDTOs;

namespace ContactTracker.TrackerAPI.Services;

public interface ICompanyService
{
    /// <summary>
    /// Get all companies
    /// </summary>
    Task<List<CompanyReadDto>> GetAllCompaniesAsync();

    /// <summary>
    /// Get company by ID
    /// </summary>
    Task<CompanyReadDto> GetCompanyByIdAsync(long id);

    /// <summary>
    /// Create a new company
    /// </summary>
    Task<CompanyReadDto> CreateCompanyAsync(CompanyCreateDto dto);

    /// <summary>
    /// Update an existing company
    /// </summary>
    Task<CompanyReadDto> UpdateCompanyAsync(long id, CompanyUpdateDto dto);

    /// <summary>
    /// Search companies by name
    /// </summary>
    /// <param name="q">Name search string</param>
    Task<List<CompanyReadDto>> SearchCompaniesAsync(string q);

    /// <summary>
    /// Checks for related records
    /// </summary>
    /// <param name="companyId"></param>
    /// <returns></returns>
    Task<bool> CanDeleteCompany(long companyId);

    /// <summary>
    /// Delete a company by ID
    /// </summary>
    Task DeleteCompanyAsync(long id);
}