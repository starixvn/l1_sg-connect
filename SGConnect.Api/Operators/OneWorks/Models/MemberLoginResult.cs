using MongoDB.Bson.Serialization.Attributes;
using SGConnect.Api.Operators.OneWorks.Models;

namespace SGConnect.Api.Operators.OneWorks
{
    [BsonDiscriminator("MemberSignInResult")]
    public class MemberLoginResult : OWResult
    {
        //public int ErrorCode { get; set; }
        public string ErrorMsg { get; set; }

        public PublicUserInfo PublicUserInfo { get; set; }
    }

    public class PublicUserInfo
    {
        public int UserID { get; set; }
        public string UserName { get; set; }
        public string SiteID { get; set; }
        public string SiteName { get; set; }
        public UserInfo UserInfo { get; set; }
    }

    public class UserInfo
    {
        public string Currency { get; set; }
    }
}