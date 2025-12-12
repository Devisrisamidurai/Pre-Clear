import { ArrowRight, Package, CheckCircle, Calendar, MapPin, Box } from 'lucide-react';
import { useState, useEffect } from 'react';
import { shipmentsStore } from '../../store/shipmentsStore';
import { getCurrencyByCountry, formatCurrency } from '../../utils/validation';

export function ShipmentBooking({ onNavigate }) {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    // Get shipments that:
    // 1. Passed AI Evaluation
    // 2. Approved by Broker
    // 3. Not yet booked (status = 'token-generated')
    const allShipments = shipmentsStore.getAllShipments();
    const bookableShipments = allShipments.filter(s => 
      s.aiApproval === 'approved' &&
      s.brokerApproval === 'approved' &&
      s.status === 'token-generated'
    );
    setShipments(bookableShipments);

    // Subscribe to updates
    const unsubscribe = shipmentsStore.subscribe(() => {
      const updated = shipmentsStore.getAllShipments();
      const bookableUpdated = updated.filter(s => 
        s.aiApproval === 'approved' &&
        s.brokerApproval === 'approved' &&
        s.status === 'token-generated'
      );
      setShipments(bookableUpdated);
    });

    return () => unsubscribe();
  }, []);

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

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Shipment Booking</h1>
        <p className="text-slate-600">Book your pre-cleared shipments with UPS</p>
      </div>

      {/* Bookable Shipments List */}
      {shipments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Box className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-900 mb-2">No Shipments Ready for Booking</h3>
          <p className="text-slate-600 mb-6">
            Shipments will appear here once they receive both AI and broker approval
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Shipments
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
                {/* Left: Status and Info */}
                <div className="lg:col-span-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-slate-900 mb-1">{shipment.productName}</h3>
                      <p className="text-slate-600 text-sm mb-2">ID: {shipment.id}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          AI Approved
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Broker Approved
                        </span>
                      </div>                        <div className="text-slate-600 text-sm">
                          <p className="mb-1">
                            <strong>Route:</strong> {shipment.shipper?.city || 'N/A'}, {shipment.shipper?.country || 'N/A'} → {shipment.consignee?.city || 'N/A'}, {shipment.consignee?.country || 'N/A'}
                          </p>
                          <p className="mb-1">
                            <strong>Weight:</strong> {shipment.weight || 'N/A'} kg
                          </p>
                                  <p className="mb-1">
                                    <strong>Value:</strong> {formatCurrency(shipment.value || 0, shipment.currency || (getCurrencyByCountry(shipment.shipper?.country || 'US') || {}).code)}
                                  </p>
                          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-slate-500 text-xs">Shipper</p>
                              <p className="text-slate-900">{shipment.shipper?.company || shipment.shipperName || 'N/A'}</p>
                              <p className="text-slate-500 text-xs">{shipment.shipper?.contactName || ''} {shipment.shipper?.email ? `• ${shipment.shipper.email}` : ''}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-xs">Consignee</p>
                              <p className="text-slate-900">{shipment.consignee?.company || 'N/A'}</p>
                              <p className="text-slate-500 text-xs">{shipment.consignee?.contactName || ''} {shipment.consignee?.email ? `• ${shipment.consignee.email}` : ''}</p>
                            </div>
                          </div>
                          {shipment.packages && shipment.packages.length > 0 && (
                            <div className="mt-3 text-sm">
                              <p className="text-slate-500 text-xs">Packages</p>
                              <p className="text-slate-900">{shipment.packages.length} package(s) — Total items: {shipment.packages.reduce((acc, p) => acc + (p.products ? p.products.reduce((a, pr) => a + (pr.qty||0), 0) : 0), 0) || 'N/A'}</p>
                            </div>
                          )}
                        </div>
                    </div>
                  </div>
                </div>

                {/* Middle: Token Info */}
                <div className="lg:col-span-3 border-l border-slate-100 lg:pl-6">
                  <p className="text-slate-500 text-sm mb-1">Pre-Clear Token</p>
                  <p className="text-slate-900 font-mono text-sm mb-3">{shipment.token}</p>
                  
                  <div className="text-slate-600 text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-3 h-3" />
                      <span>Generated: {formatDate(shipment.tokenGeneratedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>Reviewed: {formatDate(shipment.brokerReviewedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Action Button */}
                <div className="lg:col-span-3 border-l border-slate-100 lg:pl-6 flex items-center">
                  <button
                    onClick={() => onNavigate('payment', shipment)}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                  >
                    <Package className="w-5 h-5" />
                    <span>Book & Pay</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
          <h3 className="text-blue-900 mb-3">Booking Information</h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>• All listed shipments have passed both AI validation and broker approval</li>
            <li>• Pre-clear tokens ensure faster customs processing at destination</li>
            <li>• Click "Book & Pay" to proceed with final booking and payment</li>
            <li>• You'll receive tracking information immediately after payment</li>
          </ul>
        </div>
      )}
    </div>
  );
}