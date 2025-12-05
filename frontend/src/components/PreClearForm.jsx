import { useState } from 'react';
import { Upload, Brain, Sparkles, FileText, AlertCircle } from 'lucide-react';

interface PreClearFormProps {
  onSubmit: (data: any) => void;
}

const countries = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'EU', name: 'European Union', flag: '🇪🇺' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
];

export function PreClearForm({ onSubmit }: PreClearFormProps) {
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    originCountry: '',
    destinationCountry: '',
    quantity: '',
    weight: ''
  });

  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = () => {
    if (!formData.productDescription) return;
    
    setAnalyzing(true);
    setTimeout(() => {
      setAiAnalysis({
        predictedHS: '8518.30.20',
        confidence: 94,
        tariffMatch: 92,
        extractedMeaning: 'Consumer electronics device for audio playback with wireless connectivity capabilities',
        tariffDefinition: 'Headphones and earphones, whether or not combined with a microphone',
        restrictedItems: [],
        requiredDocs: ['Commercial Invoice', 'Certificate of Origin', 'MSDS', 'Packing List'],
        sanctionsStatus: 'Clear',
        estimatedDuty: 2.5,
        estimatedVAT: 18,
        importRules: ['BIS certification may be required', 'Product must meet safety standards'],
        exportRules: ['Standard export declaration required']
      });
      setAnalyzing(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      aiAnalysis
    });
  };

  const isFormValid = formData.productName && 
    formData.productDescription && 
    formData.originCountry && 
    formData.destinationCountry && 
    formData.quantity && 
    formData.weight;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Pre-Clear Verification Form</h1>
        <p className="text-slate-600">Submit product details for AI-powered customs compliance verification</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Details */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-slate-900 mb-4">Product Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="e.g., Wireless Bluetooth Headphones"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Product Description (for AI NLP Analysis) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="productDescription"
                    value={formData.productDescription}
                    onChange={handleChange}
                    placeholder="Detailed description: materials, components, usage, features, specifications..."
                    rows={5}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={!formData.productDescription || analyzing}
                    className={`mt-3 px-6 py-2 rounded-lg flex items-center gap-2 ${
                      formData.productDescription && !analyzing
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Brain className="w-4 h-4" />
                    {analyzing ? 'Analyzing...' : 'Trigger AI Analysis'}
                  </button>
                </div>
              </div>
            </div>

            {/* Route Information */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-slate-900 mb-4">Route Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-2">
                    Country of Origin <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="originCountry"
                    value={formData.originCountry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select origin</option>
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">
                    Country of Destination <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="destinationCountry"
                    value={formData.destinationCountry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select destination</option>
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Quantity & Weight */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-slate-900 mb-4">Shipment Specifications</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
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
                    onChange={handleChange}
                    placeholder="25.5"
                    step="0.01"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-slate-900 mb-4">Upload Documents</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-700">Invoice</p>
                  <p className="text-slate-500 text-sm">Click to upload</p>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-700">MSDS</p>
                  <p className="text-slate-500 text-sm">Click to upload</p>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-700">Certificates</p>
                  <p className="text-slate-500 text-sm">Click to upload</p>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-700">Product Images</p>
                  <p className="text-slate-500 text-sm">Click to upload</p>
                </div>
              </div>

              <p className="text-slate-500 text-sm mt-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI will automatically extract and tag uploaded documents
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || !aiAnalysis}
              className={`w-full py-4 rounded-xl transition-all ${
                isFormValid && aiAnalysis
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Submit for Broker Review
            </button>
          </form>
        </div>

        {/* AI Analysis Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 sticky top-6">
            {aiAnalysis ? (
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h3 className="text-slate-900">AI Analysis Results</h3>
                </div>

                <div className="space-y-4">
                  {/* Predicted HS Code */}
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-slate-700 text-sm mb-1">Predicted HS Code</p>
                    <p className="text-purple-900 text-2xl font-mono mb-2">{aiAnalysis.predictedHS}</p>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-600 rounded-full"
                          style={{ width: `${aiAnalysis.confidence}%` }}
                        />
                      </div>
                      <span className="text-purple-700 text-sm">{aiAnalysis.confidence}%</span>
                    </div>
                    <p className="text-slate-600 text-xs">Confidence Score</p>
                  </div>

                  {/* Tariff Match */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-slate-700 text-sm mb-1">Tariff Definition Match</p>
                    <p className="text-blue-900 mb-2">{aiAnalysis.tariffDefinition}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${aiAnalysis.tariffMatch}%` }}
                        />
                      </div>
                      <span className="text-blue-700 text-sm">{aiAnalysis.tariffMatch}%</span>
                    </div>
                  </div>

                  {/* Restricted Items */}
                  <div className={`p-4 rounded-lg ${
                    aiAnalysis.restrictedItems.length === 0 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className="text-slate-700 text-sm mb-1">Restricted/Prohibited Check</p>
                    <p className={aiAnalysis.restrictedItems.length === 0 ? 'text-green-700' : 'text-red-700'}>
                      {aiAnalysis.restrictedItems.length === 0 ? '✓ No restrictions found' : 'Restrictions detected'}
                    </p>
                  </div>

                  {/* Required Documents */}
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-slate-700 text-sm mb-2">Required Documents</p>
                    <div className="space-y-1">
                      {aiAnalysis.requiredDocs.map((doc: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <FileText className="w-3 h-3 text-orange-600" />
                          <span className="text-slate-700 text-sm">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Duties Estimate */}
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-slate-700 text-sm mb-2">Estimated Duties & Taxes</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Customs Duty</span>
                        <span className="text-slate-900">{aiAnalysis.estimatedDuty}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">VAT/GST</span>
                        <span className="text-slate-900">{aiAnalysis.estimatedVAT}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Sanctions Status */}
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-slate-700 text-sm mb-1">Sanctions Screening</p>
                    <p className="text-green-700 flex items-center gap-2">
                      <span className="text-xl">✓</span>
                      {aiAnalysis.sanctionsStatus}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Brain className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-2">AI Analysis Not Run</p>
                <p className="text-slate-400 text-sm">
                  Enter product description and click "Trigger AI Analysis" to see results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
