using Microsoft.EntityFrameworkCore;

public class ContractTrackerDbContext : DbContext
{
    public ContractTrackerDbContext(DbContextOptions<ContractTrackerDbContext> options)
        : base(options)
    {
    }

    public DbSet<Contact> Contracts { get; set; }
}

public class Contact
{
    public int Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? Title { get; set; }
    public string Email { get; set; } = null!;
    public string? PhoneNumber { get; set; }
    public DateTime CreatedAt { get; set; }
}