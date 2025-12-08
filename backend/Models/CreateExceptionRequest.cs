namespace PreClear.Api.Models
{
    public class CreateExceptionRequest
    {
        public string Code { get; set; } = null!;
        public string Message { get; set; } = null!;
        public long? CreatedBy { get; set; }
    }
}
