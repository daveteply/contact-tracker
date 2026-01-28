namespace ContactTracker.TrackerAPI;

public class Reminder : BaseEntity
{
    public long EventId { get; set; }
    public required Event Event { get; set; }

    public required DateTime RemindAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}
