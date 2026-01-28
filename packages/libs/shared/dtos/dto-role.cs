using System.ComponentModel.DataAnnotations;
using TypeGen.Core.TypeAnnotations;

namespace ContactTracker.Libs.Shared.DTOs;

// -----------------------------
// Role DTOs
// -----------------------------
[ExportTsInterface]
public record RoleReadDto(
    long Id,
    long? CompanyId,
    CompanyReadDto? Company,
    string Title,
    string? JobPostingUrl,
    string? Location,
    RoleLevel Level
);

[ExportTsInterface]
public record RoleCreateDto(
    long? CompanyId,
    CompanyCreateDto? Company,

    [property: Required]
    [property: MaxLength(100)]
    string Title,

    [property: Url]
    [property: MaxLength(2048)]
    string? JobPostingUrl,

    [property: MaxLength(100)]
    string? Location,

    RoleLevel Level
);

[ExportTsInterface]
public record RoleUpdateDto(
    long? CompanyId,
    CompanyUpdateDto? Company,

    [property: MaxLength(100)]
    string? Title,

    [property: Url]
    [property: MaxLength(2048)]
    string? JobPostingUrl,

    [property: MaxLength(100)]
    string? Location,

    RoleLevel? Level
);