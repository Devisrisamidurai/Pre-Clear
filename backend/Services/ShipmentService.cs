using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using PreClear.Api.Interfaces;
using PreClear.Api.Models;

namespace PreClear.Api.Services
{
    public class ShipmentService : IShipmentService
    {
        private readonly IShipmentRepository _repo;
        private readonly ILogger<ShipmentService> _logger;

        public ShipmentService(IShipmentRepository repo, ILogger<ShipmentService> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        public async Task<List<Shipment>> GetByUserAsync(long userId)
        {
            return await _repo.GetByUserAsync(userId);
        }

        public async Task<Shipment?> GetByIdAsync(long id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task<Shipment> CreateAsync(CreateShipmentDto dto)
        {
            if (dto == null) throw new ArgumentNullException(nameof(dto));

            var shipment = new Shipment
            {
                ShipmentName = dto.ShipmentName,
                Mode = dto.Mode,
                ShipmentType = dto.ShipmentType,
                Carrier = dto.Carrier ?? "UPS",
                PreclearToken = dto.PreclearToken,
                CreatedBy = dto.CreatedBy,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                ReferenceId = "REF-" + Guid.NewGuid().ToString("N").Substring(0, 12).ToUpperInvariant(),
                Status = string.IsNullOrWhiteSpace(dto.PreclearToken) ? ShipmentStatus.pending_validation.ToString() : ShipmentStatus.pre_cleared.ToString()
            };

            var created = await _repo.AddAsync(shipment);
            _logger.LogInformation("Created shipment {ShipmentId} by user {User}", created.Id, dto.CreatedBy);
            return created;
        }

        public async Task<bool> UpdateStatusAsync(long shipmentId, string status)
        {
            var s = await _repo.GetByIdAsync(shipmentId);
            if (s == null) return false;

            s.Status = status;
            s.UpdatedAt = DateTime.UtcNow;
            await _repo.UpdateAsync(s);
            _logger.LogInformation("Updated shipment {ShipmentId} status to {Status}", shipmentId, status);
            return true;
        }
    }
}
