namespace tracker_api.DTOs;

// -----------------------------
// Company DTOs
// -----------------------------
public record CompanyReadDto(
    long Id,
    string Name,
    string? Website,
    string? Industry,
    string? SizeRange,
    string? Notes
);

public record CompanyCreateDto(
    string Name,
    string? Website,
    string? Industry,
    string? SizeRange,
    string? Notes
);

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
public record EventTypeReadDto(
    int Id,
    string Name,
    string Category,
    bool IsSystemDefined
);

public record EventTypeCreateDto(
    int Id,
    string Name,
    string Category,
    bool IsSystemDefined
);

public record EventTypeUpdateDto(
    string? Name,
    string? Category,
    bool? IsSystemDefined
);

// -----------------------------
// Reminder DTOs
// -----------------------------
public record ReminderReadDto(
    long Id,
    long EventId,
    DateTime RemindAt,
    DateTime? CompletedAt
);

public record ReminderCreateDto(
    long EventId,
    DateTime RemindAt
);

public record ReminderUpdateDto(
    DateTime? RemindAt,
    DateTime? CompletedAt
);

// -----------------------------
// Role DTOs
// -----------------------------
public record RoleReadDto(
    long Id,
    long? CompanyId,
    string Title,
    string? JobPostingUrl,
    string? Location,
    RoleLevel Level
);

public record RoleCreateDto(
    long? CompanyId,
    string Title,
    string? JobPostingUrl,
    string? Location,
    RoleLevel Level
);

public record RoleUpdateDto(
    long? CompanyId,
    string? Title,
    string? JobPostingUrl,
    string? Location,
    RoleLevel? Level
);