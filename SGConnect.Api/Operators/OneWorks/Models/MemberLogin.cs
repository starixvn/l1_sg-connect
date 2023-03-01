using MongoDB.Bson.Serialization.Attributes;
using SGConnect.Api._Shared;

namespace SGConnect.Api.Operators.OneWorks
{
    [BsonDiscriminator("MemberSignInCall")]
    public class MemberLogin : RequestLog
    {
        public string VendorId { get; set; } = Vendors.Saba;

        public string SiteId { get; set; } = "4100306";

        public string Username { get; set; }

        public string Password { get; set; }

        public string PasswordEncodeKey { get; set; }

        public string Seq { get; set; } = Guid.NewGuid().ToString();

        public string Platform { get; set; } = "A";
    }
}