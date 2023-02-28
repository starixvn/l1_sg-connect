namespace SGConnect.Api.Operators.OneWorks.Models
{
    public class OWResponse<T> where T: OWResult
    {
        public DateTimeOffset TimeStamp { get; set; }
        public T Result { get; set; }
    }
}
