namespace SGConnect.Api.Operators.OneWorks
{
    public class OWLoginLog : Log
    {
        public OWLoginLog(DateTimeOffset requestTime, DateTimeOffset responseTime) : base(requestTime, responseTime)
        {
        }

        public OWLogin Request { get; set; }

        public OWLoginResult Result { get; set; }
    }
}