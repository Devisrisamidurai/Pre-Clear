import { useState } from 'react';
import { AlertTriangle, CheckCircle, Upload, Sparkles, FileText } from 'lucide-react';

export function ExceptionWorkspace() {
  const [exceptions, setExceptions] = useState([
    {
      id: 1,
      productId: 'PRD-003',
      productName: 'Lithium Batteries',
      type: 'document',
      severity: 'high',
      issue: 'Missing MSDS documentation',
      suggestion: 'Upload MSDS (Material Safety Data Sheet) for hazardous goods compliance',
      resolved: false
    },
    {
      id: 2,
      productId: 'PRD-004',
      productName: 'Ceramic Kitchenware',
      type: 'standard',
      severity: 'high',
      issue: 'Product does not meet BIS standards',
      suggestion: 'Obtain BIS certification or modify product to meet IS 13047 standards',
      resolved: false
    },
    {
      id: 3,
      productId: 'PRD-005',
      productName: 'LED Light Bulbs',
      type: 'hs-code',
      severity: 'medium',
      issue: 'HS code mismatch - AI prediction unclear',
      suggestion: 'Review suggested HS codes: 8539.50.10 or 8539.50.90',
      resolved: false,
      suggestedCodes: ['8539.50.10', '8539.50.90']
    }
  ]);

  const handleResolve = (id: number) => {
    setExceptions(prev =>
      prev.map(ex => (ex.id === id ? { ...ex, resolved: true } : ex))
    );
  };

  const handleResolveAll = () => {
    setExceptions(prev => prev.map(ex => ({ ...ex, resolved: true })));
  };

  const unresolvedCount = exceptions.filter(ex => !ex.resolved).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Exception Resolution Workspace</h1>
        <p className="text-slate-600">Resolve compliance exceptions with AI-guided recommendations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Total Exceptions</p>
              <p className="text-slate-900 text-2xl">{exceptions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Unresolved</p>
              <p className="text-slate-900 text-2xl">{unresolvedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Resolved</p>
              <p className="text-slate-900 text-2xl">{exceptions.filter(ex => ex.resolved).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resolve All Button */}
      {unresolvedCount > 0 && (
        <div className="mb-6">
          <button
            onClick={handleResolveAll}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Resolve All with AI Assistance
          </button>
        </div>
      )}

      {/* Exceptions List */}
      <div className="space-y-6">
        {exceptions.map((exception) => (
          <div
            key={exception.id}
            className={`bg-white rounded-xl p-6 border-2 transition-all ${
              exception.resolved
                ? 'border-green-200 bg-green-50/30'
                : exception.severity === 'high'
                ? 'border-red-200'
                : 'border-orange-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                {exception.resolved ? (
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                ) : (
                  <AlertTriangle
                    className={`w-6 h-6 mt-1 ${
                      exception.severity === 'high' ? 'text-red-600' : 'text-orange-600'
                    }`}
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-slate-900">{exception.productName}</h3>
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                      {exception.productId}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        exception.resolved
                          ? 'bg-green-100 text-green-700'
                          : exception.severity === 'high'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {exception.resolved ? 'Resolved' : exception.severity === 'high' ? 'High Priority' : 'Medium Priority'}
                    </span>
                  </div>

                  <p className="text-slate-700 mb-1">{exception.issue}</p>
                  <p className="text-slate-600 text-sm">
                    Type: {exception.type === 'document' ? 'Missing Document' : exception.type === 'standard' ? 'Standards Compliance' : 'HS Code Issue'}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Suggestion */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
              <div className="flex items-start gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-blue-900 mb-1">AI Recommendation</p>
                  <p className="text-slate-700 text-sm">{exception.suggestion}</p>
                </div>
              </div>
            </div>

            {/* Action Area */}
            {!exception.resolved && (
              <div>
                {exception.type === 'document' && (
                  <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer text-center">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-700 mb-1">Upload MSDS Document</p>
                    <p className="text-slate-500 text-sm">Click to browse or drag and drop</p>
                  </div>
                )}

                {exception.type === 'hs-code' && exception.suggestedCodes && (
                  <div className="space-y-3">
                    <p className="text-slate-700">Select correct HS code:</p>
                    {exception.suggestedCodes.map((code, index) => (
                      <button
                        key={index}
                        className="w-full p-4 border-2 border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-left"
                      >
                        <p className="text-slate-900 font-mono mb-1">{code}</p>
                        <p className="text-slate-600 text-sm">
                          {code === '8539.50.10' ? 'LED lamps for general lighting' : 'Other LED lamps'}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {exception.type === 'standard' && (
                  <div className="space-y-3">
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-orange-900 mb-2">Required Actions:</p>
                      <ul className="space-y-1 text-slate-700 text-sm">
                        <li>• Contact BIS for certification process</li>
                        <li>• Submit product samples for testing</li>
                        <li>• Modify product design if needed</li>
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <FileText className="w-4 h-4 inline mr-2" />
                        Apply for BIS Certification
                      </button>
                      <button className="flex-1 p-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                        Request Exemption
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleResolve(exception.id)}
                  className="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Mark as Resolved
                </button>
              </div>
            )}

            {exception.resolved && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-700 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Exception resolved successfully
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      {unresolvedCount === 0 && (
        <div className="mt-8 bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-slate-900 mb-2">All Exceptions Resolved!</h2>
          <p className="text-slate-600 mb-6">
            All compliance exceptions have been successfully resolved. You can now proceed with pre-clearance verification.
          </p>
          <button className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg">
            Submit for Broker Review
          </button>
        </div>
      )}
    </div>
  );
}
