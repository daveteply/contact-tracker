using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ContactTracker.TrackerAPI.Tests;

/// <summary>
/// Custom factory that uses a dedicated PostgreSQL test database.
/// The database is managed by DatabaseFixture and shared across all tests.
/// </summary>
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly DatabaseFixture _databaseFixture;

    // IMPORTANT:
    // Tests must use these JsonSerializerOptions when calling ReadFromJsonAsync<T>.
    // The API serializes enums as strings, but HttpClient does NOT automatically
    // use server-side JSON configuration.
    public static readonly JsonSerializerOptions JsonOptions = CreateJsonOptions();

    public CustomWebApplicationFactory(DatabaseFixture databaseFixture)
    {
        _databaseFixture = databaseFixture;
    }

    private static JsonSerializerOptions CreateJsonOptions()
    {
        return new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters =
            {
                new JsonStringEnumConverter()
            }
        };
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureServices(services =>
        {
            // Remove the existing DbContext registration
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<ContactTrackerDbContext>));

            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            // Add DbContext with PostgreSQL test database
            services.AddDbContext<ContactTrackerDbContext>(options =>
            {
                options.UseNpgsql(_databaseFixture.ConnectionString);
            });

            // Ensure JSON options match app
            services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
            {
                options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });
        });
    }

    /// <summary>
    /// Resets the database to a clean state - delegates to the shared DatabaseFixture
    /// </summary>
    public async Task ResetDatabaseAsync()
    {
        await _databaseFixture.ResetDatabaseAsync();
    }
}