namespace PreClear.Api.Models
{
    public class AiPrediction
    {
        public string HsCode { get; set; } = string.Empty;
        public double Confidence { get; set; }
        public bool ComplianceRisk { get; set; }
        public string[] Tags { get; set; } = new string[0];
        public string Notes { get; set; } = string.Empty;
    }
}
