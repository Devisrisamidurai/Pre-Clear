using System.Text.Json;

namespace PreClear.Api.Models
{
    public enum ApprovalAction { approve, reject, request_changes, escalate }
    public class ApprovalLog
    {
        public long Id { get; set; }
        public string Entity { get; set; } = null!;
        public long? EntityId { get; set; }
        public long? ApproverId { get; set; }
        public string? ApproverRole { get; set; }
        public ApprovalAction Action { get; set; }
        public string? PreviousState { get; set; }
        public string? NewState { get; set; }
        public string? Comments { get; set; }
        public JsonDocument? Metadata { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
