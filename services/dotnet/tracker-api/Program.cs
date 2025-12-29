using Microsoft.EntityFrameworkCore;
using tracker_api.Services;
using tracker_api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ContactTrackerDbContext>(
    options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
    );

builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    // This prevents the "Object cycle detected" error
    options.SerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    // Makes enums show up as "LinkedIn" instead of "1" in the JSON
    // options.SerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
});

// Register services
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IEventTypeService, EventTypeService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IContactService, ContactService>();
builder.Services.AddScoped<IRoleService, RoleService>();

var app = builder.Build();
app.UseHttpsRedirection();

// Map endpoint groups
app.MapEventEndpoints();
app.MapEventTypeEndpoints();
app.MapCompanyEndpoints();
app.MapContactEndpoints();
app.MapRoleEndpoints();

app.Run();

public partial class Program { }