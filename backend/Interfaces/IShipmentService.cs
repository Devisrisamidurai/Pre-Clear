namespace PreClear.Api.Interfaces
{
    public interface IShipmentService
    {
        System.Threading.Tasks.Task<System.Collections.Generic.List<PreClear.Api.Models.Shipment>> GetByUserAsync(long userId);
        System.Threading.Tasks.Task<PreClear.Api.Models.Shipment> CreateAsync(PreClear.Api.Models.CreateShipmentDto dto);
        System.Threading.Tasks.Task<PreClear.Api.Models.Shipment?> GetByIdAsync(long id);
        System.Threading.Tasks.Task<bool> UpdateStatusAsync(long shipmentId, string status);
    }
}
