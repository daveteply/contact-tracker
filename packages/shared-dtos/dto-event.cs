using System.ComponentModel.DataAnnotations;
using TypeGen.Core.TypeAnnotations;

namespace ContactTracker.SharedDTOs;

// -----------------------------
// Event DTOs
// -----------------------------
[ExportTsInterface]
public record EventReadDto(
    long Id,

    long? CompanyId,
    CompanyReadDto? Company,

    long? ContactId,
    ContactReadDto? Contact,

    long? RoleId,
    RoleReadDto? Role,

    int EventTypeId,
    EventTypeReadDto? EventType,

    DateTime OccurredAt,
    string? Summary,
    string? Details,
    SourceType Source,
    DirectionType Direction
);

[ExportTsInterface]
public record EventCreateDto(
    long? CompanyId,
    CompanyCreateDto? NewCompany,

    long? ContactId,
    ContactCreateDto? NewContact,

    long? RoleId,
    RoleCreateDto? NewRole,

    int EventTypeId,
    EventTypeCreateDto NewEventType,

    DateTime OccurredAt,

    [MaxLength(256)]
    string? Summary,

    [MaxLength(1024)]
    string? Details,

    SourceType Source,
    DirectionType Direction
);

[ExportTsInterface]
public record EventUpdateDto(
    long? CompanyId,
    CompanyUpdateDto? UpdateCompany,

    long? ContactId,
    ContactUpdateDto? UpdateContact,

    long? RoleId,
    RoleUpdateDto? UpdateRole,

    int? EventTypeId,
    EventTypeUpdateDto? UpdateEventType,

    DateTime? OccurredAt,

    [MaxLength(256)]
    string? Summary,

    [MaxLength(1024)]
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

    [Required]
    [MaxLength(100)]
    string Name,

    [MaxLength(100)]
    string? Category,

    bool IsSystemDefined
);

[ExportTsInterface]
public record EventTypeUpdateDto(
    [MaxLength(100)]
    string? Name,

    [MaxLength(100)]
    string? Category,

    bool? IsSystemDefined
);
