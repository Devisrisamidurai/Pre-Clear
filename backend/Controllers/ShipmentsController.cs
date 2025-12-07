using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PreClear.Api.Data;
using PreClear.Api.Models;

namespace PreClear.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShipmentsController : ControllerBase
    {
        private readonly PreclearDbContext _db;
        public ShipmentsController(PreclearDbContext db) => _db = db;

        // GET: api/shipments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Shipment>>> List([FromQuery] int page = 1, [FromQuery] int pageSize = 25)
        {
            var q = _db.Shipments.AsNoTracking().OrderByDescending(s => s.CreatedAt);
            var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            return items;
        }

        // GET: api/shipments/{id}
        [HttpGet("{id:long}")]
        public async Task<ActionResult<Shipment>> Get(long id)
        {
            var s = await _db.Shipments.FindAsync(id);
            if (s == null) return NotFound();
            return s;
        }

        // POST: api/shipments
        [HttpPost]
        public async Task<ActionResult<Shipment>> Create(Shipment input)
        {
            // generate reference id if missing
            if (string.IsNullOrWhiteSpace(input.ReferenceId))
                input.ReferenceId = "REF-" + System.Guid.NewGuid().ToString("N").Substring(0, 12).ToUpperInvariant();

            input.CreatedAt = input.UpdatedAt = System.DateTime.UtcNow;
            _db.Shipments.Add(input);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = input.Id }, input);
        }

        // PUT: api/shipments/{id}
        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long id, Shipment input)
        {
            var s = await _db.Shipments.FindAsync(id);
            if (s == null) return NotFound();

            s.ShipmentName = input.ShipmentName;
            s.Mode = input.Mode;
            s.ShipmentType = input.ShipmentType;
            s.Carrier = input.Carrier;
            s.Status = input.Status;
            s.PreclearToken = input.PreclearToken;
            s.UpdatedAt = System.DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/shipments/{id}
        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Delete(long id)
        {
            var s = await _db.Shipments.FindAsync(id);
            if (s == null) return NotFound();
            _db.Shipments.Remove(s);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
