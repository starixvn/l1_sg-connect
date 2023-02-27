using SGConnect.Api._Shared;
using SGConnect.Api.Operators.OneWorks.Models;

namespace SGConnect.Api.Operators.OneWorks
{
    public interface IOneWorksHandlers
    {
        Task<OWLoginResult> HandleLogin(ConnectSiteLogin connectSiteLogin);
    }

    public class OneWorksHandlers : IOneWorksHandlers
    {
        private readonly IOWApi owApi;
        private readonly IMemberApi memberApi;
        private readonly OneWorksSettings settings;

        public OneWorksHandlers(IOWApi owApi, IMemberApi memberApi, OperatorSettings operatorSettings)
        {
            this.owApi = owApi;
            this.memberApi = memberApi;
            this.settings = operatorSettings.OneWorks;
        }

        public async Task<OWLoginResult> HandleLogin(ConnectSiteLogin connectSiteLogin)
        {
            var memberLoginRersult = await memberApi.Login(
                new MemberLogin
                {
                    UserName = connectSiteLogin.Username,
                    Password = connectSiteLogin.Password,
                    PasswordEncodeKey = connectSiteLogin.EncodedKey
                });

            if (memberLoginRersult.ErrorCode == 0)
            {
                return AppendAppType(await owApi.Login(InitOWLoginModel(connectSiteLogin, memberLoginRersult)));
            }

            return new()
            {
                ErrorCode = memberLoginRersult.ErrorCode
            };
        }

        private OWLoginResult AppendAppType(OWLoginResult owLoginResult)
        {
            if (!string.IsNullOrWhiteSpace(owLoginResult.RedirectUrl))
            {
                owLoginResult.RedirectUrl = $"{owLoginResult.RedirectUrl}&appType={AppTypes.MobileApp}";
            }

            return owLoginResult;
        }

        private OWLogin InitOWLoginModel(ConnectSiteLogin connectSiteLogin, MemberLoginResult memberLoginRersult)
        {
            return new(settings.ApiAuth.Login, settings.ApiAuth.Password)
            {
                Call = new()
                {
                    ObCustId = memberLoginRersult.PublicUserInfo.UserID,
                    ObCustName = memberLoginRersult.PublicUserInfo.UserName,
                    Currency = memberLoginRersult.PublicUserInfo.UserInfo.Currency,
                    SiteId = memberLoginRersult.PublicUserInfo.SiteID,
                    SiteName = memberLoginRersult.PublicUserInfo.SiteName,
                    IP = connectSiteLogin.Ip,
                    BrowserUserAgent = connectSiteLogin.BrowserUserAgent,
                    Language = connectSiteLogin.Language
                }
            };
        }
    }
}