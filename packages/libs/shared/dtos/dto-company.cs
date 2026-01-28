using System.ComponentModel.DataAnnotations;
using TypeGen.Core.TypeAnnotations;

namespace ContactTracker.Libs.Shared.DTOs;

// -----------------------------
// Company DTOs
// -----------------------------
[ExportTsInterface]
public record CompanyReadDto(
    long Id,
    string Name,
    string? Website,
    string? Industry,
    string? SizeRange,
    string? Notes
);

[ExportTsInterface]
public record CompanyCreateDto(
    [property: Required]
    [property: MaxLength(100)]
    string Name,

    [property: Url]
    [property: MaxLength(2048)]
    string? Website,

    [property: MaxLength(100)]
    string? Industry,

    [property: MaxLength(100)]
    string? SizeRange,

    string? Notes
);

[ExportTsInterface]
public record CompanyUpdateDto(
    [property: MaxLength(100)]
    string? Name,

    [property: Url]
    [property: MaxLength(2048)]
    string? Website,

    [property: MaxLength(100)]
    string? Industry,

    [property: MaxLength(100)]
    string? SizeRange,

    string? Notes
);
