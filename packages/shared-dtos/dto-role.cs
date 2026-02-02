using System.ComponentModel.DataAnnotations;
using TypeGen.Core.TypeAnnotations;

namespace ContactTracker.SharedDTOs;

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
    CompanyCreateDto? NewCompany,

    [Required]
    [MaxLength(100)]
    string Title,

    [Url]
    [MaxLength(2048)]
    string? JobPostingUrl,

    [MaxLength(100)]
    string? Location,

    RoleLevel Level
);

[ExportTsInterface]
public record RoleUpdateDto(
    long? CompanyId,
    CompanyUpdateDto? UpdateCompany,

    [MaxLength(100)]
    string? Title,

    [Url]
    [MaxLength(2048)]
    string? JobPostingUrl,

    [MaxLength(100)]
    string? Location,

    RoleLevel? Level
);