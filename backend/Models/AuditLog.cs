using System.Text.Json;

namespace PreClear.Api.Models
{
    public class AuditLog
    {
        public long Id { get; set; }
        public long? UserId { get; set; }
        public string Entity { get; set; } = null!;
        public long? EntityId { get; set; }
        public string Action { get; set; } = null!;
        public JsonDocument? Details { get; set; }
        public DateTime PerformedAt { get; set; }
    }
}
