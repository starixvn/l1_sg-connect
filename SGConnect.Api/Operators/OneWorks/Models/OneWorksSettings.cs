namespace SGConnect.Api.Operators.OneWorks
{
    public class OneWorksSettings
    {
        public string MemberApiUrl { get; set; }
        public string MemberPassWordEncodeKey { get; set; }
        public string ApiUrl { get; set; }
        public OneWorksAuth ApiAuth { get; set; }
    }

    public class OneWorksAuth
    {
        public string Login { get; set; }
        public string Password { get; set; }
    }
}