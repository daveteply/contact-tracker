using ContactTracker.SharedDTOs;

namespace ContactTracker.TrackerAPI.Common;

/// <summary>
/// Standard result wrapper for API responses to provide consistent error handling
/// </summary>
public class ApiResult<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? Message { get; set; }
    public List<string> Errors { get; set; } = [];

    public PaginationMetadata? Pagination { get; set; }

    public static ApiResult<T> SuccessResult(T data, string message = "Operation successful", PaginationMetadata? pagination = null)
    {
        return new ApiResult<T>
        {
            Success = true,
            Data = data,
            Message = message,
            Pagination = pagination
        };
    }

    public static ApiResult<T> FailureResult(string message, List<string>? errors = null)
    {
        return new ApiResult<T>
        {
            Success = false,
            Data = default,
            Message = message,
            Errors = errors ?? []
        };
    }

    public static ApiResult<T> FailureResult(string message, string error)
    {
        return new ApiResult<T>
        {
            Success = false,
            Data = default,
            Message = message,
            Errors = [error]
        };
    }
}


/// <summary>
/// Custom exception for service layer to communicate errors to endpoints
/// </summary>
public class ServiceException : Exception
{
    public string? UserFriendlyMessage { get; set; }
    public List<string> Errors { get; set; } = [];

    public ServiceException(string message, string? userFriendlyMessage = null, List<string>? errors = null)
        : base(message)
    {
        UserFriendlyMessage = userFriendlyMessage ?? message;
        Errors = errors ?? [];
    }
}

/// <summary>
/// Exception for resource not found scenarios
/// </summary>
public class ResourceNotFoundException : ServiceException
{
    public ResourceNotFoundException(string resourceName, object identifier)
        : base($"{resourceName} with ID {identifier} not found",
            $"{resourceName} not found")
    {
    }
}

/// <summary>
/// Exception for validation errors
/// </summary>
public class ValidationException : ServiceException
{
    public ValidationException(string message, List<string> errors)
        : base(message, "Validation failed", errors)
    {
    }
}
