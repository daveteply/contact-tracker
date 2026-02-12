using System.ComponentModel.DataAnnotations;

namespace ContactTracker.SharedDTOs;

public class EventTypeDocumentDto : BaseDocumentDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = default!;

    public EventTypeCategoryTypeDto Category { get; set; }
    public bool IsSystemDefined { get; set; }
}