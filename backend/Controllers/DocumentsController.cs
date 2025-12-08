using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PreClear.Api.Interfaces;
using PreClear.Api.Models;

namespace PreClear.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentsController : ControllerBase
    {
        private readonly IDocumentService _service;
        private readonly ILogger<DocumentsController> _logger;

        public DocumentsController(IDocumentService service, ILogger<DocumentsController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpPost("shipments/{shipmentId}/upload")]
        [RequestSizeLimit(50_000_000)]
        public async Task<IActionResult> Upload(long shipmentId, [FromForm] Models.FileUploadRequest request, [FromForm] DocumentType docType = DocumentType.Other, [FromForm] long? uploadedBy = null)
        {
            var file = request?.File;
            if (file == null) return BadRequest(new { error = "file_required" });

            try
            {
                using var stream = file.OpenReadStream();
                var created = await _service.UploadAsync(shipmentId, uploadedBy, file.FileName, stream, docType);
                return Created(created.FileUrl ?? $"/api/documents/{created.Id}/download", created);
            }
            catch (ArgumentException aex)
            {
                _logger.LogWarning(aex, "Invalid upload request");
                return BadRequest(new { error = aex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading document");
                return StatusCode(500, new { error = "internal_error" });
            }
        }

        [HttpGet("shipments/{shipmentId}/documents")]
        public async Task<IActionResult> ListByShipment(long shipmentId)
        {
            try
            {
                var list = await _service.GetByShipmentIdAsync(shipmentId);
                return Ok(list);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error listing documents for shipment {ShipmentId}", shipmentId);
                return StatusCode(500, new { error = "internal_error" });
            }
        }

        [HttpGet("{id:long}/download")]
        public async Task<IActionResult> Download(long id)
        {
            try
            {
                var (doc, path) = await _service.GetDocumentAsync(id);
                if (doc == null) return NotFound();
                if (string.IsNullOrWhiteSpace(path) || !System.IO.File.Exists(path)) return NotFound();

                var contentType = GetContentType(path);
                var fs = System.IO.File.OpenRead(path);
                return File(fs, contentType, Path.GetFileName(path));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading document {Id}", id);
                return StatusCode(500, new { error = "internal_error" });
            }
        }

        private static string GetContentType(string path)
        {
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return ext switch
            {
                ".pdf" => "application/pdf",
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".doc" => "application/msword",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".xls" => "application/vnd.ms-excel",
                ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ".csv" => "text/csv",
                _ => "application/octet-stream",
            };
        }
    }
}
 
