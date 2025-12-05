import { FileSearch } from 'lucide-react';

export function ApprovalLogs() {
  const logs = [
    { id: 1, shipmentId: 'SHP-001', action: 'Token Generated', user: 'John Smith (Broker)', timestamp: '2024-12-03 14:30' },
    { id: 2, shipmentId: 'SHP-002', action: 'AI Approved', user: 'System', timestamp: '2024-12-03 14:15' },
    { id: 3, shipmentId: 'SHP-003', action: 'Documents Requested', user: 'Jane Doe (Broker)', timestamp: '2024-12-03 13:45' }
  ];

  return (
    <div>
      <h1 className="text-slate-900 mb-2">Approval Logs & Audit Trail</h1>
      <p className="text-slate-600 mb-8">View all approval activities and audit history</p>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left py-4 px-6 text-slate-700">Shipment ID</th>
              <th className="text-left py-4 px-6 text-slate-700">Action</th>
              <th className="text-left py-4 px-6 text-slate-700">User</th>
              <th className="text-left py-4 px-6 text-slate-700">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-slate-100">
                <td className="py-4 px-6 text-slate-900">{log.shipmentId}</td>
                <td className="py-4 px-6 text-slate-700">{log.action}</td>
                <td className="py-4 px-6 text-slate-700">{log.user}</td>
                <td className="py-4 px-6 text-slate-600 text-sm">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

