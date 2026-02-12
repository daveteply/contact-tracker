using System.ComponentModel.DataAnnotations;

namespace ContactTracker.SharedDTOs;

public class ReminderDocumentDto : BaseDocumentDto
{
    public Guid? EventId { get; set; }
    public DateTime RemindAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}