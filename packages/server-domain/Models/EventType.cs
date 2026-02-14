namespace ContactTracker.ServerDomain;

public class EventType : BaseEntity
{
    public required string Name { get; set; }
    public required EventTypeCategoryType Category { get; set; }
    public required bool IsSystemDefined { get; set; }

    public ICollection<Event> Events { get; set; } = new List<Event>();
}