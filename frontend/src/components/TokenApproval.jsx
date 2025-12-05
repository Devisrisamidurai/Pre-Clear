import { CheckCircle, Shield, Download, Package, Sparkles } from 'lucide-react';

export function TokenApproval({ tokenData, onProceedToBooking }) {
  const tokenId = tokenData?.tokenId || `PCT-${Date.now().toString().slice(-8)}`;
  
  return (
    <div>
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-slate-900 mb-2">Pre-Clear Token Approved! 🎉</h1>
        <p className="text-slate-600">Your product has passed all customs compliance checks</p>
        <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-100 text-green-700 rounded-full">
          <Sparkles className="w-4 h-4" />
          <span>Token Generated - FREE OF CHARGE</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Token Certificate */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-blue-100 text-sm mb-2">Pre-Clear Token ID</p>
              <p className="text-4xl font-mono">{tokenId}</p>
            </div>
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Shield className="w-10 h-10" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-blue-100 text-sm mb-1">Validity Period</p>
              <p className="text-lg">30 Days</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-blue-100 text-sm mb-1">Status</p>
              <p className="text-lg">✓ Approved</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-blue-100 text-sm mb-1">Product</p>
                <p>{tokenData?.productName || 'Wireless Bluetooth Headphones'}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">HS Code</p>
                <p className="font-mono">{tokenData?.hsCode || '8518.30.20'}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">Origin</p>
                <p>🇨🇳 China</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">Destination</p>
                <p>🇮🇳 India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Token Benefits */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-slate-900 mb-4">Token Benefits & Validity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
              <p className="text-slate-900 mb-1">Compliance Passed</p>
              <p className="text-slate-600 text-sm">All customs requirements verified</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Shield className="w-8 h-8 text-blue-600 mb-3" />
              <p className="text-slate-900 mb-1">Pre-Validated</p>
              <p className="text-slate-600 text-sm">Faster clearance at customs</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Package className="w-8 h-8 text-purple-600 mb-3" />
              <p className="text-slate-900 mb-1">Ready to Ship</p>
              <p className="text-slate-600 text-sm">Use token to book shipment</p>
            </div>
          </div>
        </div>

        {/* Compliance Summary */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-slate-900 mb-4">Compliance Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-slate-700 text-sm mb-1">HS Code</p>
              <p className="text-green-700">Verified</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-slate-700 text-sm mb-1">Documents</p>
              <p className="text-green-700">Complete</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-slate-700 text-sm mb-1">Regulations</p>
              <p className="text-green-700">Compliant</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-slate-700 text-sm mb-1">Sanctions</p>
              <p className="text-green-700">Cleared</p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-slate-900 mb-2">Important: Token is FREE</h3>
              <p className="text-slate-700 mb-3">
                The Pre-Clear Token is issued at no cost. Payment will only be required when you book an actual shipment using this token.
              </p>
              <ul className="space-y-1 text-slate-600 text-sm">
                <li>• Token valid for 30 days from issuance</li>
                <li>• Use this token to book shipments with pre-verified compliance</li>
                <li>• Payment applies only to shipment booking and carrier services</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button className="flex-1 px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Download Token Certificate
          </button>
          
          <button
            onClick={onProceedToBooking}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-2xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Package className="w-5 h-5" />
            Proceed to Shipment Booking
          </button>
        </div>

        <p className="text-center text-slate-500 text-sm">
          Next Step: Book your shipment and select carrier options (Payment required for shipment booking only)
        </p>
      </div>
    </div>
  );
}
