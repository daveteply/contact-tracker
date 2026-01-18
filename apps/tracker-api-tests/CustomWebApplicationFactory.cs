using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace tracker_api.Tests;

/// <summary>
/// Custom factory that replaces the PostgreSQL database with an in-memory database for testing.
/// This ensures tests don't touch your production or development databases.
/// </summary>
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _databaseName = $"TestDatabase_{Guid.NewGuid()}";

    // IMPORTANT:
    // Tests must use these JsonSerializerOptions when calling ReadFromJsonAsync<T>.
    // The API serializes enums as strings, but HttpClient does NOT automatically
    // use server-side JSON configuration.
    public static readonly JsonSerializerOptions JsonOptions = CreateJsonOptions();

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
            // Add DbContext with in-memory database
            // Use the same database name for the entire factory lifetime
            services.AddDbContext<ContactTrackerDbContext>(options =>
            {
                options.UseInMemoryDatabase(_databaseName);
            });

            // Ensure JSON options match app
            services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
            {
                options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });
        });
    }

    public ContactTrackerDbContext GetDbContext()
    {
        var scope = Services.CreateScope();
        return scope.ServiceProvider.GetRequiredService<ContactTrackerDbContext>();
    }
}
