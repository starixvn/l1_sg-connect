using System.Net;
using FluentValidation;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using Refit;
using SGConnect.Api._Shared;
using SGConnect.Api.Operators.OneWorks;

namespace SGConnect.Api.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddServices(this IServiceCollection services, IConfiguration configuration)
        {
            var operatorSettings = configuration.GetSection("OperatorSettings").Get<OperatorSettings>();
            services.AddSingleton(operatorSettings);

            services.AddMongoDB(configuration);
            services.AddValidators();
            services.AddHandlers();
            services.AddRestServices(operatorSettings);
            services.AddLogServices();
        }

        public static void AddMongoDB(this IServiceCollection services, IConfiguration configuration)
        {
            var camelIgnoringExtraElementConventions = new ConventionPack
            {
                new CamelCaseElementNameConvention(),
                new IgnoreExtraElementsConvention(true)
            };

            ConventionRegistry.Register(nameof(camelIgnoringExtraElementConventions), camelIgnoringExtraElementConventions, t => true);
            services.AddSingleton<IMongoClient>(new MongoClient(configuration["MongoDBSettings:ConnectionString"]));
        }

        public static void AddRestServices(this IServiceCollection services, OperatorSettings operatorSettings)
        {

            HttpClient owApiClient = InitHttpClient(operatorSettings.OneWorks.ApiUrl, operatorSettings.Proxy);
            HttpClient memberApiClient = InitHttpClient(operatorSettings.OneWorks.MemberApiUrl, operatorSettings.Proxy);


            services.AddScoped((_) => RestService.For<IOWApi>(owApiClient));
            services.AddScoped((_) => RestService.For<IMemberApi>(memberApiClient));
        }

        public static void AddValidators(this IServiceCollection services)
        {
            services.AddScoped<IValidator<ConnectSiteLogin>, ConnectSiteLoginValidator>();
        }

        public static void AddHandlers(this IServiceCollection services)
        {
            services.AddScoped<IOneWorksHandlers, OneWorksHandlers>();
        }

        public static void AddLogServices(this IServiceCollection services)
        {
            services.AddScoped<ILogService, LogService>();
        }

        private static HttpClient InitHttpClient(string url, string proxy)
        {
            HttpClientHandler handler = null;

            if (!string.IsNullOrEmpty(proxy))
            {
                handler = new HttpClientHandler
                {
                    Proxy = new WebProxy(proxy),
                    UseProxy = true,
                };
            }

            var client = (handler == null) ? new HttpClient() : new HttpClient(handler);
            client.BaseAddress = new Uri(url);

            return client;
        }
    }
}