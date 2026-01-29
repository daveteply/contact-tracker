using System.Reflection;
using System.Text.Json;
using Json.Schema;
using Json.Schema.Generation;
using Json.Schema.Generation.DataAnnotations;
using TypeGen.Core.TypeAnnotations;

using ContactTracker.Libs.Shared.DTOs;

namespace ContactTracker.SchemaGenerator;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Starting JSON Schema generation...");

        // Configure the schema generator to respect DataAnnotations
        var config = new SchemaGeneratorConfiguration
        {
            PropertyNameResolver = PropertyNameResolvers.CamelCase
        };
        
        // Add data annotations support - THIS IS THE KEY!
        DataAnnotationsSupport.AddDataAnnotations();

        // Get the workspace root
        var workspaceRoot = Directory.GetCurrentDirectory();
        while (workspaceRoot != null && !File.Exists(Path.Combine(workspaceRoot, "nx.json")))
        {
            workspaceRoot = Directory.GetParent(workspaceRoot)?.FullName;
        }

        if (workspaceRoot == null)
        {
            throw new Exception("Could not find workspace root (looking for nx.json)");
        }

        var outputDir = Path.Combine(workspaceRoot, "packages", "validation", "src", "lib", "schemas");
        
        Console.WriteLine($"Workspace root: {workspaceRoot}");
        Console.WriteLine($"Output directory: {outputDir}");
        
        Directory.CreateDirectory(outputDir);

        // Use an example DTO to help find others
        var targetDtoAssembly = typeof(CompanyCreateDto).Assembly;
        IEnumerable<Type> dtoTypes;
        try
        {
            dtoTypes = targetDtoAssembly.GetTypes()
                .Where(t =>
                    t.IsClass &&
                    !t.IsAbstract &&
                    !t.ContainsGenericParameters &&
                    t.Name.EndsWith("Dto"));
        }
        catch (ReflectionTypeLoadException ex)
        {
            // Filter out the null types and take what was successfully loaded
            dtoTypes = ex.Types.Where(t => t != null)!;
            Console.WriteLine("Warning: Some types could not be loaded due to dependency issues. Proceeding with available types.");
        }

        var filteredDtoTypes = dtoTypes
            .Where(t => t.GetCustomAttributes(typeof(ExportTsInterfaceAttribute), true).Length != 0)
            .Where(t => !t.Name.Contains("Read"))            
            .ToList();
            
        Console.WriteLine($"Found {filteredDtoTypes.Count} DTOs to process (excluding Read DTOs)...");

        // Generate schemas for each DTO type
        foreach (var type in filteredDtoTypes)
        {
            GenerateSchema(type, config, outputDir);
        }
    }

    static void GenerateSchema(Type type, SchemaGeneratorConfiguration config, string outputDir)
    {
        // Generate the base schema
        var schema = new JsonSchemaBuilder().FromType(type, config).Build();
        
        // Convert to JsonDocument for manipulation
        var schemaJson = JsonSerializer.Serialize(schema, new JsonSerializerOptions 
        { 
            WriteIndented = true 
        });

        var jsonDoc = JsonDocument.Parse(schemaJson);
        
        // Find required properties (those without nullable type and with [Required] attribute)
        var requiredProperties = new List<string>();
        
        foreach (var prop in type.GetProperties())
        {
            var propertyName = char.ToLowerInvariant(prop.Name[0]) + prop.Name.Substring(1);
            
            // Check if property has [Required] attribute
            var hasRequiredAttribute = prop.GetCustomAttributes(typeof(System.ComponentModel.DataAnnotations.RequiredAttribute), true).Any();
            
            // Check if property type is non-nullable value type or non-nullable reference type
            var isNonNullable = prop.PropertyType.IsValueType && Nullable.GetUnderlyingType(prop.PropertyType) == null;
            
            // If it has [Required] attribute OR is a non-nullable value type, it's required
            if (hasRequiredAttribute || isNonNullable)
            {
                requiredProperties.Add(propertyName);
            }
        }
        
        // Build the final schema with required array
        var finalSchema = new Dictionary<string, object>
        {
            ["type"] = "object",
            ["properties"] = jsonDoc.RootElement.GetProperty("properties").Clone()
        };
        
        // Add required array if there are any required properties
        if (requiredProperties.Count > 0)
        {
            finalSchema["required"] = requiredProperties;
        }
        
        // Serialize the final schema
        var finalSchemaJson = JsonSerializer.Serialize(finalSchema, new JsonSerializerOptions 
        { 
            WriteIndented = true 
        });
        
        var fileName = ToKebabCase(type.Name) + ".json";
        var filePath = Path.Combine(outputDir, fileName);

        File.WriteAllText(filePath, finalSchemaJson);
        
        Console.WriteLine($"  Generated: {fileName} with {requiredProperties.Count} required fields");
    }

    static string ToKebabCase(string input)
    {
        return string.Concat(input.Select((x, i) => i > 0 && char.IsUpper(x) ? "-" + x : x.ToString()))
            .ToLower();
    }
}