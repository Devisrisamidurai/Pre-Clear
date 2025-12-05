export function RequestBrokerApproval({ shipment, onNavigate }) {
  return (
    <div>
      <h1 className="text-slate-900 mb-2">Request Broker Approval</h1>
      <p className="text-slate-600">Request broker approval for shipment {shipment?.id || 'N/A'}</p>
    </div>
  );
}

