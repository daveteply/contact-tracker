using TypeGen.Core.TypeAnnotations;

namespace ContactTracker.SharedDTOs;

[ExportTsInterface]
public class ReminderDocumentDto : BaseDocumentDto
{
    public Guid? EventId { get; set; }
    public DateTime RemindAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}