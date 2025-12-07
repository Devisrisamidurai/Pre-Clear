using Microsoft.EntityFrameworkCore;
using PreClear.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Connection
var conn = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(conn))
    throw new InvalidOperationException("Please set DefaultConnection in appsettings.json");

// EF Core 8 + Pomelo (MySQL)
builder.Services.AddDbContext<PreclearDbContext>(options =>
    options.UseMySql(conn, ServerVersion.AutoDetect(conn),
        mySqlOptions => mySqlOptions.EnableRetryOnFailure()
    )
);

// CORS (dev)
builder.Services.AddCors(p => p.AddDefaultPolicy(q => q.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

// Apply migrations automatically in Development only
using (var scope = app.Services.CreateScope())
{
    var env = scope.ServiceProvider.GetRequiredService<IHostEnvironment>();
    if (env.IsDevelopment())
    {
        var db = scope.ServiceProvider.GetRequiredService<PreclearDbContext>();
        db.Database.Migrate();
        PreClear.Api.Services.DbSeeder.Seed(db);

    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.MapControllers();
app.Run();
