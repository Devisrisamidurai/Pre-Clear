using System.Text.Json;

namespace PreClear.Api.Models
{
    public enum ChangeRequestStatus { pending, approved, rejected, needs_changes }

    public class RuleChangeRequest
    {
        public long Id { get; set; }
        public long? RuleId { get; set; }
        public long? ProposerId { get; set; }
        public JsonDocument? ProposedRuleJson { get; set; }
        public string? Rationale { get; set; }
        public ChangeRequestStatus Status { get; set; } = ChangeRequestStatus.pending;
        public long? ReviewedBy { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
