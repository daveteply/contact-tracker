using TypeGen.Core.TypeAnnotations;

namespace ContactTracker.SharedDTOs;

[ExportTsInterface]
public abstract class BaseDocumentDto
{
    public Guid Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}