import { BarChart3, TrendingUp } from 'lucide-react';

export function AIRulesMonitoring() {
  return (
    <div>
      <h1 className="text-slate-900 mb-2">AI Rules Monitoring</h1>
      <p className="text-slate-600 mb-8">Monitor AI performance and accuracy</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-slate-900">AI Accuracy Rate</h3>
          </div>
          <p className="text-4xl text-green-600 mb-2">98.2%</p>
          <p className="text-slate-600 text-sm">Last 30 days</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h3 className="text-slate-900">Total Evaluations</h3>
          </div>
          <p className="text-4xl text-blue-600 mb-2">15,432</p>
          <p className="text-slate-600 text-sm">All time</p>
        </div>
      </div>
    </div>
  );
}

