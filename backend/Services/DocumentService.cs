using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using PreClear.Api.Interfaces;
using PreClear.Api.Models;

namespace PreClear.Api.Services
{
    public class DocumentService : IDocumentService
    {
        private readonly IDocumentRepository _repo;
        private readonly ILogger<DocumentService> _logger;
        private readonly string _uploadFolder;
        private static readonly HashSet<string> _allowedExt = new(StringComparer.OrdinalIgnoreCase)
        {
            ".pdf",
            ".jpg",
            ".jpeg",
            ".png",
            ".doc",
            ".docx",
            ".xls",
            ".xlsx",
            ".csv",
            ".txt"
        };

        public DocumentService(IDocumentRepository repo, ILogger<DocumentService> logger)
        {
            _repo = repo;
            _logger = logger;
            _uploadFolder = Path.Combine(AppContext.BaseDirectory, "uploads");
            if (!Directory.Exists(_uploadFolder)) Directory.CreateDirectory(_uploadFolder);
        }

        public async Task<ShipmentDocument> UploadAsync(long shipmentId, long? uploadedBy, string originalFileName, Stream content, DocumentType docType)
        {
            if (content == null) throw new ArgumentNullException(nameof(content));
            if (string.IsNullOrWhiteSpace(originalFileName)) throw new ArgumentException("filename required", nameof(originalFileName));

            var ext = Path.GetExtension(originalFileName);
            if (string.IsNullOrWhiteSpace(ext) || !_allowedExt.Contains(ext))
                throw new ArgumentException("file_type_not_allowed", nameof(originalFileName));

            var unique = Guid.NewGuid().ToString("N") + ext.ToLowerInvariant();
            var fullPath = Path.Combine(_uploadFolder, unique);

            // write file to disk
            using (var fs = File.Create(fullPath))
            {
                await content.CopyToAsync(fs);
            }

            var doc = new ShipmentDocument
            {
                ShipmentId = shipmentId,
                DocumentType = docType,
                FileUrl = unique, // will be resolved by controller to a download route
                UploadedBy = uploadedBy,
                UploadedAt = DateTime.UtcNow,
                Version = 1
            };

            var created = await _repo.AddAsync(doc);

            // update FileUrl to point to API download endpoint
            created.FileUrl = $"/api/documents/{created.Id}/download";
            await _repo.UpdateAsync(created);

            _logger.LogInformation("Uploaded document {DocId} for shipment {ShipmentId}", created.Id, shipmentId);
            return created;
        }

        public async Task<List<ShipmentDocument>> GetByShipmentIdAsync(long shipmentId)
        {
            return await _repo.GetByShipmentIdAsync(shipmentId);
        }

        public async Task<(ShipmentDocument?, string?)> GetDocumentAsync(long id)
        {
            var doc = await _repo.FindAsync(id);
            if (doc == null) return (null, null);
            var fileName = doc.FileUrl;
            // If FileUrl is an api path, the stored unique filename may be in Details; we stored unique filename initially
            // attempt to resolve by checking both possible stored values
            string candidate = Path.Combine(_uploadFolder, fileName ?? string.Empty);
            if (!File.Exists(candidate))
            {
                // try to find any file with GUID in folder
                candidate = Directory.EnumerateFiles(_uploadFolder).FirstOrDefault(f => f.EndsWith(Path.GetFileName(fileName ?? string.Empty), StringComparison.OrdinalIgnoreCase));
            }

            if (candidate != null && File.Exists(candidate)) return (doc, candidate);
            return (doc, null);
        }
    }
}
 
