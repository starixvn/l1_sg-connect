using Refit;

namespace SGConnect.Api.Operators.OneWorks
{
    public interface IMemberApi
    {
        [Post("/v1.2/auth/login")]
        public Task<MemberLoginResult> Login([Body] MemberLogin body, [Header("X-Forwarded-For")] string ip);
    }
}