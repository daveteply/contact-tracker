using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ContactTracker.SharedDTOs;
using ContactTracker.TrackerAPI;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Npgsql;

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

        // ensure case insensitive 
        modelBuilder.HasCollation(name: "case_insensitive", locale: "en-u-ks-primary", provider: "icu", deterministic: false);
        // Note: Collation removed from search fields (Name, FirstName, LastName, Title) as nondeterministic collations don't support LIKE operations
        // Collation is only applied to fields used for ordering, not searching

        // Configure enum storage for PostgreSQL
        modelBuilder.Entity<Event>().Property(e => e.Source).HasConversion<string>();
        modelBuilder.Entity<Event>().Property(e => e.Direction).HasConversion<string>();
        modelBuilder.Entity<Role>().Property(r => r.Level).HasConversion<string>();

        // Configure relationships explicitly (optional, but clearer)
        modelBuilder.Entity<Event>()
            .HasOne(e => e.Company)
            .WithMany(c => c.Events)
            .HasForeignKey(e => e.CompanyId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Event>()
            .HasOne(e => e.Contact)
            .WithMany(c => c.Events)
            .HasForeignKey(e => e.ContactId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Event>()
            .HasOne(e => e.Role)
            .WithMany(r => r.Events)
            .HasForeignKey(e => e.RoleId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Event>()
            .HasOne(e => e.EventType)
            .WithMany(et => et.Events)
            .HasForeignKey(e => e.EventTypeId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        modelBuilder.Entity<Event>().HasIndex(e => e.CompanyId);
        modelBuilder.Entity<Event>().HasIndex(e => e.OccurredAt);
        modelBuilder.Entity<Contact>().HasIndex(c => c.CompanyId);
        modelBuilder.Entity<Contact>().HasIndex(c => c.FirstName);
        modelBuilder.Entity<Contact>().HasIndex(c => c.LastName);
        modelBuilder.Entity<Role>().HasIndex(r => r.CompanyId);
        modelBuilder.Entity<Role>().HasIndex(r => r.Title);
        modelBuilder.Entity<Company>().HasIndex(c => c.Name).IsUnique();
        modelBuilder.Entity<Role>().HasIndex(r => new { r.CompanyId, r.Title }).IsUnique();
        modelBuilder.Entity<Contact>().HasIndex(c => c.Email).IsUnique().HasFilter("\"Email\" IS NOT NULL");

        // Seed data for event types
        modelBuilder.Entity<EventType>().HasData(
            // Application & Discovery (Assign manual IDs)
            new EventType { Id = -1, Name = "Job Lead", Category = EventTypeCategoryType.Discovery, IsSystemDefined = true },
            new EventType { Id = -2, Name = "Applied", Category = EventTypeCategoryType.Application, IsSystemDefined = true },

            // Communication & Networking
            new EventType { Id = -3, Name = "Recruiter Outreach", Category = EventTypeCategoryType.Communication, IsSystemDefined = true },
            new EventType { Id = -4, Name = "Networking/Coffee Chat", Category = EventTypeCategoryType.Networking, IsSystemDefined = true },
            new EventType { Id = -5, Name = "Follow-up Sent", Category = EventTypeCategoryType.Communication, IsSystemDefined = true },

            // Assessments & Interviews
            new EventType { Id = -6, Name = "Technical Assessment", Category = EventTypeCategoryType.Assessment, IsSystemDefined = true },
            new EventType { Id = -7, Name = "Screening Call", Category = EventTypeCategoryType.Interview, IsSystemDefined = true },
            new EventType { Id = -8, Name = "Technical Interview", Category = EventTypeCategoryType.Interview, IsSystemDefined = true },
            new EventType { Id = -9, Name = "Onsite Interview", Category = EventTypeCategoryType.Interview, IsSystemDefined = true },

            // Outcomes
            new EventType { Id = -10, Name = "Offer Received", Category = EventTypeCategoryType.Offer, IsSystemDefined = true },
            new EventType { Id = -11, Name = "Offer Accepted", Category = EventTypeCategoryType.Outcome, IsSystemDefined = true },
            new EventType { Id = -12, Name = "Rejected", Category = EventTypeCategoryType.Outcome, IsSystemDefined = true },
            new EventType { Id = -13, Name = "Withdrew Application", Category = EventTypeCategoryType.Outcome, IsSystemDefined = true }
        );
    }

    // Ensure the dates are updated in PostgresSql
    public override int SaveChanges()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.Entity is IAuditableEntity && (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            ((IAuditableEntity)entityEntry.Entity).UpdatedAt = DateTime.UtcNow;

            if (entityEntry.State == EntityState.Added)
            {
                ((IAuditableEntity)entityEntry.Entity).CreatedAt = DateTime.UtcNow;
            }
        }

        return base.SaveChanges();
    }

    public static bool IsUniqueViolation(DbUpdateException ex)
    {
        return ex.InnerException is PostgresException pgEx
            && pgEx.SqlState == PostgresErrorCodes.UniqueViolation;
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
