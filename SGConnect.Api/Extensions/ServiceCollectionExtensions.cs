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
            services.AddScoped((_) =>
            {
                if (string.IsNullOrWhiteSpace(operatorSettings.OneWorks.ProxyUrl))
                {
                    return RestService.For<IOWApi>(operatorSettings.OneWorks.ApiUrl);
                }
                var httpHandler = new HttpClientHandler
                {
                    UseProxy = true,
                    Proxy = new WebProxy(operatorSettings.OneWorks.ProxyUrl)
                };

                var httpClient = new HttpClient(httpHandler, true)
                {
                    BaseAddress = new Uri(operatorSettings.OneWorks.ApiUrl),
                    
                };

                return RestService.For<IOWApi>(httpClient);
            });
            services.AddScoped((_) => RestService.For<IMemberApi>(operatorSettings.OneWorks.MemberApiUrl));
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
    }
}