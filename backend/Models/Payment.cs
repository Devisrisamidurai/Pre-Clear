namespace PreClear.Api.Models
{
    public enum Payer { Shipper, Consignee, ThirdParty }
    public enum PaymentStatus { pending, paid, failed, refunded }

    public class Payment
    {
        public long Id { get; set; }
        public long ShipmentId { get; set; }
        public Payer Payer { get; set; } = Payer.Shipper;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.pending;
        public string? PaymentMethod { get; set; }
        public DateTime? PaidAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
