using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PreClear.Api.Interfaces;

namespace PreClear.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly IAiService _ai;
        private readonly ILogger<AiController> _logger;

        public AiController(IAiService ai, ILogger<AiController> logger)
        {
            _ai = ai;
            _logger = logger;
        }

        public class AnalyzeRequest
        {
            public string Description { get; set; } = string.Empty;
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> Analyze([FromBody] AnalyzeRequest req)
        {
            if (req == null || string.IsNullOrWhiteSpace(req.Description))
                return BadRequest(new { error = "description_required" });

            try
            {
                var result = await _ai.AnalyzeAsync(req.Description);
                return Ok(result);
            }
            catch (ArgumentException aex)
            {
                _logger.LogWarning(aex, "Bad request in AI analyze");
                return BadRequest(new { error = "invalid_input", detail = aex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during AI analysis");
                return StatusCode(500, new { error = "internal_error", detail = "An unexpected error occurred while analyzing the description." });
            }
        }
    }
}

