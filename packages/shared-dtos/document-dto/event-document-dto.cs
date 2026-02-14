using System.ComponentModel.DataAnnotations;
using TypeGen.Core.TypeAnnotations;

namespace ContactTracker.SharedDTOs;

[ExportTsInterface]
public class EventDocumentDto : BaseDocumentDto
{
    public Guid? CompanyId { get; set; }

    public Guid? ContactId { get; set; }

    public Guid? RoleId { get; set; }

    public Guid? EventTypeId { get; set; }

    public DateTime OccurredAt { get; set; }

    [MaxLength(256)]
    public string? Summary { get; set; }

    [MaxLength(1024)]
    public string? Details { get; set; }

    SourceTypeDto Source { get; set; }
    public DirectionTypeDto Direction { get; set; }
}