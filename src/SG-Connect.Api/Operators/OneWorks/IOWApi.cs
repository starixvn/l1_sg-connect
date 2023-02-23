using Refit;

namespace SGConnect.Api.Operators.OneWorks
{
    public interface IOWApi
    {
        [Post("/api/SabaClubInternal/Login")]
        Task<string> GetMemberInfo(string username);
    }
}
