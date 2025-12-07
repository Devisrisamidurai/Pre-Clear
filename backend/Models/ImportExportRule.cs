using System.Text.Json;

namespace PreClear.Api.Models
{
    public class ImportExportRule
    {
        public long Id { get; set; }
        public string? CountryCode { get; set; }
        public string? HsCode { get; set; }
        public string RuleKey { get; set; } = null!;
        public string? Title { get; set; }
        public string? Description { get; set; }
        public JsonDocument? RuleJson { get; set; }
        public string? Source { get; set; }
        public int Version { get; set; } = 1;
        public bool Active { get; set; } = true;
        public DateTime? EffectiveFrom { get; set; }
        public DateTime? EffectiveTo { get; set; }
        public long? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}

