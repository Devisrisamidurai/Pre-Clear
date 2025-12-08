namespace PreClear.Api.Models
{
    public enum PartyType { shipper, consignee, third_party }

    public class ShipmentParty
    {
        public long Id { get; set; }
        public long ShipmentId { get; set; }
        public PartyType PartyType { get; set; }
        public string CompanyName { get; set; } = null!;
        public string? ContactName { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? PostalCode { get; set; }
        public string? Country { get; set; }
        public string? TaxId { get; set; }
    }
}
