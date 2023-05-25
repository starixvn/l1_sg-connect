using SGConnect.Api.Operators.OneWorks.Models;

namespace SGConnect.Api.Operators.OneWorks
{
    public class FailedLog : Log
    {
        public FailedLog(DateTimeOffset requestTime, DateTimeOffset responseTime) : base(requestTime, responseTime)
        {
        }

        public string OperatorId { get; set; }
        public RequestLog Call { get; set; }
        public ResultLog Result { get; set; }
        public byte System { get; set; }
    }

    public class RequestLog
    {
    }

    public class ResultLog
    {
    }
}