import { CreditCard, CheckCircle, DollarSign, Package, Calendar, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { shipmentsStore } from '../../store/shipmentsStore';

// Currency conversion rates (mock data - in real app would use API)
const currencyRates = {
  'US': { symbol: '$', rate: 1, name: 'USD' },
  'CN': { symbol: '¥', rate: 7.2, name: 'CNY' },
  'IN': { symbol: '₹', rate: 83, name: 'INR' },
  'SG': { symbol: 'S$', rate: 1.35, name: 'SGD' },
  'JP': { symbol: '¥', rate: 150, name: 'JPY' },
  'GB': { symbol: '£', rate: 0.79, name: 'GBP' },
  'EU': { symbol: '€', rate: 0.92, name: 'EUR' },
};

export function PaymentList({ onNavigate }) {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    // Get shipments that:
    // 1. Passed AI + Broker approval
    // 2. Shipment booking ready (status = 'token-generated' or 'ready-for-booking')
    // 3. Payment pending or not completed
    const allShipments = shipmentsStore.getAllShipments();
    const paymentShipments = allShipments.filter(s => 
      s.aiApproval === 'approved' &&
      s.brokerApproval === 'approved' &&
      s.token &&
      (!s.paymentStatus || s.paymentStatus === 'pending')
    );
    setShipments(paymentShipments);

    // Subscribe to updates
    const unsubscribe = shipmentsStore.subscribe(() => {
      const updated = shipmentsStore.getAllShipments();
      const paymentUpdated = updated.filter(s => 
        s.aiApproval === 'approved' &&
        s.brokerApproval === 'approved' &&
        s.token &&
        (!s.paymentStatus || s.paymentStatus === 'pending')
      );
      setShipments(paymentUpdated);
    });

    return () => unsubscribe();
  }, []);

  const calculateAmount = (shipment) => {
    const weight = parseFloat(shipment.weight || '0');
    const shipmentValue = parseFloat(shipment.value || '0');
    
    const baseShippingCost = weight * 5; // $5 per kg
    const customsDuty = shipmentValue * 0.05; // 5% duty
    const importTax = shipmentValue * 0.08; // 8% tax
    const serviceCharge = 50; // Fixed service fee
    const preClearFee = 35; // Pre-Clear processing fee
    
    return baseShippingCost + customsDuty + importTax + serviceCharge + preClearFee;
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

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Payments</h1>
        <p className="text-slate-600">Complete payment for your approved shipments</p>
      </div>

      {/* Payment Shipments List */}
      {shipments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-900 mb-2">No Payments Pending</h3>
          <p className="text-slate-600 mb-6">
            Shipments ready for payment will appear here
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
          {shipments.map((shipment) => {
            const pricing = shipment.pricing;
            const totalUSD = pricing ? parseFloat(pricing.total || 0) : calculateAmount(shipment);
            const destCountryCode = shipment.consignee?.country || shipment.destCountry || 'US';
            const destCurrency = currencyRates[destCountryCode] || currencyRates['US'];
            const totalDestCurrency = totalUSD * (destCurrency.rate || 1);
            
            return (
              <div
                key={shipment.id}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Shipment Info */}
                  <div className="lg:col-span-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-slate-900 mb-1">{shipment.productName}</h3>
                        <p className="text-slate-600 text-sm mb-2">ID: {shipment.id}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Approved
                          </span>
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                            Payment Pending
                          </span>
                        </div>
                        <div className="text-slate-600 text-xs">
                          <p>Token: <span className="font-mono text-green-700">{shipment.token}</span></p>
                          <p>Route: {shipment.shipper?.city || shipment.shipperName || 'N/A'}, {shipment.shipper?.country || ''} → {shipment.consignee?.city || 'N/A'}, {shipment.consignee?.country || ''}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Amount Details */}
                  <div className="lg:col-span-4 border-l border-slate-100 lg:pl-6">
                    <p className="text-slate-500 text-sm mb-2">Payment Amount</p>
                    <div className="mb-3">
                      <p className="text-slate-900 text-2xl mb-1">${totalUSD.toFixed(2)}</p>
                      <p className="text-slate-600 text-sm">
                        ≈ {destCurrency.symbol}{totalDestCurrency.toFixed(2)} {destCurrency.name}
                      </p>
                    </div>
                    
                    {shipment.bookingDate && (
                      <div className="text-slate-600 text-xs">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>Booked: {formatDate(shipment.bookingDate)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Action Button */}
                  <div className="lg:col-span-3 border-l border-slate-100 lg:pl-6 flex items-center">
                    <button
                      onClick={() => onNavigate('payment', shipment)}
                      className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Pay Now</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Outstanding Amount Info */}
                {shipment.paymentStatus === 'pending' && shipment.paymentAmount && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <DollarSign className="w-4 h-4" />
                        <span>Outstanding Amount:</span>
                      </div>
                      <span className="text-red-700">${shipment.paymentAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Info Card */}
      {shipments.length > 0 && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-green-900 mb-3">Payment Information</h3>
          <ul className="text-green-800 text-sm space-y-2">
            <li>• Currency is automatically converted based on destination country</li>
            <li>• All payments are processed securely through our payment gateway</li>
            <li>• You'll receive an invoice and receipt after successful payment</li>
            <li>• Tracking information will be sent via email once payment is completed</li>
          </ul>
        </div>
      )}
    </div>
  );
}
