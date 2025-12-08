using System.Collections.Generic;
using System.Threading.Tasks;
using PreClear.Api.Models;

namespace PreClear.Api.Interfaces
{
    public interface IShipmentRepository
    {
        Task<Shipment> AddAsync(Shipment shipment);
        Task<Shipment?> GetByIdAsync(long id);
        Task<List<Shipment>> GetByUserAsync(long userId);
        Task UpdateAsync(Shipment shipment);
    }
}
