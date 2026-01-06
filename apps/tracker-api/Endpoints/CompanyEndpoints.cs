using tracker_api.Services;
using tracker_api.Common;
using tracker_api.DTOs;

namespace tracker_api.Endpoints;

public static class CompanyEndpoints
{
    public static void MapCompanyEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/companies")
            .WithName("Companies");

        group.MapGet("/", GetAllCompanies)
            .WithName("GetAllCompanies")
            .WithDescription("Get all companies");

        group.MapGet("/{id}", GetCompanyById)
            .WithName("GetCompanyById")
            .WithDescription("Get a company by ID");

        group.MapPost("/", CreateCompany)
            .WithName("CreateCompany")
            .WithDescription("Create a new company");

        group.MapPut("/{id}", UpdateCompany)
            .WithName("UpdateCompany")
            .WithDescription("Update an existing company");

        group.MapDelete("/{id}", DeleteCompany)
            .WithName("DeleteCompany")
            .WithDescription("Delete a company");
    }

    private static async Task<IResult> GetAllCompanies(ICompanyService service)
    {
        try
        {
            var companies = await service.GetAllCompaniesAsync();
            var result = ApiResult<List<CompanyReadDto>>.SuccessResult(companies, "Companies retrieved successfully");
            return Results.Ok(result);
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    private static async Task<IResult> GetCompanyById(long id, ICompanyService service)
    {
        try
        {
            var company = await service.GetCompanyByIdAsync(id);
            var result = ApiResult<CompanyReadDto>.SuccessResult(company, "Company retrieved successfully");
            return Results.Ok(result);
        }
        catch (ResourceNotFoundException ex)
        {
            return Results.NotFound(ApiResult<CompanyReadDto>.FailureResult(ex.UserFriendlyMessage!));
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    private static async Task<IResult> CreateCompany(CompanyCreateDto dto, ICompanyService service)
    {
        try
        {
            var createdCompany = await service.CreateCompanyAsync(dto);
            var result = ApiResult<CompanyReadDto>.SuccessResult(createdCompany, "Company created successfully");
            return Results.Created($"/api/companies/{createdCompany.Id}", result);
        }
        catch (ValidationException ex)
        {
            return Results.BadRequest(ApiResult<CompanyReadDto>.FailureResult(ex.UserFriendlyMessage!, ex.Errors));
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    private static async Task<IResult> UpdateCompany(long id, CompanyUpdateDto dto, ICompanyService service)
    {
        try
        {
            var updatedCompany = await service.UpdateCompanyAsync(id, dto);
            var result = ApiResult<CompanyReadDto>.SuccessResult(updatedCompany, "Company updated successfully");
            return Results.Ok(result);
        }
        catch (ResourceNotFoundException ex)
        {
            return Results.NotFound(ApiResult<CompanyReadDto>.FailureResult(ex.UserFriendlyMessage!));
        }
        catch (ValidationException ex)
        {
            return Results.BadRequest(ApiResult<CompanyReadDto>.FailureResult(ex.UserFriendlyMessage!, ex.Errors));
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    private static async Task<IResult> DeleteCompany(long id, ICompanyService service)
    {
        try
        {
            await service.DeleteCompanyAsync(id);
            return Results.NoContent();
        }
        catch (ResourceNotFoundException ex)
        {
            return Results.NotFound(ApiResult<object>.FailureResult(ex.UserFriendlyMessage!));
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    private static IResult HandleException(Exception ex)
    {
        var result = ApiResult<object>.FailureResult(
            "An unexpected error occurred",
            ex.Message);
        return Results.StatusCode(StatusCodes.Status500InternalServerError);
    }
}