import { useState, useEffect } from 'react';
import { MapPin, Package, Truck, Clock, DollarSign, Info, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { shipmentsStore } from '../../store/shipmentsStore';

const carriers = [
  { id: 'ups', name: 'UPS Worldwide', logo: '📮', basePrice: 2400, estimatedDays: '4-7' },
  { id: 'dhl', name: 'DHL Express', logo: '📦', basePrice: 2500, estimatedDays: '3-5' },
  { id: 'fedex', name: 'FedEx International', logo: '🚚', basePrice: 2300, estimatedDays: '4-6' },
  { id: 'bluedart', name: 'Blue Dart', logo: '✈️', basePrice: 1800, estimatedDays: '5-8' },
];

const deliveryOptions = [
  { id: 'express', name: 'Express Delivery', multiplier: 1.5, days: '3-5' },
  { id: 'standard', name: 'Standard Delivery', multiplier: 1.0, days: '5-8' },
  { id: 'economy', name: 'Economy Delivery', multiplier: 0.8, days: '8-12' },
];

export function ShipmentBooking({ shipment, onNavigate }) {
  const [formData, setFormData] = useState({
    carrier: 'ups',
    deliverySpeed: 'standard'
  });

  const [pricing, setPricing] = useState({
    basePrice: 2400,
    deliveryCharge: 0,
    customsClearance: 450,
    insurance: 200,
    subtotal: 0,
    gst: 0,
    total: 0,
  });

  const INR_RATE = 83.20;

  // Calculate pricing when carrier or delivery speed changes
  useEffect(() => {
    if (formData.carrier && formData.deliverySpeed) {
      const carrier = carriers.find(c => c.id === formData.carrier);
      const delivery = deliveryOptions.find(d => d.id === formData.deliverySpeed);
      
      if (carrier && delivery) {
        const basePrice = carrier.basePrice;
        const deliveryCharge = basePrice * delivery.multiplier;
        const subtotal = basePrice + deliveryCharge + pricing.customsClearance + (shipment.insuranceRequired ? pricing.insurance : 0);
        const gst = subtotal * 0.18;
        const total = subtotal + gst;

        setPricing({
          ...pricing,
          basePrice,
          deliveryCharge,
          subtotal,
          gst,
          total
        });
      }
    }
  }, [formData.carrier, formData.deliverySpeed]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Check COD eligibility
  const checkCODEligibility = () => {
    if (!shipment) return { eligible: false, reason: 'Shipment not found' };
    
    const isCODPayment = shipment.paymentTiming === 'COD';
    const isRoadOrCourier = ['Road', 'Courier'].includes(shipment.mode);
    const isDomestic = shipment.shipmentType === 'Domestic';
    const noDangerousGoods = !shipment.dangerousGoods;

    if (!isCODPayment) {
      return { eligible: false, reason: 'Payment timing must be COD' };
    }
    if (!isRoadOrCourier) {
      return { eligible: false, reason: 'COD only available for Road/Courier modes' };
    }
    if (!isDomestic) {
      return { eligible: false, reason: 'COD only available for domestic shipments' };
    }
    if (!noDangerousGoods) {
      return { eligible: false, reason: 'Dangerous goods not allowed with COD' };
    }

    return { eligible: true, reason: 'Eligible for COD' };
  };

  // Check booking eligibility
  const isBookingEligible = () => {
    return (
      shipment &&
      shipment.aiComplianceStatus === 'cleared' &&
      shipment.brokerReviewStatus === 'approved' &&
      shipment.status === 'token-generated' &&
      shipment.token !== null &&
      shipment.bookingStatus !== 'booked'
    );
  };

  // Check if booking button should be disabled
  const isBookingDisabled = () => {
    return (
      shipment.bookingStatus === 'booked' ||
      (shipment.paymentStatus === 'paid' && shipment.bookingStatus === 'booked') ||
      !shipment.token
    );
  };

  const handleBookingClick = () => {
    if (!isBookingEligible()) return;

    const codEligibility = checkCODEligibility();
    
    // Build payment context
    const paymentContext = {
      mode: shipment.mode,
      shipmentType: shipment.shipmentType,
      billTo: shipment.billTo,
      paymentTiming: shipment.paymentTiming,
      paymentStatus: shipment.paymentStatus,
      serviceLevel: shipment.serviceLevel,
      value: shipment.value,
      codAllowed: codEligibility.eligible,
      selectedCarrier: formData.carrier,
      selectedDeliverySpeed: formData.deliverySpeed,
      pricing
    };

    // Navigate based on payment scenario
    if (shipment.billTo === 'Consignee' && shipment.paymentTiming !== 'COD') {
      onNavigate('request-payment', { ...shipment, paymentContext });
    } else {
      onNavigate('payment', { ...shipment, paymentContext });
    }
  };

  if (!shipment) {
    return (
      <div className="p-8 bg-red-50 rounded-xl border border-red-200">
        <p className="text-red-800">Shipment not found</p>
      </div>
    );
  }

  const codEligibility = checkCODEligibility();
  const bookingEligible = isBookingEligible();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Shipment Booking</h1>
        <p className="text-slate-600">Book your pre-cleared shipment with token: {shipment.token}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Booking Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipment Summary Card */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h2 className="text-slate-900 mb-6 text-lg font-semibold">Shipment Details Summary</h2>
            
            {/* Grid Layout for Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-slate-600 text-sm">Shipment ID</label>
                  <p className="text-slate-900 font-mono">{shipment.id}</p>
                </div>
                <div>
                  <label className="text-slate-600 text-sm">Title</label>
                  <p className="text-slate-900">{shipment.title}</p>
                </div>
                <div>
                  <label className="text-slate-600 text-sm">Reference ID</label>
                  <p className="text-slate-900 font-mono">{shipment.referenceId}</p>
                </div>
              </div>

              {/* Mode & Type */}
              <div className="space-y-4">
                <div>
                  <label className="text-slate-600 text-sm">Mode</label>
                  <p className="text-slate-900 font-semibold">{shipment.mode}</p>
                </div>
                <div>
                  <label className="text-slate-600 text-sm">Shipment Type</label>
                  <p className="text-slate-900">{shipment.shipmentType}</p>
                </div>
                <div>
                  <label className="text-slate-600 text-sm">Service Level</label>
                  <p className="text-slate-900">{shipment.serviceLevel}</p>
                </div>
              </div>

              {/* Billing & Payment */}
              <div className="space-y-4">
                <div>
                  <label className="text-slate-600 text-sm">Incoterm</label>
                  <p className="text-slate-900">{shipment.incoterm}</p>
                </div>
                <div>
                  <label className="text-slate-600 text-sm">Bill To</label>
                  <p className="text-slate-900">{shipment.billTo}</p>
                </div>
                <div>
                  <label className="text-slate-600 text-sm">Payment Timing</label>
                  <p className="text-slate-900">{shipment.paymentTiming}</p>
                </div>
              </div>

              {/* Value & Weight */}
              <div className="space-y-4">
                <div>
                  <label className="text-slate-600 text-sm">Declared Value</label>
                  <p className="text-slate-900 text-lg font-semibold">{shipment.currency} {shipment.declaredValue.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-slate-600 text-sm">Total Weight</label>
                  <p className="text-slate-900">{shipment.totalWeight} kg</p>
                </div>
                <div>
                  <label className="text-slate-600 text-sm">Estimated Duty & Tax</label>
                  <p className="text-slate-900">{shipment.currency} {shipment.estimatedDutyTax.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Compliance & Risk Section */}
            <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Risk & Compliance */}
              <div className="space-y-4">
                <div>
                  <label className="text-slate-600 text-sm">Risk Level</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-3 h-3 rounded-full ${
                      shipment.riskLevel === 'low' ? 'bg-green-500' :
                      shipment.riskLevel === 'medium' ? 'bg-yellow-500' :
                      shipment.riskLevel === 'high' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`} />
                    <span className="text-slate-900 capitalize">{shipment.riskLevel}</span>
                  </div>
                </div>
                <div>
                  <label className="text-slate-600 text-sm">AI Compliance Score</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-600 rounded-full"
                        style={{ width: `${shipment.aiComplianceScore}%` }}
                      />
                    </div>
                    <span className="text-slate-900 font-semibold">{shipment.aiComplianceScore}%</span>
                  </div>
                </div>
              </div>

              {/* Flags & Status */}
              <div className="space-y-4">
                <div>
                  <label className="text-slate-600 text-sm">Compliance Flags</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {shipment.dangerousGoods && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">Dangerous Goods</span>
                    )}
                    {shipment.lithiumBattery && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Lithium Battery</span>
                    )}
                    {shipment.temperatureControlled && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Temperature Controlled</span>
                    )}
                    {shipment.restrictedFlag && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">Restricted Item</span>
                    )}
                    {!shipment.dangerousGoods && !shipment.lithiumBattery && !shipment.temperatureControlled && !shipment.restrictedFlag && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">✓ No Special Flags</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-slate-600 text-sm">Broker Review Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-slate-900 capitalize">{shipment.brokerReviewStatus}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carrier Selection */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5 text-orange-600" />
              <h2 className="text-slate-900">Select Carrier</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {carriers.map((carrier) => (
                <label
                  key={carrier.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.carrier === carrier.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="carrier"
                    value={carrier.id}
                    checked={formData.carrier === carrier.id}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{carrier.logo}</span>
                      <div>
                        <p className="text-slate-900 font-semibold">{carrier.name}</p>
                        <p className="text-slate-500 text-sm">{carrier.estimatedDays} days</p>
                      </div>
                    </div>
                    <p className="text-slate-900 font-semibold">${carrier.basePrice}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Delivery Speed */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-green-600" />
              <h2 className="text-slate-900">Delivery Speed</h2>
            </div>

            <div className="space-y-3">
              {deliveryOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.deliverySpeed === option.id
                      ? 'border-green-600 bg-green-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="deliverySpeed"
                      value={option.id}
                      checked={formData.deliverySpeed === option.id}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600"
                    />
                    <div>
                      <p className="text-slate-900 font-semibold">{option.name}</p>
                      <p className="text-slate-500 text-sm">{option.days} business days</p>
                    </div>
                  </div>
                  <p className="text-slate-600">
                    {option.multiplier === 1 ? 'Standard' : option.multiplier > 1 ? `+${((option.multiplier - 1) * 100).toFixed(0)}%` : `-${((1 - option.multiplier) * 100).toFixed(0)}%`}
                  </p>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Method & COD Info */}
          {shipment.paymentTiming === 'COD' && (
            <div className={`rounded-xl p-6 border-2 ${
              codEligibility.eligible
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {codEligibility.eligible ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className={`font-semibold mb-1 ${codEligibility.eligible ? 'text-green-900' : 'text-red-900'}`}>
                    Cash on Delivery (COD)
                  </h3>
                  <p className={codEligibility.eligible ? 'text-green-700 text-sm' : 'text-red-700 text-sm'}>
                    {codEligibility.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Booking Eligibility Alert */}
          {!bookingEligible && (
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-yellow-900 font-semibold mb-1">Cannot Book This Shipment</h3>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    {shipment.aiComplianceStatus !== 'cleared' && (
                      <li>• AI compliance check: {shipment.aiComplianceStatus}</li>
                    )}
                    {shipment.brokerReviewStatus !== 'approved' && (
                      <li>• Broker review status: {shipment.brokerReviewStatus}</li>
                    )}
                    {shipment.status !== 'token-generated' && (
                      <li>• Shipment status: {shipment.status}</li>
                    )}
                    {!shipment.token && (
                      <li>• No pre-clearance token generated</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Booking Button */}
          <button
            onClick={handleBookingClick}
            disabled={isBookingDisabled() || !bookingEligible}
            className={`w-full py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-lg font-semibold ${
              !isBookingDisabled() && bookingEligible
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Package className="w-5 h-5" />
            {shipment.bookingStatus === 'booked' ? 'Already Booked' : 'Proceed to Payment'}
          </button>
        </div>

        {/* Price Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 sticky top-6 p-6">
            <h3 className="text-slate-900 mb-4 font-semibold">Price Summary</h3>

            <div className="space-y-4">
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Base Shipping</span>
                <span className="text-slate-900">${pricing.basePrice}</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-slate-600">Delivery Speed</span>
                <span className="text-slate-900">${pricing.deliveryCharge.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-slate-600">Customs Clearance</span>
                <span className="text-slate-900">${pricing.customsClearance}</span>
              </div>

              {shipment.insuranceRequired && (
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Insurance</span>
                  <span className="text-slate-900">${pricing.insurance}</span>
                </div>
              )}

              <div className="flex justify-between py-2 border-t border-slate-200 pt-2">
                <span className="text-slate-600">Subtotal</span>
                <span className="text-slate-900">${pricing.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-slate-600">GST (18%)</span>
                <span className="text-slate-900">${pricing.gst.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-3 border-t border-slate-200 pt-3">
                <span className="text-slate-900 font-semibold">Total</span>
                <span className="text-slate-900 text-2xl font-bold">${pricing.total.toFixed(2)}</span>
              </div>

              {shipment.estimatedDutyTax > 0 && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 mt-4">
                  <p className="text-slate-700 text-sm mb-1">Est. Customs Duty/Tax</p>
                  <p className="text-orange-900 text-xl font-semibold">${shipment.estimatedDutyTax.toLocaleString()}</p>
                  <p className="text-slate-500 text-xs mt-1">Additional cost at customs</p>
                </div>
              )}

              <div className="p-4 bg-blue-50 rounded-lg mt-4">
                <p className="text-blue-900 text-sm">
                  💡 Token valid for: {shipment.token}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
