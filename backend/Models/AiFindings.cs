using System.Text.Json;

namespace PreClear.Api.Models
{
    public enum Severity { info, warning, error }

    public class AiFinding
    {
        public long Id { get; set; }
        public long ShipmentId { get; set; }
        public string? RuleCode { get; set; }
        public Severity Severity { get; set; } = Severity.warning;
        public string Message { get; set; } = null!;
        public string? SuggestedAction { get; set; }
        public JsonDocument? Details { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
