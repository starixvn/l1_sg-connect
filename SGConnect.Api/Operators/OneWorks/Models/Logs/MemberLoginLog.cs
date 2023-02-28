namespace SGConnect.Api.Operators.OneWorks
{
    public class MemberLoginLog : Log
    {
        public MemberLoginLog(DateTimeOffset requestTime, DateTimeOffset responseTime) : base(requestTime, responseTime)
        {
        }

        public MemberLogin Request { get; set; }

        public MemberLoginResult Result { get; set; }
    }
}