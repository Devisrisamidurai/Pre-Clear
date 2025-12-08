namespace PreClear.Api.Interfaces
{
    public interface IChatService
    {
        System.Threading.Tasks.Task<System.Collections.Generic.IEnumerable<PreClear.Api.Models.ShipmentMessage>> GetMessagesForShipmentAsync(long shipmentId);
        System.Threading.Tasks.Task<PreClear.Api.Models.ShipmentMessage> SendMessageAsync(long shipmentId, long? senderId, string message);
        System.Threading.Tasks.Task<bool> DeleteMessageAsync(long id);
    }
}
