using MongoDB.Bson.Serialization.Attributes;
using SGConnect.Api.Operators.OneWorks.Models;

namespace SGConnect.Api.Operators.OneWorks
{
    [BsonDiscriminator("OWSignInResult")]
    public class OWLoginResult : OWResult
    {
        public int VendorId { get; set; }
        public string ErrorMsg { get; set; }
        public string Token { get; set; }
        public string ExtendApi { get; set; }
        public string ExpireApi { get; set; }
        public string LogoutApi { get; set; }
        public bool ReturnUrl { get; set; }
        public bool ExtendUrl { get; set; }
        public bool IsShowBack { get; set; }
        public bool IsCanExtend { get; set; }
        public string GameUrl { get; set; }
    }
}