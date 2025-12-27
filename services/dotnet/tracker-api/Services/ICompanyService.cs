namespace tracker_api.Services;

public interface ICompanyService
{
    /// <summary>
    /// Get all companies
    /// </summary>
    Task<List<Company>> GetAllCompaniesAsync();

    /// <summary>
    /// Get company by ID
    /// </summary>
    Task<Company> GetCompanyByIdAsync(long id);

    /// <summary>
    /// Create a new company
    /// </summary>
    Task<Company> CreateCompanyAsync(Company company);

    /// <summary>
    /// Update an existing company
    /// </summary>
    Task<Company> UpdateCompanyAsync(long id, Company company);

    /// <summary>
    /// Delete a company by ID
    /// </summary>
    Task DeleteCompanyAsync(long id);
}
