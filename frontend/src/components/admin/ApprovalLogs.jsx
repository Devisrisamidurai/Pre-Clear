import { FileSearch } from 'lucide-react';
import { useShipments } from '../../hooks/useShipments';

export function ApprovalLogs() {
  const { shipments = [] } = useShipments();

  // Generate logs from shipment data
  const generateLogs = () => {
    const logs = [];

    shipments.forEach(shipment => {
      // AI approval logs
      if (shipment.aiApproval === 'approved' && shipment.aiEvaluatedAt) {
        logs.push({
          id: `ai-${shipment.id}`,
          shipmentId: shipment.id,
          action: 'AI Approved',
          user: 'AI System',
          timestamp: new Date(shipment.aiEvaluatedAt).toLocaleString(),
          score: shipment.aiScore
        });
      }

      // Broker approval logs
      if (shipment.brokerApproval === 'approved' && shipment.brokerReviewedAt) {
        logs.push({
          id: `broker-${shipment.id}`,
          shipmentId: shipment.id,
          action: 'Broker Approved',
          user: 'John Broker',
          timestamp: new Date(shipment.brokerReviewedAt).toLocaleString()
        });
      }

      // Document request logs
      if (shipment.brokerApproval === 'documents-requested') {
        logs.push({
          id: `docs-${shipment.id}`,
          shipmentId: shipment.id,
          action: 'Documents Requested',
          user: 'John Broker',
          timestamp: new Date().toLocaleString() // Mock timestamp
        });
      }

      // Token generation logs
      if (shipment.status === 'token-generated' && shipment.tokenGeneratedAt) {
        logs.push({
          id: `token-${shipment.id}`,
          shipmentId: shipment.id,
          action: 'Token Generated',
          user: 'System',
          timestamp: new Date(shipment.tokenGeneratedAt).toLocaleString(),
          token: shipment.token
        });
      }

      // Payment completion logs
      if (shipment.paymentStatus === 'completed' && shipment.bookingDate) {
        logs.push({
          id: `payment-${shipment.id}`,
          shipmentId: shipment.id,
          action: 'Payment Completed',
          user: 'Payment System',
          timestamp: new Date(shipment.bookingDate).toLocaleString()
        });
      }
    });

    // Sort by timestamp descending
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const logs = generateLogs();

  return (
    <div style={{ background: '#FBF9F6', minHeight: '100vh', padding: 24 }}>
      <h1 className="mb-2" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.5rem' }}>
        <FileSearch className="w-6 h-6" style={{ color: '#3A2B28' }} />
        <span>Approval Logs & Audit Trail</span>
      </h1>
      <p className="text-slate-600 mb-8">View all approval activities and audit history</p>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left py-4 px-6 text-slate-700">Shipment ID</th>
              <th className="text-left py-4 px-6 text-slate-700">Action</th>
              <th className="text-left py-4 px-6 text-slate-700">User</th>
              <th className="text-left py-4 px-6 text-slate-700">Details</th>
              <th className="text-left py-4 px-6 text-slate-700">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-slate-100">
                <td className="py-4 px-6 text-slate-900 font-medium">#{log.shipmentId}</td>
                <td className="py-4 px-6 text-slate-700">{log.action}</td>
                <td className="py-4 px-6 text-slate-700">{log.user}</td>
                <td className="py-4 px-6 text-slate-600 text-sm">
                  {log.score && `Score: ${log.score}%`}
                  {log.token && `Token: ${log.token}`}
                  {!log.score && !log.token && '-'}
                </td>
                <td className="py-4 px-6 text-slate-600 text-sm">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No approval logs available
          </div>
        )}
      </div>
    </div>
  );
}

