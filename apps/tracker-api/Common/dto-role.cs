using System.ComponentModel.DataAnnotations;
using TypeGen.Core.TypeAnnotations;

namespace tracker_api.DTOs;

// -----------------------------
// Role DTOs
// -----------------------------
[ExportTsInterface]
public record RoleReadDto(
    long Id,
    long? CompanyId,
    CompanyReadDto? Company,
    [MaxLength(100)]
    string Title,
    [MaxLength(2048)]
    string? JobPostingUrl,
    [MaxLength(100)]
    string? Location,
    RoleLevel Level
);

[ExportTsInterface]
public record RoleCreateDto(
    long? CompanyId,
    CompanyCreateDto? Company,
    [MaxLength(100)]
    string Title,
    [MaxLength(2048)]
    string? JobPostingUrl,
    [MaxLength(100)]
    string? Location,
    RoleLevel Level
);

[ExportTsInterface]
public record RoleUpdateDto(
    long? CompanyId,
    CompanyUpdateDto? Company,
    [MaxLength(100)]
    string? Title,
    [MaxLength(2048)]
    string? JobPostingUrl,
    [MaxLength(100)]
    string? Location,
    RoleLevel? Level
);