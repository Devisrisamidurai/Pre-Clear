import { FileCheck, Brain, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface BrokerDashboardProps {
  onNavigate: (page: string) => void;
}

export function BrokerDashboard({ onNavigate }: BrokerDashboardProps) {
  const preClearQueue = [
    {
      id: 'PCR-001',
      shipper: 'Global Electronics Ltd',
      product: 'Wireless Bluetooth Headphones',
      description: 'Consumer electronics - wireless audio device with Bluetooth 5.0...',
      aiSuggestedHS: '8518.30.20',
      confidence: 94,
      origin: '🇨🇳 China',
      destination: '🇮🇳 India',
      submittedDate: '2024-12-03 10:30',
      priority: 'high',
      documentsUploaded: 4,
      documentsRequired: 5
    },
    {
      id: 'PCR-002',
      shipper: 'Textile Exports Inc',
      product: 'Organic Cotton T-Shirts',
      description: '100% organic cotton apparel, unisex t-shirts, various sizes...',
      aiSuggestedHS: '6109.10.00',
      confidence: 89,
      origin: '🇮🇳 India',
      destination: '🇺🇸 United States',
      submittedDate: '2024-12-03 09:15',
      priority: 'medium',
      documentsUploaded: 5,
      documentsRequired: 5
    },
    {
      id: 'PCR-003',
      shipper: 'Battery Solutions Co',
      product: 'Lithium-Ion Battery Packs',
      description: 'Rechargeable lithium-ion batteries for industrial equipment...',
      aiSuggestedHS: '8506.50.00',
      confidence: 76,
      origin: '🇯🇵 Japan',
      destination: '🇮🇳 India',
      submittedDate: '2024-12-03 08:00',
      priority: 'high',
      documentsUploaded: 3,
      documentsRequired: 6,
      hasExceptions: true
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Customs Broker Dashboard</h1>
        <p className="text-slate-600">Review and approve pre-clearance verification requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Pending Review</p>
              <p className="text-slate-900 text-2xl">{preClearQueue.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Exceptions</p>
              <p className="text-slate-900 text-2xl">
                {preClearQueue.filter(p => p.hasExceptions).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Approved Today</p>
              <p className="text-slate-900 text-2xl">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Avg AI Accuracy</p>
              <p className="text-slate-900 text-2xl">92%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Clear Queue */}
      <div className="mb-8">
        <h2 className="text-slate-900 mb-4">Pre-Clear Verification Queue</h2>
        <div className="space-y-4">
          {preClearQueue.map((request) => (
            <div 
              key={request.id} 
              className={`bg-white rounded-xl p-6 border-2 ${
                request.priority === 'high' ? 'border-orange-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-slate-900">{request.product}</h3>
                    {request.priority === 'high' && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                        High Priority
                      </span>
                    )}
                    {request.hasExceptions && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Exceptions Found
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm mb-1">Request ID: {request.id} • Shipper: {request.shipper}</p>
                  <p className="text-slate-500 text-sm">Submitted: {request.submittedDate}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onNavigate('broker-review')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Review
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* AI Suggested HS Code Panel */}
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <p className="text-slate-700">AI Suggested HS Code</p>
                  </div>
                  <p className="text-purple-900 text-xl font-mono mb-1">{request.aiSuggestedHS}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: `${request.confidence}%` }}
                      />
                    </div>
                    <span className="text-purple-700 text-sm">{request.confidence}%</span>
                  </div>
                </div>

                {/* Route */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-slate-700 mb-2">Route</p>
                  <p className="text-blue-900">{request.origin} → {request.destination}</p>
                </div>

                {/* Document Checklist */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-slate-700 mb-2">Documents</p>
                  <div className="flex items-center gap-2">
                    <FileCheck className={`w-5 h-5 ${
                      request.documentsUploaded === request.documentsRequired 
                        ? 'text-green-600' 
                        : 'text-orange-600'
                    }`} />
                    <span className={`${
                      request.documentsUploaded === request.documentsRequired 
                        ? 'text-green-900' 
                        : 'text-orange-900'
                    }`}>
                      {request.documentsUploaded}/{request.documentsRequired}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-slate-700 mb-2">Quick Actions</p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                      Approve
                    </button>
                    <button className="flex-1 px-3 py-1 border border-red-300 text-red-600 rounded text-sm hover:bg-red-50 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Description Preview */}
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-slate-600 text-sm mb-1">Product Description (NLP Analysis)</p>
                <p className="text-slate-700 text-sm">{request.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exception Workspace Link */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <div>
              <h3 className="text-slate-900">Exception Workspace</h3>
              <p className="text-slate-600 text-sm">
                {preClearQueue.filter(p => p.hasExceptions).length} request(s) require exception handling
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('exceptions')}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            View Exceptions
          </button>
        </div>
      </div>
    </div>
  );
}
