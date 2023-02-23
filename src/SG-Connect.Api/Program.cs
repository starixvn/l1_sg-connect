var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var app = builder.Build();  

// Configure the HTTP request pipeline.

app.MapGet("/api/ow/login", () =>
{
    return Results.Ok();
});

app.Run($"http://0.0.0.0:{builder.Configuration["HostingPort"]}");