using SGConnect.Api.Operators.OneWorks.Models;

namespace SGConnect.Api.Operators.OneWorks
{
    public interface ILogService
    {
        Task WriteMemberLoginLog(MemberLoginLog log);
        Task WriteOWLoginLog(OWLoginLog log);
        Task WriteFailedLog(FailedLog log);
    }
    public class LogService : ILogService
    {
        public Task WriteFailedLog(FailedLog log)
        {
            throw new NotImplementedException();
        }

        public Task WriteMemberLoginLog(MemberLoginLog log)
        {
            throw new NotImplementedException();
        }
    }
}
