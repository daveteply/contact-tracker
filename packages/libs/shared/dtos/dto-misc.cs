using TypeGen.Core.TypeAnnotations;

namespace ContactTracker.Libs.Shared.DTOs;

public class FieldMetadata
{
    public string FieldName { get; set; } = string.Empty;
    public string DataType { get; set; } = string.Empty;
    public bool IsRequired { get; set; }
    public int? MaxLength { get; set; }
    public double? MinValue { get; set; }
    public double? MaxValue { get; set; }
}

// -----------------------------
// Pagination DTOs
// -----------------------------
[ExportTsInterface]
public record PagedResult<T>(
    List<T> Data,
    PaginationMetadata Pagination
);

[ExportTsInterface]
public record PaginationMetadata(
    int CurrentPage,
    int PageSize,
    int TotalPages,
    int TotalCount,
    bool HasPrevious,
    bool HasNext
);

