import { MapPin, Package } from 'lucide-react';

export function ShipmentTracking() {
  const shipments = [
    { id: 'SHP-001', status: 'In Transit', origin: '🇨🇳 China', dest: '🇺🇸 US', token: 'UPS-PCT-87654321' },
    { id: 'SHP-002', status: 'Delivered', origin: '🇮🇳 India', dest: '🇬🇧 UK', token: 'UPS-PCT-87654322' }
  ];

  return (
    <div style={{ background: '#FBF9F6', minHeight: '100vh', padding: 24 }}>
      <h1 className="mb-2" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.5rem' }}>
        <MapPin className="w-6 h-6" style={{ color: '#3A2B28' }} />
        <span>Shipment Tracking Overview</span>
      </h1>
      <p className="text-slate-600 mb-8">Track all shipments across the platform</p>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left py-4 px-6 text-slate-700">Shipment ID</th>
              <th className="text-left py-4 px-6 text-slate-700">Token</th>
              <th className="text-left py-4 px-6 text-slate-700">Route</th>
              <th className="text-left py-4 px-6 text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="border-b border-slate-100">
                <td className="py-4 px-6 text-slate-900">{shipment.id}</td>
                <td className="py-4 px-6 text-blue-600 font-mono text-sm">{shipment.token}</td>
                <td className="py-4 px-6 text-slate-700">{shipment.origin} → {shipment.dest}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    shipment.status === 'Delivered' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {shipment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

