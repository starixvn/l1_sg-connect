namespace SGConnect.Api.Operators.OneWorks
{
    public class OneWorksSettings
    {
        public string MemberApiUrl { get; set; }
        public string MemberPassWordEncodeKey { get; set; }
        public string ApiUrl { get; set; }
        public string ProxyUrl { get; set; }
        public OneWorksAuth ApiAuth { get; set; }
        public int SportTypeId { get; set; }
        public int VendorId { get; set; }
    }

    public class OneWorksAuth
    {
        public string Login { get; set; }
        public string Password { get; set; }
    }
}