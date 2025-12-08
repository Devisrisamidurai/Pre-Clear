using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PreClear.Api.Interfaces;
using PreClear.Api.Models;

namespace PreClear.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShipmentsController : ControllerBase
    {
        private readonly IShipmentService _service;
        private readonly ILogger<ShipmentsController> _logger;

        public ShipmentsController(IShipmentService service, ILogger<ShipmentsController> logger)
        {
            _service = service;
            _logger = logger;
        }

        // POST: api/shipments
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateShipmentDto dto)
        {
            if (dto == null) return BadRequest(new { error = "invalid_payload" });

            try
            {
                var created = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (ArgumentException aex)
            {
                _logger.LogWarning(aex, "Invalid create shipment request");
                return BadRequest(new { error = "invalid_input", detail = aex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating shipment");
                return StatusCode(500, new { error = "internal_error" });
            }
        }

        // PUT: api/shipments/{id}/status
        [HttpPut("{id:long}/status")]
        public async Task<IActionResult> UpdateStatus(long id, [FromBody] UpdateStatusRequest req)
        {
            if (req == null || string.IsNullOrWhiteSpace(req.Status)) return BadRequest(new { error = "status_required" });

            try
            {
                var ok = await _service.UpdateStatusAsync(id, req.Status);
                if (!ok) return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating shipment status");
                return StatusCode(500, new { error = "internal_error" });
            }
        }

        // GET: api/shipments/user/{userId}
        [HttpGet("user/{userId:long}")]
        public async Task<IActionResult> GetByUser(long userId)
        {
            try
            {
                var list = await _service.GetByUserAsync(userId);
                return Ok(list);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving shipments for user {UserId}", userId);
                return StatusCode(500, new { error = "internal_error" });
            }
        }

        // GET: api/shipments/{id}
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetById(long id)
        {
            try
            {
                var s = await _service.GetByIdAsync(id);
                if (s == null) return NotFound();
                return Ok(s);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting shipment {Id}", id);
                return StatusCode(500, new { error = "internal_error" });
            }
        }

        public class UpdateStatusRequest { public string Status { get; set; } = string.Empty; }
    }
}
