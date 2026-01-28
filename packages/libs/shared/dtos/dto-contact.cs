using System.ComponentModel.DataAnnotations;
using TypeGen.Core.TypeAnnotations;

namespace ContactTracker.Libs.Shared.DTOs;

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

    [property: Required]
    [property: MaxLength(100)]
    string FirstName,

    [property: Required]
    [property: MaxLength(100)]
    string LastName,

    [property: MaxLength(100)]
    string? Title,

    [property: EmailAddress]
    [property: MaxLength(254)]
    string? Email,

    [property: Phone]
    [property: MaxLength(16)]
    string? PhoneNumber,

    [property: Url]
    [property: MaxLength(2048)]
    string? LinkedInUrl,

    bool? IsPrimaryRecruiter,

    string? Notes
);

[ExportTsInterface]
public record ContactUpdateDto(
    long? CompanyId,

    [property: MaxLength(100)]
    string? FirstName,

    [property: MaxLength(100)]
    string? LastName,

    [property: MaxLength(100)]
    string? Title,

    [property: EmailAddress]
    [property: MaxLength(254)]
    string? Email,

    [property: Phone]
    [property: MaxLength(16)]
    string? PhoneNumber,

    [property: Url]
    [property: MaxLength(2048)]
    string? LinkedInUrl,

    bool? IsPrimaryRecruiter,

    string? Notes
);
