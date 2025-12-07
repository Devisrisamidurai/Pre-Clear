using System.Text.Json;

namespace PreClear.Api.Models
{
    public enum RiskLevel { Low, Medium, High }
    public enum AiStatus { Cleared, NeedsDocuments, Blocked }

    public class ShipmentCompliance
    {
        public long ShipmentId { get; set; }
        public bool DangerousGoods { get; set; }
        public bool LithiumBattery { get; set; }
        public bool FoodPharmaFlag { get; set; }
        public string? Eccn { get; set; }
        public bool ExportLicenseRequired { get; set; }
        public bool RestrictedFlag { get; set; }
        public bool SanctionedCountryFlag { get; set; }
        public RiskLevel RiskLevel { get; set; } = RiskLevel.Low;
        public int? AiScore { get; set; }
        public AiStatus AiStatus { get; set; } = AiStatus.NeedsDocuments;
        public JsonDocument? AiNotes { get; set; }
    }
}
