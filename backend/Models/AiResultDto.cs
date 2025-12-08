namespace PreClear.Api.Models
{
    public class AiResultDto
    {
        public string HsCode { get; set; } = string.Empty;
        public double Confidence { get; set; }
        public bool ComplianceRisk { get; set; }
        public string[] Restrictions { get; set; } = new string[0];
        public string[] Suggestions { get; set; } = new string[0];
        public string Notes { get; set; } = string.Empty;
    }
}
