using Refit;
using SGConnect.Api.Operators.OneWorks.Models;

namespace SGConnect.Api.Operators.OneWorks
{
    public interface IMemberApi
    {
        [Post("/v1.2/auth/login")]
        public Task<MemberLoginResult> Login([Body] MemberLogin body);
    }
}