namespace PreClear.Api.Models
{
    public enum ServiceLevel { Standard, Express, Economy, Freight }
    public enum BillTo { Shipper, Consignee, ThirdParty }

    public class ShipmentService
    {
        public long ShipmentId { get; set; }
        public ServiceLevel ServiceLevel { get; set; } = ServiceLevel.Standard;
        public string? Incoterm { get; set; }
        public BillTo BillTo { get; set; } = BillTo.Shipper;
        public string Currency { get; set; } = "USD";
        public decimal? DeclaredValue { get; set; }
        public bool InsuranceRequired { get; set; }
    }
}
