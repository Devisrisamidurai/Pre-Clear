namespace PreClear.Api.Models
{
    public enum DocumentType { CommercialInvoice, PackingList, CertificateOfOrigin, ExportLicense, ImportLicense, SDS, AWB, BOL, CMR, Other }

    public class ShipmentDocument
    {
        public long Id { get; set; }
        public long ShipmentId { get; set; }
        public DocumentType DocumentType { get; set; } = DocumentType.Other;
        public string? FileUrl { get; set; }
        public long? UploadedBy { get; set; }
        public bool VerifiedByBroker { get; set; }
        public DateTime UploadedAt { get; set; }
        public int Version { get; set; } = 1;
    }
}
