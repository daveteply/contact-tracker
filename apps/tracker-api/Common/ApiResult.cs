using System.ComponentModel.DataAnnotations;
using System.Reflection;
using tracker_api.DTOs;

namespace tracker_api.Common;

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

    public List<FieldMetadata>? Schema { get; set; }

    public static ApiResult<T> SuccessResult(T data, string message = "Operation successful", PaginationMetadata? pagination = null)
    {
        return new ApiResult<T>
        {
            Success = true,
            Data = data,
            Message = message,
            Pagination = pagination,
            Schema = GetSchemaMetadata() // Reflect metadata on success
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

    private static List<FieldMetadata> GetSchemaMetadata()
    {
        var metadataList = new List<FieldMetadata>();
        var type = typeof(T);

        if (type.IsGenericType &&
            (type.GetGenericTypeDefinition() == typeof(List<>)
          || type.GetGenericTypeDefinition() == typeof(IEnumerable<>)))
        {
            type = type.GetGenericArguments()[0];
        }

        // Map constructor parameters by name (for records)
        var ctorParams = type.GetConstructors()
            .SelectMany(c => c.GetParameters())
            .ToDictionary(p => p.Name!, p => p, StringComparer.OrdinalIgnoreCase);

        foreach (var prop in type.GetProperties(BindingFlags.Public | BindingFlags.Instance))
        {
            ctorParams.TryGetValue(prop.Name, out var ctorParam);

            var field = new FieldMetadata
            {
                FieldName = prop.Name,
                DataType = (Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType).Name,

                IsRequired =
                    prop.GetCustomAttribute<RequiredAttribute>() != null ||
                    ctorParam?.GetCustomAttribute<RequiredAttribute>() != null,

                MaxLength =
                    prop.GetCustomAttribute<MaxLengthAttribute>()?.Length
                    ?? prop.GetCustomAttribute<StringLengthAttribute>()?.MaximumLength
                    ?? ctorParam?.GetCustomAttribute<MaxLengthAttribute>()?.Length
                    ?? ctorParam?.GetCustomAttribute<StringLengthAttribute>()?.MaximumLength,

                MinValue =
                    (double?)prop.GetCustomAttribute<RangeAttribute>()?.Minimum
                    ?? (double?)ctorParam?.GetCustomAttribute<RangeAttribute>()?.Minimum,

                MaxValue =
                    (double?)prop.GetCustomAttribute<RangeAttribute>()?.Maximum
                    ?? (double?)ctorParam?.GetCustomAttribute<RangeAttribute>()?.Maximum
            };

            metadataList.Add(field);
        }

        return metadataList;
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
