namespace PreClear.Api.Models
{
    public enum ExportReason { Sale, Sample, Gift, Repair, Return, Other }

    public class ShipmentItem
    {
        public long Id { get; set; }
        public long ShipmentId { get; set; }
        public string? ProductName { get; set; }
        public string? Description { get; set; }
        public string? HsCode { get; set; }
        public decimal Quantity { get; set; } = 1;
        public string Unit { get; set; } = "pcs";
        public decimal? UnitPrice { get; set; }
        public decimal? TotalValue { get; set; }
        public string? CountryOfOrigin { get; set; }
        public ExportReason ExportReason { get; set; } = ExportReason.Sale;
    }
}
