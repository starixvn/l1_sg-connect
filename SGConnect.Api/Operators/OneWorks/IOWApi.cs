using Refit;
using SGConnect.Api.Operators.OneWorks.Models;

namespace SGConnect.Api.Operators.OneWorks
{
    public interface IOWApi
    {
        [Post("/api/SabaClubInternal/Login")]
        Task<OWResponse<OWLoginResult>> Login([Body] OWLogin login);
    }
}
