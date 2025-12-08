namespace PreClear.Api.Models
{
    public class CreateShipmentDto
    {
        public string? ShipmentName { get; set; }
        public ShipmentMode Mode { get; set; } = ShipmentMode.Ground;
        public ShipmentType ShipmentType { get; set; } = ShipmentType.International;
        public string Carrier { get; set; } = "UPS";
        public long? CreatedBy { get; set; }
        public string? PreclearToken { get; set; }
    }
}
