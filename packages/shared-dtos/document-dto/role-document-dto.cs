using System.ComponentModel.DataAnnotations;
using ContactTracker.SharedDTOs;

public class RoleDocumentDto : BaseDocumentDto
{
    public Guid? CompanyId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = default!;

    [Url]
    [MaxLength(2048)]
    public string? JobPostingUrl { get; set; }

    [MaxLength(100)]
    public string? Location { get; set; }

    public RoleLevelTypeDto Level {get; set; }
}