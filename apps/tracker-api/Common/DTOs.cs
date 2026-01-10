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
    string Name,
    string? Website,
    string? Industry,
    string? SizeRange,
    string? Notes
);

[ExportTsInterface]
public record CompanyUpdateDto(
    string? Name,
    string? Website,
    string? Industry,
    string? SizeRange,
    string? Notes
);

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
public record ContactUpdateDto(
    long? CompanyId,
    string? FirstName,
    string? LastName,
    string? Title,
    string? Email,
    string? PhoneNumber,
    string? LinkedInUrl,
    bool? IsPrimaryRecruiter,
    string? Notes
);

// -----------------------------
// Event DTOs
// -----------------------------
[ExportTsInterface]
public record EventReadDto(
    long Id,
    long? CompanyId,
    long? ContactId,
    long? RoleId,
    int EventTypeId,
    DateTime OccurredAt,
    string? Summary,
    string? Details,
    SourceType Source,
    DirectionType Direction
);

[ExportTsInterface]
public record EventCreateDto(
    long? CompanyId,
    long? ContactId,
    long? RoleId,
    int EventTypeId,
    DateTime OccurredAt,
    string? Summary,
    string? Details,
    SourceType Source,
    DirectionType Direction
);

[ExportTsInterface]
public record EventUpdateDto(
    long? CompanyId,
    long? ContactId,
    long? RoleId,
    int? EventTypeId,
    DateTime? OccurredAt,
    string? Summary,
    string? Details,
    SourceType? Source,
    DirectionType? Direction
);

// -----------------------------
// EventType DTOs
// -----------------------------
[ExportTsInterface]
public record EventTypeReadDto(
    int Id,
    string Name,
    string Category,
    bool IsSystemDefined
);

[ExportTsInterface]
public record EventTypeCreateDto(
    int Id,
    string Name,
    string Category,
    bool IsSystemDefined
);

[ExportTsInterface]
public record EventTypeUpdateDto(
    string? Name,
    string? Category,
    bool? IsSystemDefined
);

// -----------------------------
// Reminder DTOs
// -----------------------------
[ExportTsInterface]
public record ReminderReadDto(
    long Id,
    long EventId,
    DateTime RemindAt,
    DateTime? CompletedAt
);

[ExportTsInterface]
public record ReminderCreateDto(
    long EventId,
    DateTime RemindAt
);

[ExportTsInterface]
public record ReminderUpdateDto(
    DateTime? RemindAt,
    DateTime? CompletedAt
);

// -----------------------------
// Role DTOs
// -----------------------------
[ExportTsInterface]
public record RoleReadDto(
    long Id,
    long? CompanyId,
    string Title,
    string? JobPostingUrl,
    string? Location,
    RoleLevel Level
);

[ExportTsInterface]
public record RoleCreateDto(
    long? CompanyId,
    string Title,
    string? JobPostingUrl,
    string? Location,
    RoleLevel Level
);

[ExportTsInterface]
public record RoleUpdateDto(
    long? CompanyId,
    string? Title,
    string? JobPostingUrl,
    string? Location,
    RoleLevel? Level
);