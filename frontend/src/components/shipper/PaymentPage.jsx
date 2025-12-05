export function PaymentPage({ shipment, onNavigate }) {
  return (
    <div>
      <h1 className="text-slate-900 mb-2">Payment</h1>
      <p className="text-slate-600">Payment for shipment {shipment?.id || 'N/A'}</p>
    </div>
  );
}

