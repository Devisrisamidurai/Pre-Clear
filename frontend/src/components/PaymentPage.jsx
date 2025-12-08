import { CreditCard, CheckCircle, DollarSign, TrendingUp, Package, FileText, Shield, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { shipmentsStore } from '../../store/shipmentsStore';
import { getCurrencyByCountry } from '../../utils/validation';

interface PaymentPageProps {
  shipment: any;
  onNavigate: (page: string) => void;
}

export function PaymentPage({ shipment, onNavigate }: PaymentPageProps) {
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Get origin currency (all amounts shown in origin country currency)
  const originCurrency = getCurrencyByCountry(shipment?.originCountry || 'US');

  // Calculate costs (base in origin currency)
  const shipmentValue = parseFloat(shipment?.value || '0');
  const weight = parseFloat(shipment?.weight || '0');
  
  const baseShippingCost = weight * 5; // Based on weight
  const customsDuty = shipmentValue * 0.05; // 5% duty
  const importTax = shipmentValue * 0.08; // 8% tax
  const serviceCharge = 50; // Fixed service fee
  const preClearFee = 35; // Pre-Clear processing fee
  
  const total = baseShippingCost + customsDuty + importTax + serviceCharge + preClearFee;

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      shipmentsStore.completePayment(shipment.id);
      setPaymentSuccess(true);
      setTimeout(() => {
        onNavigate('dashboard');
      }, 3000);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-12 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-green-900 text-3xl mb-4">Payment Successful!</h2>
          <p className="text-green-700 text-lg mb-8">
            Your shipment has been booked and payment processed successfully.
          </p>
          <div className="bg-white rounded-lg p-6 border border-green-200 mb-6">
            <p className="text-slate-600 text-sm mb-1">Shipment ID</p>
            <p className="text-slate-900 text-xl">{shipment?.id}</p>
            <p className="text-slate-600 text-sm mt-4 mb-1">Booking Reference</p>
            <p className="text-slate-900 text-xl">BK-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
          <p className="text-slate-600 text-sm">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Payment & Booking</h1>
        <p className="text-slate-600">Complete payment to confirm your shipment booking</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipment Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipment Details */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-slate-900 mb-4">Shipment Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600 text-sm">Shipment ID</span>
                <span className="text-slate-900">{shipment?.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600 text-sm">Product</span>
                <span className="text-slate-900">{shipment?.productName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600 text-sm">Route</span>
                <span className="text-slate-900">{shipment?.originCity}, {shipment?.originCountry} → {shipment?.destCity}, {shipment?.destCountry}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600 text-sm">Weight</span>
                <span className="text-slate-900">{shipment?.weight} kg</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600 text-sm">Declared Value</span>
                <span className="text-slate-900">${parseFloat(shipment?.value).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600 text-sm">Pre-Clear Token</span>
                <span className="text-green-700 font-mono text-sm">{shipment?.token}</span>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-slate-900 mb-4">Itemized Cost Breakdown</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-slate-900 text-sm">Shipping Cost</p>
                    <p className="text-slate-500 text-xs">{weight} kg × $5/kg</p>
                  </div>
                </div>
                <span className="text-slate-900">${baseShippingCost.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-slate-900 text-sm">Customs Duty</p>
                    <p className="text-slate-500 text-xs">5% of declared value</p>
                  </div>
                </div>
                <span className="text-slate-900">${customsDuty.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-slate-900 text-sm">Import Tax</p>
                    <p className="text-slate-500 text-xs">8% of declared value</p>
                  </div>
                </div>
                <span className="text-slate-900">${importTax.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-slate-900 text-sm">Pre-Clear Processing Fee</p>
                    <p className="text-slate-500 text-xs">AI + Broker validation</p>
                  </div>
                </div>
                <span className="text-slate-900">${preClearFee.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-slate-900 text-sm">Service Charge</p>
                    <p className="text-slate-500 text-xs">Handling & documentation</p>
                  </div>
                </div>
                <span className="text-slate-900">${serviceCharge.toFixed(2)}</span>
              </div>
            </div>

            {/* Currency Conversion */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-700 text-sm mb-1">Total Amount (Origin Currency)</p>
                  <p className="text-slate-900 text-2xl">{originCurrency.symbol}{total.toFixed(2)} {originCurrency.code}</p>
                  <p className="text-slate-600 text-xs mt-1">Based on origin: {shipment?.originCountry}</p>
                </div>
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-slate-300">
              <span className="text-slate-900 text-lg">Total Payable</span>
              <span className="text-slate-900 text-2xl">{originCurrency.symbol}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm sticky top-6">
            <h3 className="text-slate-900 mb-6">Payment Summary</h3>
            
            <div className="mb-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 mb-4">
                <p className="text-green-700 text-sm mb-2">Amount to Pay</p>
                <p className="text-green-900 text-3xl mb-1">{originCurrency.symbol}{total.toFixed(2)}</p>
                <p className="text-green-600 text-xs">{originCurrency.code} - {originCurrency.name}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>AI validation completed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Broker approved</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Pre-Clear token issued</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Pay & Book Shipment</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 leading-relaxed">
                By proceeding with payment, you agree to UPS Pre-Clear terms and conditions. Payment is processed securely.
              </p>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 className="text-blue-900 text-sm mb-2">💡 What happens next?</h4>
            <ul className="text-blue-800 text-xs space-y-2">
              <li>• Booking confirmation email</li>
              <li>• Shipment tracking number</li>
              <li>• Estimated delivery date</li>
              <li>• Digital invoice & receipt</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}