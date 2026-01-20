using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace tracker_api.Tests;

/// <summary>
/// Shared database fixture that is created once for all tests.
/// This ensures the database is only created and migrated once.
/// </summary>
public class DatabaseFixture : IAsyncLifetime
{
    private const string TestDatabaseName = "contact_tracker_test_db";
    private NpgsqlConnection? _connection;

    public string ConnectionString { get; } = 
        "Host=postgres;Port=5432;Database=contact_tracker_test_db;Username=postgres;Password=postgres_password;SSL Mode=Disable";

    /// <summary>
    /// Called once before any tests run - creates database and applies migrations
    /// </summary>
    public async Task InitializeAsync()
    {
        // Create a connection to the postgres database to create our test database
        var masterConnection = new NpgsqlConnection(
            "Host=postgres;Port=5432;Database=postgres;Username=postgres;Password=postgres_password;SSL Mode=Disable");
        
        await masterConnection.OpenAsync();
        
        try
        {
            // Check if database exists
            await using (var cmd = new NpgsqlCommand(
                $"SELECT 1 FROM pg_database WHERE datname = '{TestDatabaseName}'", 
                masterConnection))
            {
                var exists = await cmd.ExecuteScalarAsync();
                
                if (exists != null)
                {
                    // Drop existing connections to the test database
                    await using var terminateCmd = new NpgsqlCommand($@"
                        SELECT pg_terminate_backend(pid) 
                        FROM pg_stat_activity 
                        WHERE datname = '{TestDatabaseName}' AND pid <> pg_backend_pid();",
                        masterConnection);
                    await terminateCmd.ExecuteNonQueryAsync();
                    
                    // Drop the database
                    await using var dropCmd = new NpgsqlCommand(
                        $"DROP DATABASE IF EXISTS {TestDatabaseName};", 
                        masterConnection);
                    await dropCmd.ExecuteNonQueryAsync();
                }
            }
            
            // Create the database
            await using (var cmd = new NpgsqlCommand(
                $"CREATE DATABASE {TestDatabaseName};", 
                masterConnection))
            {
                await cmd.ExecuteNonQueryAsync();
            }
        }
        finally
        {
            await masterConnection.CloseAsync();
            await masterConnection.DisposeAsync();
        }

        // Apply migrations to the test database
        var optionsBuilder = new DbContextOptionsBuilder<ContactTrackerDbContext>();
        optionsBuilder.UseNpgsql(ConnectionString);
        
        await using var context = new ContactTrackerDbContext(optionsBuilder.Options);
        await context.Database.MigrateAsync();

        // Keep a connection open for Respawner (we'll use it for cleanup)
        _connection = new NpgsqlConnection(ConnectionString);
        await _connection.OpenAsync();
    }

    /// <summary>
    /// Resets the database to a clean state by truncating all tables except seed data.
    /// </summary>
    public async Task ResetDatabaseAsync()
    {
        var optionsBuilder = new DbContextOptionsBuilder<ContactTrackerDbContext>();
        optionsBuilder.UseNpgsql(ConnectionString);
        
        await using var context = new ContactTrackerDbContext(optionsBuilder.Options);
        
        // Use raw SQL for efficient cleanup
        // TRUNCATE is much faster than DELETE and resets identity columns
        await context.Database.ExecuteSqlRawAsync(@"
            TRUNCATE TABLE ""Events"" CASCADE;
            TRUNCATE TABLE ""Reminders"" CASCADE;
            TRUNCATE TABLE ""Roles"" CASCADE;
            TRUNCATE TABLE ""Contacts"" CASCADE;
            TRUNCATE TABLE ""Companies"" CASCADE;
        ");
        
        // Note: We don't truncate EventTypes because it contains seed data
    }

    /// <summary>
    /// Called once after all tests complete - cleanup
    /// </summary>
    public async Task DisposeAsync()
    {
        if (_connection != null)
        {
            await _connection.CloseAsync();
            await _connection.DisposeAsync();
        }
    }
}