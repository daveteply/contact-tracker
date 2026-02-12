using System.ComponentModel.DataAnnotations;
using ContactTracker.SharedDTOs;

public class ContactDocumentDto : BaseDocumentDto
{
    public Guid? CompanyId { get; set; }

    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = default!;

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; }  = default!;

    [MaxLength(100)]
    public string? Title { get; set; }

    [EmailAddress]
    [MaxLength(254)]
    public string? Email { get; set; }

    [Phone]
    [MaxLength(16)]
    public string? PhoneNumber { get; set; }

    [Url]
    [MaxLength(2048)]
    public string? LinkedInUrl { get; set; }

    public bool? IsPrimaryRecruiter { get; set; }

    [MaxLength(2048)]
    public string? Notes { get; set; }
}