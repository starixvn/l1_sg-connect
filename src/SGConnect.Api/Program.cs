using Microsoft.AspNetCore.Mvc;
using SGConnect.Api.Extensions;
using SGConnect.Api.Filters;
using SGConnect.Api.Operators.OneWorks;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddServices(builder.Configuration);
builder.WebHost.UseSentry(opt => opt.Environment = builder.Configuration["Env"]);

var app = builder.Build();
app.UseSentryTracing();

app.MapGet("/healthcheck", () => Results.Ok("SG Connect Api is running!"));

app.MapPost("/api/ow/login", async ([FromBody] ConnectSiteLogin model, HttpContext context, [FromHeader(Name = "user-agent")] string userAgent, [FromServices] IOneWorksHandlers handlers) =>
{
    model.Ip = context.Connection.RemoteIpAddress.ToString();
    model.BrowserUserAgent = userAgent;

    return Results.Ok(await handlers.HandleLogin(model));
}).AddEndpointFilter<ValidationFilter<ConnectSiteLogin>>();

app.Run($"http://0.0.0.0:{builder.Configuration["HostingPort"]}");