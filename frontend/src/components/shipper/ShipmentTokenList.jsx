import { Shield, CheckCircle, Calendar, Package, Copy, Check, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { shipmentsStore } from '../../store/shipmentsStore';

export function ShipmentTokenList({ onNavigate }) {
  const [shipments, setShipments] = useState([]);
  const [copiedToken, setCopiedToken] = useState(null);

  useEffect(() => {
    // Get all shipments with generated tokens
    const allShipments = shipmentsStore.getAllShipments();
    const tokensShipments = allShipments.filter(s => s.token && s.status === 'token-generated');
    setShipments(tokensShipments);

    // Subscribe to updates
    const unsubscribe = shipmentsStore.subscribe(() => {
      const updated = shipmentsStore.getAllShipments();
      const tokensUpdated = updated.filter(s => s.token && s.status === 'token-generated');
      setShipments(tokensUpdated);
    });

    return () => unsubscribe();
  }, []);

  const handleCopyToken = (token) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    const num = parseFloat(amount) || 0;
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(num);
    } catch (e) {
      return `${num.toLocaleString()} ${currency}`;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Shipment Tokens</h1>
        <p className="text-slate-600">All generated pre-clearance tokens for your approved shipments</p>
      </div>

      {/* Tokens List */}
      {shipments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-900 mb-2">No Tokens Generated Yet</h3>
          <p className="text-slate-600 mb-6">
            Tokens will appear here once your shipments receive both AI and broker approval
          </p>
          <button
            onClick={() => onNavigate('create-shipment')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Shipment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {shipments.map((shipment) => (
            <div
              key={shipment.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Token and Status */}
                <div className="lg:col-span-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-slate-900">Token Value</p>
                        <button
                          onClick={() => handleCopyToken(shipment.token)}
                          className="p-1 hover:bg-slate-100 rounded transition-colors"
                          title="Copy token"
                        >
                          {copiedToken === shipment.token ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-slate-900 font-mono text-lg mb-3">{shipment.token}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          AI Approved
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                          Broker Approved
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle: Shipment Details */}
                <div className="lg:col-span-4 border-l border-slate-100 lg:pl-6">
                  <p className="text-slate-500 text-sm mb-1">Shipment Details</p>
                  <p className="text-slate-900 mb-2">{shipment.productName}</p>
                  <p className="text-slate-600 text-sm mb-1">
                    <strong>ID:</strong> {shipment.id}
                  </p>
                  <p className="text-slate-600 text-sm mb-1">
                    <strong>Route:</strong> {shipment.shipper?.city || 'N/A'}, {shipment.shipper?.country || 'N/A'} → {shipment.consignee?.city || 'N/A'}, {shipment.consignee?.country || 'N/A'}
                  </p>
                  <p className="text-slate-600 text-sm mb-1">
                    <strong>Weight:</strong> {shipment.weight || 'N/A'} kg
                  </p>
                  <p className="text-slate-600 text-sm mb-1">
                    <strong>Value:</strong> {formatCurrency(shipment.value || 0, shipment.currency)}
                  </p>
                  <div className="mt-2 text-sm text-slate-600">
                    <p><strong>Shipper:</strong> {shipment.shipper?.company || shipment.shipperName || 'N/A'}</p>
                    <p><strong>Consignee:</strong> {shipment.consignee?.company || 'N/A'}</p>
                    {shipment.packages && shipment.packages.length > 0 && (
                      <p><strong>Packages:</strong> {shipment.packages.length} ({shipment.packages.map((p,i)=> p.type? p.type : `Pkg ${i+1}`).join(', ')})</p>
                    )}
                  </div>
                </div>

                {/* Right: Dates and Actions */}
                <div className="lg:col-span-3 border-l border-slate-100 lg:pl-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-slate-600 text-sm mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>Token Generated</span>
                    </div>
                    <p className="text-slate-900 text-sm">{formatDate(shipment.tokenGeneratedAt)}</p>
                  </div>
                  
                  <button
                    onClick={() => onNavigate('shipment-details', shipment)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Card */}
      {shipments.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-blue-900 mb-3">About Your Tokens</h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>• Each token is unique and linked to a specific shipment</li>
            <li>• Tokens are valid for 30 days from the generation date</li>
            <li>• Use your token to book shipments and proceed with payment</li>
            <li>• Tokens indicate that your shipment has been pre-cleared for customs</li>
          </ul>
        </div>
      )}
    </div>
  );
}