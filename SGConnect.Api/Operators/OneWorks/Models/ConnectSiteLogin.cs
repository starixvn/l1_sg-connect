using System.ComponentModel.DataAnnotations;
using FluentValidation;

namespace SGConnect.Api.Operators.OneWorks
{
    public class ConnectSiteLogin
    {
        public string Username { get; set; }

        public string EncryptedPassword { get; set; }

        public string EncodeKey { get; set; }

        public string Language { get; set; }

        public string Ip { get; set; }

        public string BrowserUserAgent { get; set; }
    }

    public class ConnectSiteLoginValidator : AbstractValidator<ConnectSiteLogin>
    {
        public ConnectSiteLoginValidator()
        {
            RuleFor(x => x.Username).NotNull().NotEmpty();
            RuleFor(x => x.EncryptedPassword).NotNull().NotEmpty();
            RuleFor(x => x.Language).NotNull().NotEmpty();
            RuleFor(x => x.EncodeKey).NotNull().NotEmpty();
        }
    }
}