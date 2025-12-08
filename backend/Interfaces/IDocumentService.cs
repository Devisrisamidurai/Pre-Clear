using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using PreClear.Api.Models;

namespace PreClear.Api.Interfaces
{
    public interface IDocumentService
    {
        Task<ShipmentDocument> UploadAsync(long shipmentId, long? uploadedBy, string originalFileName, Stream content, DocumentType docType);
        Task<System.Collections.Generic.List<ShipmentDocument>> GetByShipmentIdAsync(long shipmentId);
        Task<(ShipmentDocument?, string?)> GetDocumentAsync(long id);
    }
}
 
