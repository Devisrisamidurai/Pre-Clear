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
    public class UsersController : ControllerBase
    {
        private readonly PreclearDbContext _db;
        public UsersController(PreclearDbContext db) => _db = db;

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAll()
        {
            return await _db.Users.AsNoTracking().ToListAsync();
        }
        // GET: api/users/{id}
        [HttpGet("{id:long}")]
        public async Task<ActionResult<User>> Get(long id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();
            return user;
        }
        // POST: api/users
        [HttpPost]
        public async Task<ActionResult<User>> Create(User input)
        {
            // NOTE: in prod hash password and validate input
            input.CreatedAt = input.UpdatedAt = System.DateTime.UtcNow;
            _db.Users.Add(input);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = input.Id }, input);
        }
        // PUT: api/users/{id}
        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long id, User input)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();
            // selective updates (avoid overwriting password_hash unless provided)
            user.FirstName = input.FirstName;
            user.LastName = input.LastName;
            user.Phone = input.Phone;
            user.Company = input.Company;
            user.Role = input.Role;
            user.IsActive = input.IsActive;
            user.UpdatedAt = System.DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return NoContent();
        }
        // DELETE: api/users/{id}
        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Delete(long id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();
            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
