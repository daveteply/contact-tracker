using System.ComponentModel.DataAnnotations;

namespace ContactTracker.SharedDTOs;

public class CompanyDocumentDto : BaseDocumentDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = default!;

    [MaxLength(2048)]
    public string? Website { get; set; }

    [MaxLength(100)]
    public string? Industry { get; set; }

    [MaxLength(100)]
    public string? SizeRange { get; set; }

    [MaxLength(2048)]
    public string? Notes { get; set; }
}
