import { Users, Settings, BarChart3, Shield, TrendingUp, Activity, MapPin } from 'lucide-react';

export function AdminDashboard({ onNavigate }) {
  // Mock shipping data (replace with real API data when available)
  const shippingStats = {
    weekly: 128,
    monthly: 489,
    prevMonth: 420,
    topRoutes: [
      { route: 'China → USA', count: 142 },
      { route: 'India → UK', count: 96 },
      { route: 'Germany → USA', count: 72 },
    ],
  };

  // monthly change removed per UI request

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
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Total Users</p>
              <p className="text-slate-900 text-2xl">1,247</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Tokens Generated</p>
              <p className="text-slate-900 text-2xl">10,543</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">Shipments (Monthly)</p>
                <p className="text-slate-900 text-2xl">{shippingStats.monthly}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Shipments (Weekly)</p>
              <p className="text-slate-900 text-2xl">{shippingStats.weekly}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => onNavigate('user-management')}
          className="p-6 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all text-left"
        >
          <Users className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="text-slate-900 mb-2">User Management</h3>
          <p className="text-slate-600 text-sm">Manage shippers and brokers</p>
        </button>

        <button
          onClick={() => onNavigate('import-export-rules')}
          className="p-6 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all text-left"
        >
          <Shield className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="text-slate-900 mb-2">Import/Export Rules</h3>
          <p className="text-slate-600 text-sm">Manage compliance rules and regulations</p>
        </button>
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
              <p className="text-slate-500 text-sm">Monthly Shipments</p>
              <p className="text-slate-900 text-2xl">{shippingStats.monthly}</p>
            </div>

            <div className="col-span-1">
              <p className="text-slate-500 text-sm">Weekly Shipments</p>
              <p className="text-slate-900 text-2xl">{shippingStats.weekly}</p>
              <p className="text-sm text-slate-500">Recent 7 days</p>
            </div>

            <div className="col-span-1">
              <p className="text-slate-500 text-sm">Avg Daily</p>
              <p className="text-slate-900 text-2xl">{Math.round(shippingStats.monthly / 30)}</p>
              <p className="text-sm text-slate-500">Estimated</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-slate-800 mb-2">Top Routes</h4>
            <div className="space-y-2">
              {shippingStats.topRoutes.map((r) => (
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
                  <div className="text-slate-700 font-medium">{Math.round((r.count / shippingStats.monthly) * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h4 className="text-slate-900 mb-3">Recent Activity</h4>
          <ul className="text-sm text-slate-600 space-y-2">
            <li>New shipment tokens generated — 24 in last 24h</li>
            <li>AI approvals — 18 in last 24h</li>
            <li>Documents requested — 12 in last 24h</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

