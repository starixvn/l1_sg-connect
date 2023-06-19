using SGConnect.Api._Shared;

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
                }, connectSiteLogin.Ip);

            if (memberLoginResult.ErrorCode == 0)
            {
                var response = await CallOWLogin(InitOWLoginModel(connectSiteLogin, memberLoginResult));
                return response;
            }

            return new()
            {
                ErrorCode = memberLoginResult.ErrorCode,
                ErrorDescription = memberLoginResult.ErrorMsg
            };
        }

        private async Task<OWLoginResult> CallOWLogin(OWLogin request)
        {
            var response = await owApi.Login(request);

            if (response.ErrorCode == 0)
            {
                await logService.WriteOWLoginLog(new(request.TimeStamp, DateTimeOffset.UtcNow)
                {
                    Request = request,
                    Result = response
                });
            }
            else
            {
                await logService.WriteFailedLog(new FailedLog(request.TimeStamp, DateTimeOffset.UtcNow)
                {
                    Call = request,
                    Result = response,
                    OperatorId = OperatorIds.Oneworks,
                    System = AppTypes.MobileApp
                });
            }

            return response;
        }

        private async Task<MemberLoginResult> CallMemberLogin(MemberLogin request, string ip)
        {
            var requestTime = DateTimeOffset.UtcNow;
            var result = await memberApi.Login(request, ip);

            if (result.ErrorCode == 0)
            {
                await logService.WriteMemberLoginLog(new(requestTime, DateTimeOffset.UtcNow)
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

        private OWLogin InitOWLoginModel(ConnectSiteLogin connectSiteLogin, MemberLoginResult memberLoginResult)
        {
            return new()
            {
                ProductInfo = new()
                {
                    VendorId = settings.VendorId,
                    SportTypeId = settings.SportTypeId
                },
                CustInfo = new()
                {
                    ObCustId = memberLoginResult.PublicUserInfo.UserID,
                    ObCustName = memberLoginResult.PublicUserInfo.UserName,
                    CurrencyId = memberLoginResult.PublicUserInfo.UserInfo.ExchangeId,
                    Currency = memberLoginResult.PublicUserInfo.UserInfo.Currency,
                    SiteId = memberLoginResult.PublicUserInfo.SiteID.ToString(),
                    Site = memberLoginResult.PublicUserInfo.AgentSite,
                    Ip = connectSiteLogin.Ip,
                    BrowserUserAgent = connectSiteLogin.BrowserUserAgent,
                    Language = connectSiteLogin.Language
                }
            };
        }
    }
}