namespace tracker_api.Tests;

/// <summary>
/// Defines a test collection that shares the DatabaseFixture across all test classes.
/// This ensures the database is only created once for all tests.
/// </summary>
[CollectionDefinition("Database collection")]
public class DatabaseCollection : ICollectionFixture<DatabaseFixture>
{
    // This class has no code, and is never created. Its purpose is simply
    // to be the place to apply [CollectionDefinition] and all the
    // ICollectionFixture<> interfaces.
}