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
        private readonly ILogService logService;
        private readonly OneWorksSettings settings;

        public OneWorksHandlers(IOWApi owApi, IMemberApi memberApi, ILogService logService, OperatorSettings operatorSettings)
        {
            this.owApi = owApi;
            this.memberApi = memberApi;
            settings = operatorSettings.OneWorks;
            this.logService = logService;
        }        

        public async Task<OWLoginResult> HandleLogin(ConnectSiteLogin connectSiteLogin)
        {
            var memberLoginResult = await CallMemberLogin(
                new MemberLogin
                {
                    Username = connectSiteLogin.Username,
                    Password = CryptoService.Decrypt(connectSiteLogin.EncryptedPassword),
                    PasswordEncodeKey = connectSiteLogin.EncodeKey
                });

            if (memberLoginResult.ErrorCode == 0)
            {
                var response = await CallOWLogin(InitOWLoginModel(connectSiteLogin, memberLoginResult));
                return AppendAppType(response.Result);
            }

            return new()
            {
                ErrorCode = memberLoginResult.ErrorCode,
                ErrorDescription = memberLoginResult.ErrorMsg
            };
        }

        private async Task<OWResponse<OWLoginResult>> CallOWLogin(OWLogin request)
        {
            var response = await owApi.Login(request);

            if (response.Result.ErrorCode == 0)
            {
                await logService.WriteOWLoginLog(new (request.TimeStamp, DateTimeOffset.UtcNow)
                {
                    Request = request,
                    Result = response.Result
                });
            } else
            {
                await logService.WriteFailedLog(new FailedLog(request.TimeStamp, response.TimeStamp)
                {
                    Call = request.Call,
                    Result = response.Result,
                    OperatorId = OperatorIds.Oneworks,
                    System = AppTypes.MobileApp
                });
            }

            return response;
        }

        private async Task<MemberLoginResult> CallMemberLogin(MemberLogin request)
        {
            var requestTime = DateTimeOffset.UtcNow;
            var result = await memberApi.Login(request);

            if (result.ErrorCode == 0)
            {
                await logService.WriteMemberLoginLog(new (requestTime, DateTimeOffset.UtcNow)
                {
                    Request = request,
                    Result = result
                });
            }
            else
            {
                await logService.WriteFailedLog(new FailedLog(requestTime, DateTimeOffset.UtcNow)
                {
                    Call = request,
                    Result = result,
                    OperatorId = OperatorIds.Oneworks,
                    System = AppTypes.MobileApp
                });
            }

            return result;
        }

        private OWLoginResult AppendAppType(OWLoginResult owLoginResult)
        {
            if (!string.IsNullOrWhiteSpace(owLoginResult.RedirectUri))
            {
                owLoginResult.RedirectUri = $"{owLoginResult.RedirectUri}&appType={AppTypes.MobileApp}&ref=m_connect";
            }

            return owLoginResult;
        }

        private OWLogin InitOWLoginModel(ConnectSiteLogin connectSiteLogin, MemberLoginResult memberLoginResult)
        {
            return new(settings.ApiAuth.Login, settings.ApiAuth.Password)
            {
                Call = new()
                {
                    ObCustId = memberLoginResult.PublicUserInfo.UserID,
                    ObCustName = memberLoginResult.PublicUserInfo.UserName,
                    Currency = memberLoginResult.PublicUserInfo.UserInfo.Currency,
                    SiteId = memberLoginResult.PublicUserInfo.SiteID.ToString(),
                    SiteName = memberLoginResult.PublicUserInfo.AgentSite,
                    IP = connectSiteLogin.Ip,
                    BrowserUserAgent = connectSiteLogin.BrowserUserAgent,
                    Language = connectSiteLogin.Language
                }
            };
        }
    }
}