namespace SGConnect.Api.Operators.OneWorks
{
    public class OWLogin
    {
        public OWLogin(string login, string password)
        {
            Auth = new()
            {
                Login = login,
                Password = password
            };
        }

        public DateTimeOffset TimeStamp { get; set; } = DateTimeOffset.Now;
        public OWAuth Auth { get; set; }
        public OWLoginCall Call { get; set; }
    }

    public class OWAuth
    {
        public string Login { get; set; }
        public string Password { get; set; }
    }

    public class OWLoginCall
    {
        public int ObCustId { get; set; }
        public string ObCustName { get; set; }
        public int GameId { get; set; }
        public string Currency { get; set; }
        public string IP { get; set; }
        public string BrowserUserAgent { get; set; }
        public string BetFrom { get; set; } = "{";
        public string Language { get; set; }
        public string SiteId { get; set; }
        public string SiteName { get; set; }
        public string Seq { get; set; } = Guid.NewGuid().ToString();
    }
}