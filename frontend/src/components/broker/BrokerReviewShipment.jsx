export function BrokerReviewShipment({ shipment, onNavigate }) {
  return (
    <div>
      <h1 className="text-slate-900 mb-2">Broker Review</h1>
      <p className="text-slate-600">Review shipment {shipment?.id || 'N/A'}</p>
    </div>
  );
}

