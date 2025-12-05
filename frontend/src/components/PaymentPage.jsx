import { useState } from 'react';
import { CreditCard, Building2, Smartphone, Download, CheckCircle, Wallet } from 'lucide-react';

export function PaymentPage({ bookingData, onComplete }) {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const [billingData, setBillingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setPaymentComplete(true);
      setTimeout(() => {
        onComplete({ paymentMethod, ...billingData });
      }, 2000);
    }, 2500);
  };

  if (paymentComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-slate-900 mb-3">Payment Successful!</h1>
        <p className="text-slate-600 mb-8">Your shipment has been booked successfully</p>
        
        <div className="bg-white rounded-xl p-8 border border-slate-200 mb-6">
          <div className="mb-6">
            <p className="text-slate-600 mb-2">Transaction ID</p>
            <p className="text-slate-900 text-xl font-mono">TXN-{Date.now().toString().slice(-10)}</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg mb-6">
            <p className="text-slate-600 text-sm mb-1">Amount Paid</p>
            <p className="text-green-900 text-3xl">₹{bookingData?.pricing?.totalINR?.toFixed(2) || '0.00'}</p>
            <p className="text-slate-500 text-sm mt-1">
              (${bookingData?.pricing?.total?.toFixed(2) || '0.00'} USD)
            </p>
          </div>

          <div className="space-y-3 text-left mb-6">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-slate-700">Payment Confirmed</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-slate-700">Shipment Booked</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-slate-700">Receipt Sent to Email</span>
            </div>
          </div>
        </div>

        <p className="text-slate-500 text-sm">Redirecting to shipment confirmation...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Payment (For Shipment Booking Only)</h1>
        <p className="text-slate-600">Complete payment to confirm your shipment booking</p>
        <p className="text-orange-600 text-sm mt-2">Note: Pre-Clear Token is FREE. This payment is for shipment booking services.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipment Charges Summary */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h2 className="text-slate-900 mb-4">Shipment Charges (Converted to INR)</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Base Shipping</span>
                <span className="text-slate-900">₹{((bookingData?.pricing?.basePrice || 0) * 83.20).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Delivery Speed Charge</span>
                <span className="text-slate-900">₹{((bookingData?.pricing?.deliveryCharge || 0) * 83.20).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Customs Clearance</span>
                <span className="text-slate-900">₹{(450 * 83.20).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Insurance</span>
                <span className="text-slate-900">₹{(200 * 83.20).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between py-2 border-t border-slate-200 pt-2">
                <span className="text-slate-700">Subtotal</span>
                <span className="text-slate-900">₹{((bookingData?.pricing?.subtotal || 0) * 83.20).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-slate-600">GST (18%)</span>
                <span className="text-slate-900">₹{((bookingData?.pricing?.gst || 0) * 83.20).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between py-4 bg-blue-50 rounded-lg px-4 border-2 border-blue-200">
                <span className="text-slate-900">Final Amount (INR)</span>
                <span className="text-blue-900 text-2xl">₹{bookingData?.pricing?.totalINR?.toFixed(2) || '0.00'}</span>
              </div>
              
              <div className="text-center text-slate-500 text-sm">
                ≈ ${bookingData?.pricing?.total?.toFixed(2) || '0.00'} USD (1 USD = ₹83.20)
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h2 className="text-slate-900 mb-4">Billing Address</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={billingData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={billingData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={billingData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={billingData.address}
                  onChange={handleChange}
                  placeholder="Street Address"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={billingData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={billingData.postalCode}
                    onChange={handleChange}
                    placeholder="400001"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h2 className="text-slate-900 mb-4">Payment Method</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'upi' 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Smartphone className={`w-6 h-6 mx-auto mb-2 ${
                  paymentMethod === 'upi' ? 'text-blue-600' : 'text-slate-400'
                }`} />
                <p className={`text-sm ${paymentMethod === 'upi' ? 'text-slate-900' : 'text-slate-600'}`}>
                  UPI
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'card' 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <CreditCard className={`w-6 h-6 mx-auto mb-2 ${
                  paymentMethod === 'card' ? 'text-blue-600' : 'text-slate-400'
                }`} />
                <p className={`text-sm ${paymentMethod === 'card' ? 'text-slate-900' : 'text-slate-600'}`}>
                  Card
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'netbanking' 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Building2 className={`w-6 h-6 mx-auto mb-2 ${
                  paymentMethod === 'netbanking' ? 'text-blue-600' : 'text-slate-400'
                }`} />
                <p className={`text-sm ${paymentMethod === 'netbanking' ? 'text-slate-900' : 'text-slate-600'}`}>
                  Net Banking
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'wallet' 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Wallet className={`w-6 h-6 mx-auto mb-2 ${
                  paymentMethod === 'wallet' ? 'text-blue-600' : 'text-slate-400'
                }`} />
                <p className={`text-sm ${paymentMethod === 'wallet' ? 'text-slate-900' : 'text-slate-600'}`}>
                  Wallets
                </p>
              </button>
            </div>

            {/* UPI Payment */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 mb-2">UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-slate-500 text-sm">Supported: Google Pay, PhonePe, Paytm, etc.</p>
              </div>
            )}

            {/* Card Payment */}
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-slate-700 mb-2">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking */}
            {paymentMethod === 'netbanking' && (
              <div>
                <label className="block text-slate-700 mb-2">Select Bank</label>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {/* Wallets */}
            {paymentMethod === 'wallet' && (
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 transition-colors">
                  <p className="text-slate-900">Paytm</p>
                </button>
                <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 transition-colors">
                  <p className="text-slate-900">PhonePe</p>
                </button>
                <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 transition-colors">
                  <p className="text-slate-900">Amazon Pay</p>
                </button>
                <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 transition-colors">
                  <p className="text-slate-900">Mobikwik</p>
                </button>
              </div>
            )}
          </div>

          {/* Confirm Button */}
          <button
            onClick={handlePayment}
            disabled={processing}
            className={`w-full py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
              !processing
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Confirm Booking - ₹{bookingData?.pricing?.totalINR?.toFixed(2) || '0.00'}
              </>
            )}
          </button>
        </div>

        {/* Side Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 border border-slate-200 sticky top-6">
            <h3 className="text-slate-900 mb-4">Booking Summary</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-slate-700 text-sm mb-1">Token ID</p>
                <p className="text-blue-900 font-mono">{bookingData?.tokenId || 'PCT-12345678'}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-700 text-sm mb-1">Carrier</p>
                <p className="text-slate-900">{bookingData?.carrier || 'DHL Express'}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-700 text-sm mb-1">Delivery Speed</p>
                <p className="text-slate-900 capitalize">{bookingData?.deliverySpeed || 'Standard'}</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Secure Payment</span>
                </div>
                <p className="text-slate-600 text-sm">256-bit SSL encryption</p>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-slate-600 text-sm mb-2">Need help?</p>
                <p className="text-slate-900">support@preclear.com</p>
                <p className="text-slate-600 text-sm">24/7 Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}