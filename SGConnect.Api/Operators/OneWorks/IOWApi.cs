using Refit;
using SGConnect.Api.Operators.OneWorks.Models;

namespace SGConnect.Api.Operators.OneWorks
{
    public interface IOWApi
    {
        [Post("/api/IntgGames/Login")]
        Task<OWLoginResult> Login([Body] OWLogin body);
    }
}
