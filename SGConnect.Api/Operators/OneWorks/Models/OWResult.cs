namespace SGConnect.Api.Operators.OneWorks.Models
{
    public class OWResult : ResultLog
    {
        public int ErrorCode { get; set; }
        public string ErrorDescription { get; set; }
        public string Seq { get; set; }
    }
}