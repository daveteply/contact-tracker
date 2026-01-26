using System.ComponentModel.DataAnnotations;
using TypeGen.Core.TypeAnnotations;

namespace tracker_api.DTOs;

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
