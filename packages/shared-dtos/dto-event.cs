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

    long EventTypeId,
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

    long EventTypeId,
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

    long? EventTypeId,
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
    long Id,
    string Name,
    EventTypeCategoryType Category,
    bool IsSystemDefined
);

[ExportTsInterface]
public record EventTypeCreateDto(
    long Id,

    [Required]
    [MaxLength(100)]
    string Name,

    EventTypeCategoryType Category,
    bool IsSystemDefined
);

[ExportTsInterface]
public record EventTypeUpdateDto(
    [MaxLength(100)]
    string? Name,

    EventTypeCategoryType Category,
    bool? IsSystemDefined
);
