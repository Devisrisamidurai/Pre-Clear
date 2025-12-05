import { Settings } from 'lucide-react';

export function SystemConfig() {
  return (
    <div>
      <h1 className="text-slate-900 mb-2">System Configuration</h1>
      <p className="text-slate-600 mb-8">Configure platform settings and preferences</p>
      <div className="max-w-3xl space-y-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-slate-900 mb-4">AI Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 mb-2">AI Confidence Threshold</label>
              <input type="number" value="90" className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-slate-900 mb-4">Approval Settings</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked readOnly />
              <span className="text-slate-700">Require dual approval (AI + Broker)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

