using SGConnect.Api._Shared;

namespace SGConnect.Api.Operators.OneWorks
{
    public class MemberLogin
    {
        public string VendorID { get; set; } = VendorId.Saba;

        public string SiteID { get; set; } = "4100306";

        public string UserName { get; set; }

        public string Password { get; set; }

        public string PasswordEncodeKey { get; set; }

        public string Seq { get; set; } = Guid.NewGuid().ToString();

        public string Platform { get; set; } = "A";
    }
}