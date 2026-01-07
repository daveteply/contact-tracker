using TypeGen.Core.TypeAnnotations;
namespace tracker_api;

[ExportTsInterface]
public class Company : BaseEntity
{
    public required string Name { get; set; }
    public string? Website { get; set; }
    public string? Industry { get; set; }
    public string? SizeRange { get; set; }
    public string? Notes { get; set; }

    public ICollection<Event> Events { get; set; } = new List<Event>();
    public ICollection<Contact> Contacts { get; set; } = new List<Contact>();
    public ICollection<Role> Roles { get; set; } = new List<Role>();
}
