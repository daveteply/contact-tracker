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

        // Use and example DTO to help find others
        var targetDtoAssembly = typeof(CompanyCreateDto).Assembly;
        IEnumerable<Type> dtoTypes;
        try
        {
            dtoTypes = targetDtoAssembly.GetTypes()
                .Where(t =>
                    t.IsClass &&
                    !t.IsAbstract &&
                    !t.ContainsGenericParameters &&
                    t.Name.EndsWith("Dto"));;
        }
        catch (ReflectionTypeLoadException ex)
        {
            // Filter out the null types and take what was successfully loaded
            dtoTypes = ex.Types.Where(t => t != null)!;
            Console.WriteLine("Warning: Some types could not be loaded due to dependency issues. Proceeding with available types.");
        }

        var filteredDtoTypes = dtoTypes
            .Where(t => t.GetCustomAttributes(typeof(ExportTsInterfaceAttribute), true).Length != 0)
            .ToList();
            
        Console.WriteLine($"Found {filteredDtoTypes.Count} DTOs to process...");

        // Generate schemas for each DTO type
        foreach (var type in filteredDtoTypes)
        {
            GenerateSchema(type, config, outputDir);
        }

        // Readme
        var readmeFile = Path.Combine(outputDir, "README.md");
        File.WriteAllText(readmeFile, @"
# JSON Schemas

The files in this folder are auto-generated using JSON schema exporter.

Any changes made to these files can be lost when this file is regenerated.
");

        Console.WriteLine($"✓ JSON Schemas generated successfully!");
    }

    static void GenerateSchema(Type type, SchemaGeneratorConfiguration config, string outputDir)
    {
        // Use the non-generic FromType method
        var schema = new JsonSchemaBuilder().FromType(type, config).Build();
        
        var schemaJson = JsonSerializer.Serialize(schema, new JsonSerializerOptions 
        { 
            WriteIndented = true 
        });

        var fileName = ToKebabCase(type.Name) + ".json";
        var filePath = Path.Combine(outputDir, fileName);

        // // add file comments
        // schemaJson = @"
        // /**
        // * This is a JSON schema exporter auto-generated file.
        // * Any changes made to this file can be lost when this file is regenerated.
        // */

        // " + schemaJson;
        
        File.WriteAllText(filePath, schemaJson);
        Console.WriteLine($"  Generated: {fileName}");
    }

    static string ToKebabCase(string input)
    {
        return string.Concat(input.Select((x, i) => i > 0 && char.IsUpper(x) ? "-" + x : x.ToString()))
            .ToLower();
    }
}