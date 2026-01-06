using tracker_api.DTOs;

namespace tracker_api.Services;

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
    /// Delete a company by ID
    /// </summary>
    Task DeleteCompanyAsync(long id);
}