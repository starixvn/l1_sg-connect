using MongoDB.Driver;
using SGConnect.Api._Shared;

namespace SGConnect.Api.Operators.OneWorks
{
    public interface ILogService
    {
        Task WriteMemberLoginLog(MemberLoginLog log);
        Task WriteOWLoginLog(OWLoginLog log);
        Task WriteFailedLog(FailedLog log);
    }
    public class LogService : ILogService
    {
        private const string FailedRequestsCollectionName = "failed_requests";
        private const string MemberLoginCollectionName = "membersignin_requests";
        private const string OWLogCollectionName = "owsignin_requests";


        private readonly IMongoCollection<MemberLoginLog> memberLoginLogCollection;
        private readonly IMongoCollection<OWLoginLog> owLoginLogCollection;
        private readonly IMongoCollection<FailedLog> failedLogCollection;

        public  LogService(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(MongoDatabases.Log);

            failedLogCollection = database.GetCollection<FailedLog>(FailedRequestsCollectionName);
            memberLoginLogCollection = database.GetCollection<MemberLoginLog>(MemberLoginCollectionName);
            owLoginLogCollection = database.GetCollection<OWLoginLog>(OWLogCollectionName);
        }

        public Task WriteFailedLog(FailedLog log)
            => failedLogCollection.InsertOneAsync(log);

        public Task WriteMemberLoginLog(MemberLoginLog log)
            => memberLoginLogCollection.InsertOneAsync(log);

        public Task WriteOWLoginLog(OWLoginLog log)
            => owLoginLogCollection.InsertOneAsync(log);

    }
}
