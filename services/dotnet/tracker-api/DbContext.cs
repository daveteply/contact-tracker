using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using tracker_api;

public class ContactTrackerDbContext : DbContext
{
    public ContactTrackerDbContext(DbContextOptions<ContactTrackerDbContext> options)
        : base(options)
    {
    }

    public DbSet<Company> Companies { get; set; }
    public DbSet<Contact> Contacts { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<EventType> EventTypes { get; set; }
    public DbSet<Reminder> Reminders { get; set; }
    public DbSet<Role> Roles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure audit fields
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(IAuditableEntity).IsAssignableFrom(entityType.ClrType))
            {
                modelBuilder.Entity(entityType.ClrType)
                    .Property(nameof(IAuditableEntity.CreatedAt))
                    .HasDefaultValueSql("now() at time zone 'utc'"); // PostgreSQL syntax

                modelBuilder.Entity(entityType.ClrType)
                    .Property(nameof(IAuditableEntity.UpdatedAt))
                    .HasDefaultValueSql("now() at time zone 'utc'")
                    .ValueGeneratedOnAddOrUpdate(); // Let the DB handle value generation
            }
        }

        // Configure enum storage for PostgreSQL
        modelBuilder.Entity<Event>()
            .Property(e => e.Source)
            .HasConversion<string>();

        modelBuilder.Entity<Event>()
            .Property(e => e.Direction)
            .HasConversion<string>();

        modelBuilder.Entity<Role>()
            .Property(r => r.Level)
            .HasConversion<string>();

        // Configure relationships explicitly (optional, but clearer)
        modelBuilder.Entity<Event>()
            .HasOne(e => e.Company)
            .WithMany(c => c.Events)
            .HasForeignKey(e => e.CompanyId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Event>()
            .HasOne(e => e.Contact)
            .WithMany(c => c.Events)
            .HasForeignKey(e => e.ContactId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Event>()
            .HasOne(e => e.Role)
            .WithMany(r => r.Events)
            .HasForeignKey(e => e.RoleId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Event>()
            .HasOne(e => e.EventType)
            .WithMany(et => et.Events)
            .HasForeignKey(e => e.EventTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        // Seed data for event types
        modelBuilder.Entity<EventType>().HasData(
            new EventType { Id = 1, Name = "Applied", Category = "Application", IsSystemDefined = true },
            new EventType { Id = 2, Name = "Recruiter Outreach", Category = "Communication", IsSystemDefined = true },
            new EventType { Id = 3, Name = "Interview Scheduled", Category = "Interview", IsSystemDefined = true },
            new EventType { Id = 4, Name = "Interview Completed", Category = "Interview", IsSystemDefined = true },
            new EventType { Id = 5, Name = "Follow-up Sent", Category = "Communication", IsSystemDefined = true },
            new EventType { Id = 6, Name = "Rejected", Category = "Outcome", IsSystemDefined = true },
            new EventType { Id = 7, Name = "Offer Received", Category = "Outcome", IsSystemDefined = true }
        );

        // Indexes
        modelBuilder.Entity<Event>().HasIndex(e => e.CompanyId);
        modelBuilder.Entity<Event>().HasIndex(e => e.OccurredAt);
        modelBuilder.Entity<Contact>().HasIndex(c => c.CompanyId);
        modelBuilder.Entity<Role>().HasIndex(r => r.CompanyId);
    }
}

public interface IAuditableEntity
{
    DateTime CreatedAt { get; set; }
    DateTime UpdatedAt { get; set; }
}

public abstract class BaseEntity : IAuditableEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
