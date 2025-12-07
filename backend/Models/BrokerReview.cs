namespace PreClear.Api.Models
{
    public enum ReviewStatus { Pending, Approved, Rejected }

    public class BrokerReview
    {
        public long Id { get; set; }
        public long ShipmentId { get; set; }
        public long? BrokerId { get; set; }
        public ReviewStatus Status { get; set; } = ReviewStatus.Pending;
        public string? Comments { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
