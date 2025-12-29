

namespace tracker_api;

public class Contact : BaseEntity
{
    public long? CompanyId { get; set; }
    public Company? Company { get; set; }

    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string? Title { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? LinkedInUrl { get; set; }
    public bool? IsPrimaryRecruiter { get; set; }
    public string? Notes { get; set; }

    public ICollection<Event> Events { get; set; } = new List<Event>();
}
