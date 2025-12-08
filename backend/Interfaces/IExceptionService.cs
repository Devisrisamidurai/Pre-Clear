using System.Collections.Generic;
using System.Threading.Tasks;
using PreClear.Api.Models;

namespace PreClear.Api.Interfaces
{
    public interface IExceptionService
    {
        Task<ShipmentException> CreateAsync(long shipmentId, string code, string message, long? createdBy = null);
        Task<List<ShipmentException>> GetOpenByShipmentAsync(long shipmentId);
        Task ResolveAsync(long exceptionId, long? resolvedBy = null);
    }
}
