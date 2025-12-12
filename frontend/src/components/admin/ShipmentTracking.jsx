import { MapPin, Package, User } from 'lucide-react';
import { useShipments } from '../../hooks/useShipments';

export function ShipmentTracking() {
  const { shipments = [] } = useShipments();

  const getStatusDisplay = (shipment) => {
    const aiStatus = shipment.aiApproval === 'approved' ? 'AI Approved' : 
                    shipment.aiApproval === 'rejected' ? 'AI Rejected' : 'AI Pending';
    const brokerStatus = shipment.brokerApproval === 'approved' ? 'Broker Approved' : 
                        shipment.brokerApproval === 'documents-requested' ? 'Docs Requested' : 'Broker Pending';
    const paymentStatus = shipment.paymentStatus === 'completed' ? 'Paid' : 'Payment Pending';
    
    return `${aiStatus} | ${brokerStatus} | ${paymentStatus}`;
  };

  const getAssignedBroker = (shipment) => {
    // For now, we'll show a mock broker assignment
    // In a real system, this would come from the shipment data
    return shipment.brokerApproval !== 'not-started' ? 'John Broker' : 'Not Assigned';
  };

  return (
    <div style={{ background: '#FBF9F6', minHeight: '100vh', padding: 24 }}>
      <h1 className="mb-2" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.5rem' }}>
        <MapPin className="w-6 h-6" style={{ color: '#3A2B28' }} />
        <span>Shipment Tracking Overview</span>
      </h1>
      <p className="text-slate-600 mb-8">Track all shipments across the platform</p>
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '2px solid #3A2B28' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: '#D4AFA0' }}>
              <th className="text-left py-4 px-6 font-semibold" style={{ color: '#2F1B17', width: '15%' }}>Shipment ID</th>
              <th className="text-left py-4 px-6 font-semibold" style={{ color: '#2F1B17', width: '20%' }}>Route</th>
              <th className="text-left py-4 px-6 font-semibold" style={{ color: '#2F1B17', width: '15%' }}>Pickup Mode</th>
              <th className="text-left py-4 px-6 font-semibold" style={{ color: '#2F1B17', width: '20%' }}>Assigned Broker</th>
              <th className="text-left py-4 px-6 font-semibold" style={{ color: '#2F1B17', width: '30%' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="border-b" style={{ borderColor: '#E6B6A0' }}>
                <td className="py-4 px-6 text-slate-900 font-medium">#{shipment.id}</td>
                <td className="py-4 px-6 text-slate-700">
                  {shipment.shipper?.city || 'N/A'}, {shipment.shipper?.country || ''} → {shipment.consignee?.city || 'N/A'}, {shipment.consignee?.country || ''}
                </td>
                <td className="py-4 px-6 text-slate-700">{shipment.pickupType || 'N/A'}</td>
                <td className="py-4 px-6 text-slate-700">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {getAssignedBroker(shipment)}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-slate-700">{getStatusDisplay(shipment)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

