using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SGConnect.Api.Operators.OneWorks
{
    [BsonDiscriminator("OWSignInCall")]
    public class OWLogin : RequestLog
    {
        [BsonRepresentation(BsonType.String)]
        public DateTimeOffset TimeStamp { get; set; } = DateTimeOffset.UtcNow;

        public string Seq { get; set; } = Guid.NewGuid().ToString();
        public ProductInfo ProductInfo { get; set; }
        public CustInfo CustInfo { get; set; }
        public bool EnableSingleWallet { get; set; }
    }

    public class ProductInfo
    {
        public int SportTypeId { get; set; }
        public int VendorId { get; set; }
        public string AppType { get; set; } = "A";
    }

    public class CustInfo
    {
        public int ObCustId { get; set; }
        public string ObCustName { get; set; }
        public int CurrencyId { get; set; }
        public string Currency { get; set; }
        public string Ip { get; set; }
        public string BrowserUserAgent { get; set; }
        public string BetFrom { get; set; } = "{";
        public string Platform { get; set; } = "A";
        public string Language { get; set; }
        public string SiteId { get; set; }
        public string Site { get; set; }
    }
}