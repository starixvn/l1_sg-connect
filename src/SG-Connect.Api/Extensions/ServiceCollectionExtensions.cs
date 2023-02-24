using FluentValidation;
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

            services.AddValidators();
            services.AddHandlers();
            services.AddRestServices(operatorSettings);
        }

        public static void AddRestServices(this IServiceCollection services, OperatorSettings operatorSettings)
        {
            services.AddScoped((serviceProvider) => RestService.For<IOWApi>(operatorSettings.OneWorks.ApiUrl));
            services.AddScoped((serviceProvider) => RestService.For<IMemberApi>(operatorSettings.OneWorks.MemberApiUrl));
        }

        public static void AddValidators(this IServiceCollection services)
        {
            services.AddScoped<IValidator<ConnectSiteLogin>, ConnectSiteLoginValidator>();
        }

        public static void AddHandlers(this IServiceCollection services)
        {
            services.AddScoped<IOneWorksHandlers, OneWorksHandlers>();
        }
    }
}