using tracker_api.Services;
using tracker_api.Common;
using tracker_api.DTOs;

namespace tracker_api.Endpoints;

public static class ContactEndpoints
{
    public static void MapContactEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/contacts")
            .WithName("Contacts");

        group.MapGet("/", GetAllContacts)
            .WithName("GetAllContacts")
            .WithDescription("Get all contacts");

        group.MapGet("/{id}", GetContactById)
            .WithName("GetContactById")
            .WithDescription("Get a contact by ID");

        group.MapPost("/", CreateContact)
            .WithName("CreateContact")
            .WithDescription("Create a new contact");

        group.MapPut("/{id}", UpdateContact)
            .WithName("UpdateContact")
            .WithDescription("Update an existing contact");

        group.MapDelete("/{id}", DeleteContact)
            .WithName("DeleteContact")
            .WithDescription("Delete a contact");
    }

    private static async Task<IResult> GetAllContacts(IContactService service)
    {
        try
        {
            var contacts = await service.GetAllContactsAsync();
            var result = ApiResult<List<ContactReadDto>>.SuccessResult(contacts, "Contacts retrieved successfully");
            return Results.Ok(result);
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    private static async Task<IResult> GetContactById(long id, IContactService service)
    {
        try
        {
            var contact = await service.GetContactByIdAsync(id);
            var result = ApiResult<ContactReadDto>.SuccessResult(contact, "Contact retrieved successfully");
            return Results.Ok(result);
        }
        catch (ResourceNotFoundException ex)
        {
            return Results.NotFound(ApiResult<ContactReadDto>.FailureResult(ex.UserFriendlyMessage!));
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    private static async Task<IResult> CreateContact(ContactCreateDto contact, IContactService service)
    {
        try
        {
            var createdContact = await service.CreateContactAsync(contact);
            var result = ApiResult<ContactReadDto>.SuccessResult(createdContact, "Contact created successfully");
            return Results.Created($"/api/contacts/{createdContact.Id}", result);
        }
        catch (ValidationException ex)
        {
            return Results.BadRequest(ApiResult<ContactReadDto>.FailureResult(ex.UserFriendlyMessage!, ex.Errors));
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    private static async Task<IResult> UpdateContact(long id, ContactUpdateDto contact, IContactService service)
    {
        try
        {
            var updatedContact = await service.UpdateContactAsync(id, contact);
            var result = ApiResult<ContactReadDto>.SuccessResult(updatedContact, "Contact updated successfully");
            return Results.Ok(result);
        }
        catch (ResourceNotFoundException ex)
        {
            return Results.NotFound(ApiResult<ContactReadDto>.FailureResult(ex.UserFriendlyMessage!));
        }
        catch (ValidationException ex)
        {
            return Results.BadRequest(ApiResult<ContactReadDto>.FailureResult(ex.UserFriendlyMessage!, ex.Errors));
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    private static async Task<IResult> DeleteContact(long id, IContactService service)
    {
        try
        {
            await service.DeleteContactAsync(id);
            return Results.NoContent();
        }
        catch (ResourceNotFoundException ex)
        {
            return Results.NotFound(ApiResult<Contact>.FailureResult(ex.UserFriendlyMessage!));
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    private static IResult HandleException(Exception ex)
    {
        var result = ApiResult<Contact>.FailureResult(
            "An unexpected error occurred",
            ex.Message);
        return Results.StatusCode(StatusCodes.Status500InternalServerError);
    }
}
