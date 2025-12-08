using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PreClear.Api.Data;
using PreClear.Api.Interfaces;
using PreClear.Api.Models;

namespace PreClear.Api.Repositories
{
    public class ShipmentRepository : IShipmentRepository
    {
        private readonly PreclearDbContext _db;
        public ShipmentRepository(PreclearDbContext db) => _db = db;

        public async Task<Shipment> AddAsync(Shipment shipment)
        {
            _db.Shipments.Add(shipment);
            await _db.SaveChangesAsync();
            return shipment;
        }

        public async Task<Shipment?> GetByIdAsync(long id)
        {
            return await _db.Shipments.FindAsync(id);
        }

        public async Task<List<Shipment>> GetByUserAsync(long userId)
        {
            return await _db.Shipments.AsNoTracking().Where(s => s.CreatedBy == userId).OrderByDescending(s => s.CreatedAt).ToListAsync();
        }

        public async Task UpdateAsync(Shipment shipment)
        {
            _db.Shipments.Update(shipment);
            await _db.SaveChangesAsync();
        }
    }
}
