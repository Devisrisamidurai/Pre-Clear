import { Users, Settings, BarChart3, Shield, TrendingUp, Activity } from 'lucide-react';

export function AdminDashboard({ onNavigate }) {
  return (
    <div>
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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">AI Accuracy</p>
              <p className="text-slate-900 text-2xl">98%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">System Status</p>
              <p className="text-green-700">Operational</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => onNavigate('user-management')}
          className="p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all text-left"
        >
          <Users className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="text-slate-900 mb-2">User Management</h3>
          <p className="text-slate-600 text-sm">Manage shippers and brokers</p>
        </button>

        <button
          onClick={() => onNavigate('import-export-rules')}
          className="p-6 bg-white rounded-xl border border-slate-200 hover:border-green-500 hover:shadow-lg transition-all text-left"
        >
          <Shield className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="text-slate-900 mb-2">Import/Export Rules</h3>
          <p className="text-slate-600 text-sm">Manage compliance rules and regulations</p>
        </button>

        <button
          onClick={() => onNavigate('system-config')}
          className="p-6 bg-white rounded-xl border border-slate-200 hover:border-purple-500 hover:shadow-lg transition-all text-left"
        >
          <Settings className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="text-slate-900 mb-2">System Configuration</h3>
          <p className="text-slate-600 text-sm">Configure platform settings</p>
        </button>

        <button
          onClick={() => onNavigate('ai-monitoring')}
          className="p-6 bg-white rounded-xl border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all text-left"
        >
          <BarChart3 className="w-8 h-8 text-amber-600 mb-3" />
          <h3 className="text-slate-900 mb-2">AI Rules Monitoring</h3>
          <p className="text-slate-600 text-sm">Monitor AI performance</p>
        </button>
      </div>
    </div>
  );
}

