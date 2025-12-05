import { useState } from 'react';
import { CheckCircle, XCircle, Edit2, AlertTriangle, FileText, Globe } from 'lucide-react';

export function BrokerReview({ preClearData, onApprove }) {
  const [hsCode, setHsCode] = useState('8518.30.20');
  const [notes, setNotes] = useState('');
  const [exceptions, setExceptions] = useState([]);

  const handleApprove = () => {
    const tokenData = {
      tokenId: `PCT-${Date.now().toString().slice(-8)}`,
      hsCode,
      productName: preClearData?.productName || 'Wireless Bluetooth Headphones',
      originCountry: preClearData?.originCountry || 'CN',
      destinationCountry: preClearData?.destinationCountry || 'IN',
      approvedDate: new Date().toISOString(),
      validity: '30 days'
    };
    onApprove(tokenData);
  };

  const handleReject = () => {
    alert(`Rejected with notes: ${notes}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Broker Review Page</h1>
        <p className="text-slate-600">Review and verify pre-clearance request</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Review Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Predicted HS Code */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-900">AI Predicted HS Code</h2>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                94% Confidence
              </span>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 mb-4">
              <p className="text-slate-700 text-sm mb-2">Predicted Code</p>
              <p className="text-purple-900 text-3xl font-mono mb-3">{hsCode}</p>
              <p className="text-slate-600 text-sm">
                Headphones and earphones, whether or not combined with a microphone
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={hsCode}
                onChange={(e) => setHsCode(e.target.value)}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="Edit HS code if needed"
              />
              <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Regulatory Rules Result */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-blue-600" />
              <h2 className="text-slate-900">Regulatory Rules Result</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-slate-900 mb-3">Import Rules (India)</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-sm">BIS certification may be required</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-sm">Product must meet safety standards</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-sm">DGFT registration verified</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-slate-900 mb-3">Export Rules (China)</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-sm">Standard export declaration required</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-sm">No special export license needed</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                All regulatory requirements met
              </p>
            </div>
          </div>

          {/* Required vs Missing Documents */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h2 className="text-slate-900 mb-4">Document Checklist</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-slate-900">Commercial Invoice</p>
                    <p className="text-slate-500 text-sm">Uploaded and verified</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">✓</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-slate-900">Certificate of Origin</p>
                    <p className="text-slate-500 text-sm">Uploaded and verified</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">✓</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-slate-900">MSDS</p>
                    <p className="text-slate-500 text-sm">Uploaded and verified</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">✓</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-slate-900">Packing List</p>
                    <p className="text-slate-500 text-sm">Uploaded and verified</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">✓</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700">
                All required documents (4/4) uploaded and verified ✓
              </p>
            </div>
          </div>

          {/* Exception List */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h2 className="text-slate-900 mb-4">Exception List</h2>

            {exceptions.length === 0 ? (
              <div className="p-6 bg-green-50 rounded-lg border border-green-200 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-green-700">No exceptions found</p>
                <p className="text-slate-600 text-sm mt-1">All compliance checks passed</p>
              </div>
            ) : (
              <div className="space-y-3">
                {exceptions.map((exception, index) => (
                  <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-slate-900">{exception}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Broker Notes */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h2 className="text-slate-900 mb-4">Broker Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or comments..."
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 border border-slate-200 sticky top-6">
            <h3 className="text-slate-900 mb-4">Action Panel</h3>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-slate-700 text-sm mb-1">Request ID</p>
                <p className="text-blue-900 font-mono">PCR-001</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-700 text-sm mb-1">Shipper</p>
                <p className="text-slate-900">Global Electronics Ltd</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-700 text-sm mb-1">Product</p>
                <p className="text-slate-900">Wireless Bluetooth Headphones</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-700 text-sm mb-1">Route</p>
                <p className="text-slate-900">🇨🇳 China → 🇮🇳 India</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-slate-700 text-sm mb-2">Compliance Status</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">HS Code</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Documents</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Regulations</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Sanctions</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-3">
                <button
                  onClick={handleApprove}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve & Generate Token
                </button>

                <button
                  onClick={handleReject}
                  className="w-full px-6 py-3 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Reject with Notes
                </button>
              </div>

              <p className="text-slate-500 text-xs text-center pt-2">
                Pre-Clear Token generation is FREE for approved requests
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
