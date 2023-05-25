using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace SGConnect.Api.Operators.OneWorks
{
    public class Log
    {
        protected Log(DateTimeOffset requestTime, DateTimeOffset responseTime)
        {
            RequestTimeStamp = requestTime;
            ResponseTimeStamp = responseTime;
        }

        [BsonRepresentation(BsonType.String)]
        public DateTimeOffset LogTimeStamp { get; } = DateTimeOffset.UtcNow;

        [BsonRepresentation(BsonType.String)]
        public DateTimeOffset RequestTimeStamp { get; }

        [BsonRepresentation(BsonType.String)]
        public DateTimeOffset ResponseTimeStamp { get; }
    }
}