import { Shield, Download, CheckCircle, Calendar, MapPin, Package, ArrowRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function ShipmentToken({ shipment, onNavigate }) {
  const [copied, setCopied] = useState(false);
  
  const token = shipment?.token || `UPS-PCT-${Date.now().toString().slice(-8)}`;
  const tokenGeneratedDate = new Date().toLocaleDateString();
  const tokenExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Success Animation Header */}
      <div className="mb-8 text-center">
        <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
          <Shield className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-slate-900 mb-3">Pre-Clear Token Generated! 🎉</h1>
        <p className="text-slate-600 text-lg">Your shipment has received dual approval (AI + Broker)</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Token Certificate */}
        <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-yellow-600 rounded-2xl p-1 shadow-2xl">
          <div className="bg-white rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-slate-600 text-sm mb-2">UPS Pre-Clear Token</p>
                <div className="flex items-center gap-3">
                  <p className="text-slate-900 text-3xl font-mono">{token}</p>
                  <button
                    onClick={handleCopyToken}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Copy token"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-600 text-sm mb-1">Generated Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <p className="text-slate-900">{tokenGeneratedDate}</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-600 text-sm mb-1">Expiry Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <p className="text-slate-900">{tokenExpiryDate}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-slate-900 mb-4">Approved Shipment Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-600 text-sm mb-1">Shipment ID</p>
                  <p className="text-slate-900">{shipment?.id || 'SHP-001'}</p>
                </div>
                <div>
                  <p className="text-slate-600 text-sm mb-1">Product</p>
                  <p className="text-slate-900">{shipment?.productName || 'Electronic Components'}</p>
                </div>
                <div>
                  <p className="text-slate-600 text-sm mb-1">HS Code</p>
                  <p className="text-slate-900 font-mono">8541.10.00</p>
                </div>
                <div>
                  <p className="text-slate-600 text-sm mb-1">Route</p>
                  <p className="text-slate-900">🇨🇳 CN → 🇺🇸 US</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Approval Status */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-slate-900 mb-6">Approval Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-green-50 rounded-xl border-2 border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-slate-900">AI Approval</h4>
                  <p className="text-green-700 text-sm">Approved - 94% Confidence</p>
                </div>
              </div>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>✓ HS Code Classification</li>
                <li>✓ Document Completeness</li>
                <li>✓ Sanctions Screening</li>
                <li>✓ Tariff Compliance</li>
              </ul>
            </div>

            <div className="p-6 bg-green-50 rounded-xl border-2 border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-slate-900">Broker Approval</h4>
                  <p className="text-green-700 text-sm">Approved by John Smith</p>
                </div>
              </div>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>✓ All documents verified</li>
                <li>✓ Regulatory compliance confirmed</li>
                <li>✓ Value declaration accepted</li>
                <li>✓ Pre-clearance granted</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Token Benefits */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
          <h3 className="text-slate-900 text-xl mb-6">What This Token Enables</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-slate-900 mb-1">Pre-Cleared Status</h4>
                <p className="text-slate-600 text-sm">Faster customs processing at destination</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-slate-900 mb-1">Booking Ready</h4>
                <p className="text-slate-600 text-sm">Use token to book shipment with UPS</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-slate-900 mb-1">Compliance Verified</h4>
                <p className="text-slate-600 text-sm">Dual approval ensures full compliance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Calendar className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-slate-900 mb-2">Important: Token Validity</h3>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li>• This token is valid for 30 days from {tokenGeneratedDate}</li>
                <li>• Token expires on {tokenExpiryDate}</li>
                <li>• Use this token to book your shipment before expiry</li>
                <li>• Token is non-transferable and linked to this specific shipment</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Download Options */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-slate-900 mb-4">Download Token Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
              <Download className="w-6 h-6 text-slate-600 mb-2" />
              <p className="text-slate-900">Token Certificate</p>
              <p className="text-slate-500 text-sm">PDF format</p>
            </button>

            <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
              <Download className="w-6 h-6 text-slate-600 mb-2" />
              <p className="text-slate-900">Approval Documents</p>
              <p className="text-slate-500 text-sm">All compliance docs</p>
            </button>

            <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
              <Download className="w-6 h-6 text-slate-600 mb-2" />
              <p className="text-slate-900">Customs Forms</p>
              <p className="text-slate-500 text-sm">Pre-filled forms</p>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => onNavigate('booking', { ...shipment, token })}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-lg group"
          >
            <Package className="w-6 h-6" />
            <span>Book Shipment with This Token</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Support */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <p className="text-slate-700 mb-2">Need help or have questions about your token?</p>
          <button
            onClick={() => onNavigate('chat')}
            className="text-blue-600 hover:underline"
          >
            Contact Support or Chat with Broker
          </button>
        </div>
      </div>
    </div>
  );
}