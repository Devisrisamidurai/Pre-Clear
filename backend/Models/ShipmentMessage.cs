namespace PreClear.Api.Models
{
    public class ShipmentMessage
    {
        public long Id { get; set; }
        public long ShipmentId { get; set; }
        public long? SenderId { get; set; }
        public string Message { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
