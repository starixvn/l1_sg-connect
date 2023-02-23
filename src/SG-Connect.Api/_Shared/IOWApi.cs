using Refit;

namespace SGConnect.Api._Shared
{
    public interface IOWApi
    {
        [Post("/api/SabaClubInternal/Login")]
        Task<string> GetMemberInfo(string username);
    }
}
