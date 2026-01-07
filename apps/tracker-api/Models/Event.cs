using TypeGen.Core.TypeAnnotations;
namespace tracker_api;

[ExportTsEnum]
public enum SourceType
{
    Email, LinkedIn, Website, Recruiter, Referral
}

[ExportTsEnum]
public enum DirectionType
{
    Inbound, Outbound
}

[ExportTsInterface]
public class Event : BaseEntity
{
    public long? CompanyId { get; set; }
    public Company? Company { get; set; }

    public long? ContactId { get; set; }
    public Contact? Contact { get; set; }

    public long? RoleId { get; set; }
    public Role? Role { get; set; }

    public int EventTypeId { get; set; }
    public EventType? EventType { get; set; }

    public required DateTime OccurredAt { get; set; }
    public string? Summary { get; set; }
    public string? Details { get; set; }
    public required SourceType Source { get; set; }
    public required DirectionType Direction { get; set; }

    public ICollection<Reminder> Reminders { get; set; } = new List<Reminder>();
}
