using Microsoft.EntityFrameworkCore;
using tracker_api.Services;
using tracker_api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ContactTrackerDbContext>(
    options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
    );

// Register services
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IContactService, ContactService>();

var app = builder.Build();
app.UseHttpsRedirection();

// Map endpoint groups
app.MapCompanyEndpoints();
app.MapContactEndpoints();

app.Run();

public partial class Program { }