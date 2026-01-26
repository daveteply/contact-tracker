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
    [MaxLength(100)]
    string FirstName,
    [MaxLength(100)]
    string LastName,
    [MaxLength(100)]
    string? Title,
    [MaxLength(254)]
    string? Email,
    [MaxLength(16)]
    string? PhoneNumber,
    [MaxLength(2048)]
    string? LinkedInUrl,
    bool? IsPrimaryRecruiter,
    string? Notes
);

[ExportTsInterface]
public record ContactCreateDto(
    long? CompanyId,
    [MaxLength(100)]
    string FirstName,
    [MaxLength(100)]
    string LastName,
    string? Title,
    [MaxLength(254)]
    string? Email,
    [MaxLength(16)]
    string? PhoneNumber,
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
    string? Title,
    [MaxLength(254)]
    string? Email,
    [MaxLength(16)]
    string? PhoneNumber,
    [MaxLength(2048)]
    string? LinkedInUrl,
    bool? IsPrimaryRecruiter,
    string? Notes
);
