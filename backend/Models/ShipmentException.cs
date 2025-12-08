using System;

namespace PreClear.Api.Models
{
    public class ShipmentException
    {
        public long Id { get; set; }
        public long ShipmentId { get; set; }
        public string Code { get; set; } = null!;
        public string Message { get; set; } = null!;
        public long? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool Resolved { get; set; }
        public long? ResolvedBy { get; set; }
        public DateTime? ResolvedAt { get; set; }
    }
}
