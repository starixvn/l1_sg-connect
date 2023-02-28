namespace SGConnect.Api.Operators.OneWorks
{
    public class FailedLog : Log
    {
        public FailedLog(DateTimeOffset requestTime, DateTimeOffset responseTime) : base(requestTime, responseTime)
        {
        }

        public string OperatorId { get; set; }
        public IRequestLog Call { get; set; }
        public IResultLog Result { get; set; }
        public byte System { get; set; }
    }

    public interface IRequestLog
    {
    }

    public interface IResultLog
    {
    }
}