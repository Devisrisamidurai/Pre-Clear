export function ShipmentBooking({ shipment, onNavigate }) {
  return (
    <div>
      <h1 className="text-slate-900 mb-2">Shipment Booking</h1>
      <p className="text-slate-600">Book shipment {shipment?.id || 'N/A'}</p>
    </div>
  );
}

