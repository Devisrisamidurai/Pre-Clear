namespace PreClear.Api.Models
{
    public enum PackageType { Box, Envelope, Pallet, Other }
    public enum DimensionUnit { cm, inch }
    public enum WeightUnit { kg, lb }

    public class ShipmentPackage
    {
        public long Id { get; set; }
        public long ShipmentId { get; set; }
        public PackageType PackageType { get; set; } = PackageType.Box;
        public decimal? Length { get; set; }
        public decimal? Width { get; set; }
        public decimal? Height { get; set; }
        public DimensionUnit DimensionUnit { get; set; } = DimensionUnit.cm;
        public decimal? Weight { get; set; }
        public WeightUnit WeightUnit { get; set; } = WeightUnit.kg;
        public bool Stackable { get; set; }
    }
}
