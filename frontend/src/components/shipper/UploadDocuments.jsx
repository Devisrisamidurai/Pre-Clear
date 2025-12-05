export function UploadDocuments({ shipment, onNavigate }) {
  return (
    <div>
      <h1 className="text-slate-900 mb-2">Upload Documents</h1>
      <p className="text-slate-600">Upload documents for shipment {shipment?.id || 'N/A'}</p>
    </div>
  );
}

