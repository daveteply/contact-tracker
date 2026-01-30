using ContactTracker.SharedDTOs;

namespace ContactTracker.TrackerAPI;

public class Role : BaseEntity
{
    public long? CompanyId { get; set; }
    public Company? Company { get; set; }

    public required string Title { get; set; }
    public string? JobPostingUrl { get; set; }
    public string? Location { get; set; }
    public RoleLevel Level { get; set; }

    public ICollection<Event> Events { get; set; } = new List<Event>();
}
