import { CheckCircle, XCircle, FileText, MessageSquare } from 'lucide-react';

export function DocumentReview({ shipment, onNavigate }) {
  const handleApprove = () => {
    alert('Shipment approved! Token will be generated.');
    onNavigate('dashboard');
  };

  const handleDeny = () => {
    alert('Shipment denied. Shipper will be notified.');
    onNavigate('dashboard');
  };

  const handleRequestDocs = () => {
    onNavigate('request-documents');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Document Review</h1>
        <p className="text-slate-600">Review shipment {shipment?.id || 'SHP-002'} for final approval</p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* AI Results */}
        <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-green-900">AI Approval Received</h3>
              <p className="text-green-700 text-sm">Confidence: {shipment?.aiScore || 96}%</p>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-slate-900 mb-4">Uploaded Documents</h3>
          <div className="space-y-3">
            {['Commercial Invoice', 'Packing List', 'Certificate of Origin', 'Product Images'].map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-900">{doc}</span>
                </div>
                <button className="text-blue-600 hover:underline text-sm">View</button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleApprove}
            className="p-6 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all text-center"
          >
            <CheckCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-lg">Approve</p>
          </button>

          <button
            onClick={handleDeny}
            className="p-6 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all text-center"
          >
            <XCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-lg">Deny</p>
          </button>

          <button
            onClick={handleRequestDocs}
            className="p-6 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all text-center"
          >
            <MessageSquare className="w-8 h-8 mx-auto mb-2" />
            <p className="text-lg">Request Documents</p>
          </button>
        </div>
      </div>
    </div>
  );
}

