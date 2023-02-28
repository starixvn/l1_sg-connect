using MongoDB.Bson.Serialization.Attributes;
using SGConnect.Api.Operators.OneWorks.Models;

namespace SGConnect.Api.Operators.OneWorks
{
    [BsonDiscriminator("OWSignInResult")]
    public class OWLoginResult : OWResult, IResultLog
    {
        public string RedirectUri { get; set; }
    }
}