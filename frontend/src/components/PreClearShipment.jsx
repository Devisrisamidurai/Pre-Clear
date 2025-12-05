import { useState, useEffect } from 'react';
import { Package, DollarSign, Info } from 'lucide-react';

interface PreClearShipmentProps {
  onSubmit: (data: any) => void;
}

const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', rate: 1.0 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', rate: 0.79 },
  { code: 'EU', name: 'European Union', flag: '🇪🇺', currency: 'EUR', rate: 0.92 },
  { code: 'CN', name: 'China', flag: '🇨🇳', currency: 'CNY', rate: 7.24 },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', currency: 'JPY', rate: 149.50 },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', currency: 'SGD', rate: 1.34 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', rate: 1.36 },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD', rate: 1.53 },
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', rate: 83.20 },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', currency: 'BRL', rate: 4.93 },
];

export function PreClearShipment({ onSubmit }: PreClearShipmentProps) {
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    quantity: '',
    weight: '',
    declaredValue: '',
    originCountry: '',
    destinationCountry: '',
  });

  const [convertedValue, setConvertedValue] = useState(0);
  const [destinationCurrency, setDestinationCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1.0);

  useEffect(() => {
    if (formData.destinationCountry && formData.declaredValue) {
      const country = countries.find(c => c.code === formData.destinationCountry);
      if (country) {
        setDestinationCurrency(country.currency);
        setExchangeRate(country.rate);
        setConvertedValue(parseFloat(formData.declaredValue) * country.rate);
      }
    }
  }, [formData.destinationCountry, formData.declaredValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      convertedValue,
      destinationCurrency,
      exchangeRate
    });
  };

  const isFormValid = formData.productName && 
    formData.productDescription && 
    formData.quantity && 
    formData.weight && 
    formData.declaredValue && 
    formData.originCountry && 
    formData.destinationCountry;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Pre-Clear Shipment Creation</h1>
        <p className="text-slate-600">Create a new shipment for AI-powered compliance verification</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-slate-700" />
              <h2 className="text-slate-900">Shipment Details</h2>
            </div>

            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-slate-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="e.g., Wireless Bluetooth Headphones"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-slate-700 mb-2">
                  Product Description (for NLP Analysis) <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleInputChange}
                  placeholder="Detailed description for AI analysis. Include materials, components, usage, features..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-slate-500 text-sm mt-2">
                  Detailed descriptions help our AI predict accurate HS codes and identify compliance requirements
                </p>
              </div>

              {/* Quantity and Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="100"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-2">
                    Weight (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="25.5"
                    step="0.01"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Declared Value */}
              <div>
                <label className="block text-slate-700 mb-2">
                  Declared Value (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    name="declaredValue"
                    value={formData.declaredValue}
                    onChange={handleInputChange}
                    placeholder="5000.00"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Origin Country */}
              <div>
                <label className="block text-slate-700 mb-2">
                  Origin Country <span className="text-red-500">*</span>
                </label>
                <select
                  name="originCountry"
                  value={formData.originCountry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select origin country</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Country */}
              <div>
                <label className="block text-slate-700 mb-2">
                  Destination Country <span className="text-red-500">*</span>
                </label>
                <select
                  name="destinationCountry"
                  value={formData.destinationCountry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select destination country</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-4 rounded-xl transition-all ${
                  isFormValid
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Generate AI Compliance Report
              </button>
            </div>
          </form>
        </div>

        {/* Pricing Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 border border-slate-200 sticky top-6">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="w-5 h-5 text-slate-700" />
              <h2 className="text-slate-900">Dynamic Pricing</h2>
            </div>

            {formData.destinationCountry && formData.declaredValue ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-slate-600 text-sm mb-2">Declared Value (USD)</p>
                  <p className="text-slate-900 text-xl">
                    ${parseFloat(formData.declaredValue).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <div className="h-px flex-1 bg-slate-300" />
                  <span className="text-sm">converts to</span>
                  <div className="h-px flex-1 bg-slate-300" />
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-slate-600 text-sm mb-2">
                    Destination Value ({destinationCurrency})
                  </p>
                  <p className="text-slate-900 text-xl">
                    {destinationCurrency === 'JPY' || destinationCurrency === 'INR'
                      ? `${destinationCurrency} ${convertedValue.toFixed(0)}`
                      : `${destinationCurrency} ${convertedValue.toFixed(2)}`}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-slate-600 text-sm mb-1">Exchange Rate</p>
                      <p className="text-slate-900">
                        1 USD = {exchangeRate.toFixed(4)} {destinationCurrency}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    💡 Prices vary by region and regulatory charges
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">
                  Select destination country and enter declared value to see price conversion
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
