using System.ComponentModel.DataAnnotations;
using TypeGen.Core.TypeAnnotations;

namespace ContactTracker.SharedDTOs;

[ExportTsInterface]
public class EventTypeDocumentDto : BaseDocumentDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = default!;

    public EventTypeCategoryTypeDto Category { get; set; }
    public bool IsSystemDefined { get; set; }
}