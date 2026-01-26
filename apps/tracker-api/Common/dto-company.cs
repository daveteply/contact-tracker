using System.ComponentModel.DataAnnotations;
using TypeGen.Core.TypeAnnotations;

namespace tracker_api.DTOs;

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
    [Required]
    [MaxLength(100)]
    string Name,

    [Url]
    [MaxLength(2048)]
    string? Website,

    [MaxLength(100)]
    string? Industry,

    [MaxLength(100)]
    string? SizeRange,

    string? Notes
);

[ExportTsInterface]
public record CompanyUpdateDto(
    [MaxLength(100)]
    string? Name,

    [Url]
    [MaxLength(2048)]
    string? Website,

    [MaxLength(100)]
    string? Industry,

    [MaxLength(100)]
    string? SizeRange,

    string? Notes
);
