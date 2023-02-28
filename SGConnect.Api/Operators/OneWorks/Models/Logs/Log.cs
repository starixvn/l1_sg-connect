namespace SGConnect.Api.Operators.OneWorks
{
    public abstract class Log
    {
        public Log(DateTimeOffset requestTime, DateTimeOffset responseTime)
        {
            RequestTimeStamp = requestTime;
            ResponseTimeStamp = responseTime;
        }

        public DateTimeOffset LogTimeStamp { get; } = DateTimeOffset.UtcNow;

        public DateTimeOffset RequestTimeStamp { get; }

        public DateTimeOffset ResponseTimeStamp { get; }
    }
}