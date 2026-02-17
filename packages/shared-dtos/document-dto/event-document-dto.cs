using System.ComponentModel.DataAnnotations;
using TypeGen.Core.TypeAnnotations;

namespace ContactTracker.SharedDTOs;

[ExportTsInterface]
public class EventDocumentDto : BaseDocumentDto
{
    public Guid? CompanyId { get; set; }
    public CompanyDocumentDto? NewCompany;
    public CompanyDocumentDto? UpdateCompany;

    public Guid? ContactId { get; set; }
    public ContactDocumentDto? NewContact;
    public ContactDocumentDto? UpdateContact;

    public Guid? RoleId { get; set; }
    public RoleDocumentDto? NewRole;
    public RoleDocumentDto? UpdateRole;

    public Guid? EventTypeId { get; set; }

    public DateTime OccurredAt { get; set; }

    [MaxLength(256)]
    public string? Summary { get; set; }

    [MaxLength(1024)]
    public string? Details { get; set; }

    SourceTypeDto Source { get; set; }
    public DirectionTypeDto Direction { get; set; }
}