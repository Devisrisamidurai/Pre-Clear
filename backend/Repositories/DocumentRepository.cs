using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PreClear.Api.Data;
using PreClear.Api.Interfaces;
using PreClear.Api.Models;

namespace PreClear.Api.Repositories
{
    public class DocumentRepository : IDocumentRepository
    {
        private readonly PreclearDbContext _db;
        public DocumentRepository(PreclearDbContext db) => _db = db;

        public async Task<ShipmentDocument> AddAsync(ShipmentDocument doc)
        {
            _db.ShipmentDocuments.Add(doc);
            await _db.SaveChangesAsync();
            return doc;
        }

        public async Task<List<ShipmentDocument>> GetByShipmentIdAsync(long shipmentId)
        {
            return await _db.ShipmentDocuments.AsNoTracking().Where(d => d.ShipmentId == shipmentId).OrderByDescending(d => d.UploadedAt).ToListAsync();
        }

        public async Task<ShipmentDocument?> FindAsync(long id)
        {
            return await _db.ShipmentDocuments.FindAsync(id);
        }

        public async Task UpdateAsync(ShipmentDocument doc)
        {
            _db.ShipmentDocuments.Update(doc);
            await _db.SaveChangesAsync();
        }
    }
}
