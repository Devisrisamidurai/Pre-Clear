using System.Text.Json;

namespace PreClear.Api.Models
{
    public class ShipmentTracking
    {
        public long Id { get; set; }
        public long ShipmentId { get; set; }
        public string? Status { get; set; }
        public string? Location { get; set; }
        public DateTime? EventTime { get; set; }
        public JsonDocument? Details { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
