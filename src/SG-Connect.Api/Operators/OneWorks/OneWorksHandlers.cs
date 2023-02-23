namespace SGConnect.Api.Operators.OneWorks
{
    public class OneWorksHandlers
    {
        private readonly IOWApi owapi;
        private readonly IMemberApi memberApi;

        public OneWorksHandlers(IOWApi owapi, IMemberApi memberApi) { }

        public async Task<string> HandleLogin(string username, string password)
        {
            var memberLoginRersult = await memberApi.Login(new MemberLogin { UserName = username, Password = password });

            if(memberLoginRersult.ErrorCode == 0)
            {

            }

            return string.Empty;
        }
    }
}
