import { Users, Settings, BarChart3, Shield, TrendingUp, Activity, MapPin, Package, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useShipments } from '../../hooks/useShipments';

export function AdminDashboard({ onNavigate }) {
  const { shipments = [] } = useShipments();

  // Calculate real stats from shipments data
  const totalShipments = shipments.length;
  const completedShipments = shipments.filter(s => s.status === 'token-generated').length;
  const pendingShipments = shipments.filter(s => s.aiApproval === 'approved' && s.brokerApproval === 'pending').length;
  const aiApprovedShipments = shipments.filter(s => s.aiApproval === 'approved').length;
  const brokerApprovedShipments = shipments.filter(s => s.brokerApproval === 'approved').length;
  const paidShipments = shipments.filter(s => s.paymentStatus === 'completed').length;

  // Calculate weekly/monthly stats (mock for now, but could be calculated from dates)
  const weeklyShipments = Math.round(totalShipments * 0.3); // Approximate weekly
  const monthlyShipments = totalShipments;

  // Top routes calculation
  const routeCounts = {};
  shipments.forEach(shipment => {
    const route = `${shipment.shipper?.country || 'Unknown'} → ${shipment.consignee?.country || 'Unknown'}`;
    routeCounts[route] = (routeCounts[route] || 0) + 1;
  });

  const topRoutes = Object.entries(routeCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([route, count]) => ({ route, count }));

  const getStatusBadge = (shipment) => {
    if (shipment.status === 'token-generated') {
      return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Completed</span>;
    }
    if (shipment.brokerApproval === 'approved') {
      return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Broker Approved</span>;
    }
    if (shipment.aiApproval === 'approved') {
      return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">AI Approved</span>;
    }
    if (shipment.status === 'documents-uploaded') {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">Documents Uploaded</span>;
    }
    return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">{shipment.status || 'Draft'}</span>;
  };

  return (
    <div style={{ background: '#FBF9F6', minHeight: '100vh', padding: 24 }}>
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Admin Dashboard</h1>
        <p className="text-slate-600">System overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Total Shipments</p>
              <p className="text-slate-900 text-2xl">{totalShipments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Completed</p>
              <p className="text-slate-900 text-2xl">{completedShipments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Pending Review</p>
              <p className="text-slate-900 text-2xl">{pendingShipments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">AI Approvals</p>
              <p className="text-slate-900 text-2xl">{aiApprovedShipments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* All Shipments Table */}
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-slate-900 text-xl font-semibold">All Shipments Overview</h2>
          <p className="text-slate-600">Complete list of all shipments and their current status</p>
        </div>

        <div className="bg-white rounded-xl overflow-hidden" style={{ border: '2px solid #3A2B28' }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: '#D4AFA0' }}>
                <th className="text-left py-4 px-6 font-semibold" style={{ color: '#2F1B17', width: '12%' }}>Shipment ID</th>
                <th className="text-left py-4 px-6 font-semibold" style={{ color: '#2F1B17', width: '20%' }}>Route</th>
                <th className="text-left py-4 px-6 font-semibold" style={{ color: '#2F1B17', width: '15%' }}>Shipper</th>
                <th className="text-left py-4 px-6 font-semibold" style={{ color: '#2F1B17', width: '12%' }}>Value</th>
                <th className="text-left py-4 px-6 font-semibold" style={{ color: '#2F1B17', width: '15%' }}>AI Status</th>
                <th className="text-left py-4 px-6 font-semibold" style={{ color: '#2F1B17', width: '15%' }}>Broker Status</th>
                <th className="text-left py-4 px-6 font-semibold" style={{ color: '#2F1B17', width: '11%' }}>Payment</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => {
                const currencyCode = shipment.currency || 'USD';
                const currencySymbol = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$', INR: '₹', CNY: '¥', AUD: 'A$' }[currencyCode] || currencyCode;

                return (
                  <tr key={shipment.id} className="border-b hover:bg-slate-50" style={{ borderColor: '#E6B6A0' }}>
                    <td className="py-4 px-6 text-slate-900 font-medium">#{shipment.id}</td>
                    <td className="py-4 px-6 text-slate-700 text-sm">
                      {shipment.shipper?.city || 'N/A'}, {shipment.shipper?.country || ''} → {shipment.consignee?.city || 'N/A'}, {shipment.consignee?.country || ''}
                    </td>
                    <td className="py-4 px-6 text-slate-700">{shipment.shipper?.company || shipment.shipperName || 'N/A'}</td>
                    <td className="py-4 px-6 text-slate-700">{currencySymbol}{parseFloat(shipment.value).toLocaleString()} {currencyCode}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        shipment.aiApproval === 'approved' ? 'bg-green-100 text-green-700' :
                        shipment.aiApproval === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {shipment.aiApproval === 'approved' ? 'Approved' :
                         shipment.aiApproval === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        shipment.brokerApproval === 'approved' ? 'bg-green-100 text-green-700' :
                        shipment.brokerApproval === 'documents-requested' ? 'bg-blue-100 text-blue-700' :
                        shipment.brokerApproval === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {shipment.brokerApproval === 'approved' ? 'Approved' :
                         shipment.brokerApproval === 'documents-requested' ? 'Docs Req' :
                         shipment.brokerApproval === 'pending' ? 'Pending' : 'Not Started'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        shipment.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {shipment.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipping Insights */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 text-lg">Shipping Insights</h3>
            <p className="text-slate-500 text-sm">Overview of recent shipment activity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <p className="text-slate-500 text-sm">Total Shipments</p>
              <p className="text-slate-900 text-2xl">{totalShipments}</p>
            </div>

            <div className="col-span-1">
              <p className="text-slate-500 text-sm">Completed</p>
              <p className="text-slate-900 text-2xl">{completedShipments}</p>
              <p className="text-sm text-slate-500">{Math.round((completedShipments / totalShipments) * 100)}% completion rate</p>
            </div>

            <div className="col-span-1">
              <p className="text-slate-500 text-sm">Avg Daily</p>
              <p className="text-slate-900 text-2xl">{Math.round(totalShipments / 30)}</p>
              <p className="text-sm text-slate-500">Estimated</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-slate-800 mb-2">Top Routes</h4>
            <div className="space-y-2">
              {topRoutes.map((r) => (
                <div key={r.route} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <MapPin className="w-4 h-4 text-slate-700" />
                    </div>
                    <div>
                      <div className="text-slate-900">{r.route}</div>
                      <div className="text-slate-500 text-sm">{r.count} shipments</div>
                    </div>
                  </div>
                  <div className="text-slate-700 font-medium">{Math.round((r.count / totalShipments) * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h4 className="text-slate-900 mb-3">Recent Activity</h4>
          <ul className="text-sm text-slate-600 space-y-2">
            <li>AI approvals — {aiApprovedShipments} total</li>
            <li>Broker approvals — {brokerApprovedShipments} total</li>
            <li>Payments completed — {paidShipments} total</li>
            <li>Documents requested — {shipments.filter(s => s.brokerApproval === 'documents-requested').length} pending</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

