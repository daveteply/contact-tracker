using System.ComponentModel.DataAnnotations;
using TypeGen.Core.TypeAnnotations;

namespace tracker_api.DTOs;

// -----------------------------
// Contact DTOs
// -----------------------------
[ExportTsInterface]
public record ContactReadDto(
    long Id,
    long? CompanyId,
    string FirstName,
    string LastName,
    string? Title,
    string? Email,
    string? PhoneNumber,
    string? LinkedInUrl,
    bool? IsPrimaryRecruiter,
    string? Notes
);

[ExportTsInterface]
public record ContactCreateDto(
    long? CompanyId,

    [Required]
    [MaxLength(100)]
    string FirstName,

    [Required]
    [MaxLength(100)]
    string LastName,

    [MaxLength(100)]
    string? Title,

    [EmailAddress]
    [MaxLength(254)]
    string? Email,

    [Phone]
    [MaxLength(16)]
    string? PhoneNumber,

    [Url]
    [MaxLength(2048)]
    string? LinkedInUrl,

    bool? IsPrimaryRecruiter,

    string? Notes
);

[ExportTsInterface]
public record ContactUpdateDto(
    long? CompanyId,

    [MaxLength(100)]
    string? FirstName,

    [MaxLength(100)]
    string? LastName,

    [MaxLength(100)]
    string? Title,

    [EmailAddress]
    [MaxLength(254)]
    string? Email,

    [Phone]
    [MaxLength(16)]
    string? PhoneNumber,

    [Url]
    [MaxLength(2048)]
    string? LinkedInUrl,

    bool? IsPrimaryRecruiter,

    string? Notes
);
