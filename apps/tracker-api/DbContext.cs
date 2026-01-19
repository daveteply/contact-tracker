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

        // ensure case insensitive 
        modelBuilder.HasCollation(name: "case_insensitive", locale: "en-u-ks-primary", provider: "icu", deterministic: false);
        modelBuilder.Entity<Company>().Property(c => c.Name).UseCollation("case_insensitive");
        modelBuilder.Entity<Contact>().Property(c => c.FirstName).UseCollation("case_insensitive");
        modelBuilder.Entity<Contact>().Property(c => c.LastName).UseCollation("case_insensitive");
        modelBuilder.Entity<Role>().Property(c => c.Title).UseCollation("case_insensitive");

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
            new EventType { Id = 1, Name = "Applied", Category = "Application", IsSystemDefined = true },
            new EventType { Id = 2, Name = "Recruiter Outreach", Category = "Communication", IsSystemDefined = true },
            new EventType { Id = 3, Name = "Interview Scheduled", Category = "Interview", IsSystemDefined = true },
            new EventType { Id = 4, Name = "Interview Completed", Category = "Interview", IsSystemDefined = true },
            new EventType { Id = 5, Name = "Follow-up Sent", Category = "Communication", IsSystemDefined = true },
            new EventType { Id = 6, Name = "Rejected", Category = "Outcome", IsSystemDefined = true },
            new EventType { Id = 7, Name = "Offer Received", Category = "Outcome", IsSystemDefined = true }
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
