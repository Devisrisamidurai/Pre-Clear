import { useState, useEffect } from 'react';
import { MapPin, Package, Truck, Clock, DollarSign, Info } from 'lucide-react';

const carriers = [
  { id: 'dhl', name: 'DHL Express', logo: '📦', basePrice: 2500, estimatedDays: '3-5' },
  { id: 'fedex', name: 'FedEx International', logo: '🚚', basePrice: 2300, estimatedDays: '4-6' },
  { id: 'ups', name: 'UPS Worldwide', logo: '📮', basePrice: 2400, estimatedDays: '4-7' },
  { id: 'bluedart', name: 'Blue Dart', logo: '✈️', basePrice: 1800, estimatedDays: '5-8' },
];

const deliveryOptions = [
  { id: 'express', name: 'Express Delivery', multiplier: 1.5, days: '3-5' },
  { id: 'standard', name: 'Standard Delivery', multiplier: 1.0, days: '5-8' },
  { id: 'economy', name: 'Economy Delivery', multiplier: 0.8, days: '8-12' },
];

export function ShipmentBooking({ tokenData, onSubmit }) {
  const [formData, setFormData] = useState({
    pickupAddress: '',
    pickupCity: '',
    pickupPostal: '',
    pickupCountry: 'CN',
    destAddress: '',
    destCity: '',
    destPostal: '',
    destCountry: 'IN',
    length: '',
    width: '',
    height: '',
    weight: '',
    carrier: '',
    deliverySpeed: 'standard'
  });

  const [pricing, setPricing] = useState({
    basePrice: 0,
    deliveryCharge: 0,
    customsClearance: 450,
    insurance: 200,
    subtotal: 0,
    gst: 0,
    total: 0,
    totalINR: 0
  });

  const INR_RATE = 83.20; // 1 USD = 83.20 INR

  useEffect(() => {
    if (formData.carrier && formData.deliverySpeed) {
      const carrier = carriers.find(c => c.id === formData.carrier);
      const delivery = deliveryOptions.find(d => d.id === formData.deliverySpeed);
      
      if (carrier && delivery) {
        const basePrice = carrier.basePrice;
        const deliveryCharge = basePrice * delivery.multiplier;
        const subtotal = basePrice + deliveryCharge + pricing.customsClearance + pricing.insurance;
        const gst = subtotal * 0.18; // 18% GST
        const total = subtotal + gst;
        const totalINR = total * INR_RATE;

        setPricing({
          ...pricing,
          basePrice,
          deliveryCharge,
          subtotal,
          gst,
          total,
          totalINR
        });
      }
    }
  }, [formData.carrier, formData.deliverySpeed]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      pricing,
      tokenId: tokenData?.tokenId
    });
  };

  const isFormValid = formData.pickupAddress && 
    formData.destAddress && 
    formData.length && 
    formData.weight && 
    formData.carrier;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Shipment Booking</h1>
        <p className="text-slate-600">Book your shipment using Pre-Clear Token: {tokenData?.tokenId}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pickup Address */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h2 className="text-slate-900">Pickup Address (Expanded, Detailed)</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 mb-2">Full Pickup Address *</label>
                  <input
                    type="text"
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleChange}
                    placeholder="Building No., Street Name, Area"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="pickupCity"
                      value={formData.pickupCity}
                      onChange={handleChange}
                      placeholder="Shenzhen"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2">Postal Code *</label>
                    <input
                      type="text"
                      name="pickupPostal"
                      value={formData.pickupPostal}
                      onChange={handleChange}
                      placeholder="518000"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">Country</label>
                  <input
                    type="text"
                    value="🇨🇳 China"
                    disabled
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Destination Address */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-green-600" />
                <h2 className="text-slate-900">Destination Address (Expanded, Detailed)</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 mb-2">Full Delivery Address *</label>
                  <input
                    type="text"
                    name="destAddress"
                    value={formData.destAddress}
                    onChange={handleChange}
                    placeholder="Flat/House No., Street Name, Locality"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="destCity"
                      value={formData.destCity}
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
                      name="destPostal"
                      value={formData.destPostal}
                      onChange={handleChange}
                      placeholder="400001"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">Country</label>
                  <input
                    type="text"
                    value="🇮🇳 India"
                    disabled
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Package Dimensions */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-purple-600" />
                <h2 className="text-slate-900">Package Dimensions</h2>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-700 mb-2">Length (cm) *</label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleChange}
                    placeholder="30"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">Width (cm) *</label>
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleChange}
                    placeholder="20"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">Height (cm) *</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="15"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">Weight (kg) *</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="5"
                    step="0.1"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Carrier Options */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-orange-600" />
                <h2 className="text-slate-900">Carrier Options</h2>
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
                          <p className="text-slate-900">{carrier.name}</p>
                          <p className="text-slate-500 text-sm">{carrier.estimatedDays} days</p>
                        </div>
                      </div>
                      <p className="text-slate-900">₹{(carrier.basePrice * INR_RATE).toFixed(0)}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Delivery Speed */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-green-600" />
                <h2 className="text-slate-900">Delivery Speed Choices</h2>
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
                        <p className="text-slate-900">{option.name}</p>
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                isFormValid
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              Proceed to Payment
            </button>
          </form>
        </div>

        {/* Price Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 sticky top-6 p-6">
            <h3 className="text-slate-900 mb-4">Price Summary</h3>

            {formData.carrier ? (
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

                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Insurance</span>
                  <span className="text-slate-900">${pricing.insurance}</span>
                </div>

                <div className="flex justify-between py-2 border-t border-slate-200 pt-2">
                  <span className="text-slate-600">Subtotal (USD)</span>
                  <span className="text-slate-900">${pricing.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-slate-600">GST (18%)</span>
                  <span className="text-slate-900">${pricing.gst.toFixed(2)}</span>
                </div>

                <div className="flex justify-between py-3 border-t border-slate-200 pt-3">
                  <span className="text-slate-900">Total (USD)</span>
                  <span className="text-slate-900 text-xl">${pricing.total.toFixed(2)}</span>
                </div>

                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-2 border-orange-200">
                  <div className="flex items-start gap-2 mb-2">
                    <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-700 mb-1">Converted to INR</p>
                      <p className="text-orange-900 text-2xl">₹{pricing.totalINR.toFixed(2)}</p>
                      <p className="text-slate-500 text-xs mt-1">Exchange Rate: 1 USD = ₹{INR_RATE}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-900 text-sm">
                    💡 Real-time INR conversion applied
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Select a carrier to see pricing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
