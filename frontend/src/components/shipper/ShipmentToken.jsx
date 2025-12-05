export function ShipmentToken({ shipment, onNavigate }) {
  return (
    <div>
      <h1 className="text-slate-900 mb-2">Shipment Token</h1>
      <p className="text-slate-600">Token for shipment {shipment?.id || 'N/A'}</p>
    </div>
  );
}

