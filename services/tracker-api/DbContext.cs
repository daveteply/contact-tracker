using Microsoft.EntityFrameworkCore;

public class ContractTrackerContext : DbContext
{
    public ContractTrackerContext(DbContextOptions<ContractTrackerContext> options)
        : base(options)
    {
    }

    protected  override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseNpgsql("Host=postgres;Port=5432;Database=mydb;Username=myuser;Password=mypassword");
        }
    }

    public DbSet<Contact> Contracts { get; set; }
}

public class Contact
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public required string Email { get; set; }
    public string? PhoneNumber { get; set; }
}