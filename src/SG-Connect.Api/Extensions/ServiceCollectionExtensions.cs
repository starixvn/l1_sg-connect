using Refit;
using SGConnect.Api._Shared;

namespace SGConnect.Api.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddRestServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton(RestService.For<IOWApi>(configuration["OWApiUrl"]));
            services.AddSingleton(RestService.For<IMemberApi>(configuration["MemberApiUrl"]));
        }
    }
}