using System;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using PreClear.Api.Data;
using PreClear.Api.Interfaces;
using PreClear.Api.Models;

namespace PreClear.Api.Services
{
    public class AiService : IAiService
    {
        private readonly IAiRepository _repo;
        private readonly ILogger<AiService> _logger;

        public AiService(IAiRepository repo, ILogger<AiService> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        public async Task<AiResultDto> AnalyzeAsync(string description)
        {
            if (string.IsNullOrWhiteSpace(description))
            {
                return new AiResultDto { HsCode = string.Empty, Confidence = 0.0, ComplianceRisk = false, Restrictions = Array.Empty<string>(), Suggestions = Array.Empty<string>(), Notes = "empty_input" };
            }

            // Simulate work on a background thread to keep API responsive
            var result = await Task.Run(() => RunHeuristics(description));

            try
            {
                // persist a finding for audit (non-blocking integrity)
                var finding = new AiFinding
                {
                    ShipmentId = 0,
                    Message = $"HS:{result.HsCode}; Risk:{result.ComplianceRisk}; Notes:{result.Notes}",
                    SuggestedAction = result.Suggestions != null && result.Suggestions.Length > 0 ? string.Join(";", result.Suggestions) : null,
                    Details = JsonDocument.Parse(JsonSerializer.Serialize(result)),
                    Severity = result.ComplianceRisk ? Severity.warning : Severity.info
                };

                await _repo.SaveFindingAsync(finding);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to persist AI finding (non-fatal)");
            }

            return result;
        }

        private AiResultDto RunHeuristics(string text)
        {
            var t = text.ToLowerInvariant();

            // Look for explicit HS code
            var m = Regex.Match(text, "\\b(\\d{6,8})\\b");
            if (m.Success)
            {
                return new AiResultDto
                {
                    HsCode = m.Value,
                    Confidence = 0.98,
                    ComplianceRisk = t.Contains("battery") || t.Contains("lithium") || t.Contains("dangerous"),
                    Restrictions = Array.Empty<string>(),
                    Suggestions = new[] { "Verify origin", "Confirm packing" },
                    Notes = "extracted_explicit_hs"
                };
            }

            string hs = "000000";
            double confidence = 0.4;
            bool risk = false;
            var restrictions = new System.Collections.Generic.List<string>();
            var suggestions = new System.Collections.Generic.List<string>();

            if (t.Contains("laptop") || t.Contains("computer") || t.Contains("electronics"))
            {
                hs = "847130";
                confidence = 0.75;
                suggestions.Add("Classify as electronics");
            }
            else if (t.Contains("shirt") || t.Contains("t-shirt") || t.Contains("clothing"))
            {
                hs = "610910";
                confidence = 0.72;
                suggestions.Add("Provide fiber composition");
            }
            else if (t.Contains("chocolate") || t.Contains("cocoa") || t.Contains("food"))
            {
                hs = "1806";
                confidence = 0.65;
                suggestions.Add("Check sanitary certificates");
            }
            else if (t.Contains("battery") || t.Contains("lithium"))
            {
                hs = "850760";
                confidence = 0.9;
                risk = true;
                restrictions.Add("Dangerous goods declaration required");
                suggestions.Add("Use approved battery packaging");
            }
            else
            {
                hs = "000000";
                confidence = 0.35;
                suggestions.Add("Provide more detailed description");
            }

            if (risk) restrictions.Add("May be restricted or require permits");

            return new AiResultDto
            {
                HsCode = hs,
                Confidence = confidence,
                ComplianceRisk = risk,
                Restrictions = restrictions.ToArray(),
                Suggestions = suggestions.ToArray(),
                Notes = "heuristic_analysis"
            };
        }
    }
}

