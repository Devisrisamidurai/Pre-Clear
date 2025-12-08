using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PreClear.Api.Data;
using PreClear.Api.Interfaces;
using PreClear.Api.Models;

namespace PreClear.Api.Services
{
    public class ChatService : IChatService
    {
        private readonly PreclearDbContext _db;
        private readonly ILogger<ChatService> _logger;

        public ChatService(PreclearDbContext db, ILogger<ChatService> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<IEnumerable<ShipmentMessage>> GetMessagesForShipmentAsync(long shipmentId)
        {
            return await _db.ShipmentMessages
                .AsNoTracking()
                .Where(m => m.ShipmentId == shipmentId)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<ShipmentMessage> SendMessageAsync(long shipmentId, long? senderId, string message)
        {
            if (string.IsNullOrWhiteSpace(message))
                throw new ArgumentException("message is required", nameof(message));

            var msg = new ShipmentMessage
            {
                ShipmentId = shipmentId,
                SenderId = senderId,
                Message = message,
                CreatedAt = DateTime.UtcNow
            };

            _db.ShipmentMessages.Add(msg);
            await _db.SaveChangesAsync();

            _logger.LogInformation("Saved message {MessageId} for shipment {ShipmentId}", msg.Id, shipmentId);
            return msg;
        }

        public async Task<bool> DeleteMessageAsync(long id)
        {
            var msg = await _db.ShipmentMessages.FindAsync(id);
            if (msg == null) return false;
            _db.ShipmentMessages.Remove(msg);
            await _db.SaveChangesAsync();
            _logger.LogInformation("Deleted message {MessageId}", id);
            return true;
        }
    }
}

