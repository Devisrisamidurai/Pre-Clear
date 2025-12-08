namespace PreClear.Api.Models
{
    public enum RequestStatus { Open, Fulfilled, Cancelled }

    public class BrokerRequest
    {
        public long Id { get; set; }
        public long ShipmentId { get; set; }
        public string RequestedDocument { get; set; } = null!;
        public string? Message { get; set; }
        public RequestStatus Status { get; set; } = RequestStatus.Open;
        public DateTime CreatedAt { get; set; }
        public DateTime? FulfilledAt { get; set; }
    }
}
