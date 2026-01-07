using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TypeGen.Core.TypeAnnotations;

namespace tracker_api;

[ExportTsInterface]
public class EventType
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public required int Id { get; set; }
    public required string Name { get; set; }
    public required string Category { get; set; }
    public required bool IsSystemDefined { get; set; }

    public ICollection<Event> Events { get; set; } = new List<Event>();
}