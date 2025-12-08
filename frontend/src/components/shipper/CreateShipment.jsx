import { useState, useEffect } from 'react';
import { Package, MapPin, Plus, Trash2, ArrowRight, AlertCircle, CheckCircle, Sparkles, Shield, AlertTriangle, XCircle } from 'lucide-react';
import { shipmentsStore } from '../../store/shipmentsStore';
import { validateAddress, validatePhone, validateEmail, getCurrencyByCountry, suggestHSCode, validateAndCheckHSCode } from '../../utils/validation';

export function CreateShipment({ onNavigate, onSave }) {
  const [products, setProducts] = useState([
    { id: '1', name: '', description: '', hsCode: '', quantity: '', weight: '', value: '' }
  ]);
  
  const [formData, setFormData] = useState({
    originCountry: '',
    originCity: '',
    originAddress: '',
    originPhone: '',
    originEmail: '',
    originPinCode: '',
    destCountry: '',
    destCity: '',
    destAddress: '',
    destPhone: '',
    destEmail: '',
    destPinCode: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [validatedFields, setValidatedFields] = useState(new Set());
  const [isValidating, setIsValidating] = useState(false);
  
  // HS Code AI suggestions
  const [hsCodeSuggestions, setHsCodeSuggestions] = useState({});
  const [loadingSuggestions, setLoadingSuggestions] = useState({});
  const [hsCodeValidation, setHsCodeValidation] = useState({});
  const [selectedHsCodeIndex, setSelectedHsCodeIndex] = useState({});

  const currency = getCurrencyByCountry(formData.originCountry || 'US');

  // Auto-suggest HS Code when product name/description changes
  useEffect(() => {
    products.forEach(async (product) => {
      if (product.name && product.name.length > 3) {
        setLoadingSuggestions(prev => ({ ...prev, [product.id]: true }));
        try {
          const suggestions = await suggestHSCode(product.name, product.description);
          setHsCodeSuggestions(prev => ({ ...prev, [product.id]: suggestions }));
        } catch (error) {
          console.error('Error fetching HS code suggestions:', error);
        } finally {
          setLoadingSuggestions(prev => ({ ...prev, [product.id]: false }));
        }
      }
    });
  }, [products.map(p => p.name + p.description).join(',')]);

  // Validate HS Code when selected
  useEffect(() => {
    products.forEach(async (product) => {
      if (product.hsCode && product.hsCode.length >= 6 && formData.destCountry) {
        try {
          const validation = await validateAndCheckHSCode(product.hsCode, formData.destCountry);
          setHsCodeValidation(prev => ({ ...prev, [product.id]: validation }));
        } catch (error) {
          console.error('Error validating HS code:', error);
        }
      }
    });
  }, [products.map(p => p.hsCode).join(','), formData.destCountry]);

  const handleAddProduct = () => {
    setProducts([...products, {
      id: Date.now().toString(),
      name: '',
      description: '',
      hsCode: '',
      quantity: '',
      weight: '',
      value: ''
    }]);
  };

  const handleRemoveProduct = (id) => {
    if (products.length > 1) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleProductChange = (id, field, value) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleSelectHSCode = (productId, suggestion, index) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, hsCode: suggestion.code } : p
    ));
    setSelectedHsCodeIndex(prev => ({ ...prev, [productId]: index }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateField = async (fieldName) => {
    setIsValidating(true);
    const errors = {};

    try {
      if (fieldName.includes('origin') || fieldName.includes('dest')) {
        const prefix = fieldName.includes('origin') ? 'origin' : 'dest';
        
        if (fieldName.includes('Address')) {
          const result = await validateAddress(
            formData[`${prefix}Country`],
            formData[`${prefix}City`],
            formData[`${prefix}Address`],
            formData[`${prefix}PinCode`]
          );
          
          if (!result.isValid) {
            result.errors.forEach(err => {
              errors[`${prefix}${err.field.charAt(0).toUpperCase() + err.field.slice(1)}`] = err.message;
            });
          }
        }
        
        if (fieldName.includes('Phone')) {
          const result = await validatePhone(formData[`${prefix}Phone`]);
          if (!result.isValid) {
            errors[fieldName] = result.errors[0]?.message || 'Invalid phone number';
          }
        }
        
        if (fieldName.includes('Email')) {
          const result = await validateEmail(formData[`${prefix}Email`]);
          if (!result.isValid) {
            errors[fieldName] = result.errors[0]?.message || 'Invalid email';
          }
        }
      }

      setValidationErrors(prev => ({ ...prev, ...errors }));
      if (Object.keys(errors).length === 0) {
        setValidatedFields(prev => new Set([...prev, fieldName]));
      }
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all products have required fields
    const productErrors = [];
    products.forEach((product, index) => {
      if (!product.name) productErrors.push(`Product ${index + 1}: Name is required`);
      if (!product.hsCode) productErrors.push(`Product ${index + 1}: HS Code is required`);
      if (!product.quantity) productErrors.push(`Product ${index + 1}: Quantity is required`);
      if (!product.value) productErrors.push(`Product ${index + 1}: Value is required`);
    });

    if (productErrors.length > 0) {
      alert('Please complete all product information:\n' + productErrors.join('\n'));
      return;
    }

    // Check for banned items
    const bannedProducts = products.filter(p => {
      const validation = hsCodeValidation[p.id];
      return validation && validation.status === 'banned';
    });

    if (bannedProducts.length > 0) {
      alert('Cannot proceed: Some products are banned or require special licenses.\nPlease review the HS code restrictions.');
      return;
    }

    const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.value) || 0), 0);
    const totalWeight = products.reduce((sum, p) => sum + (parseFloat(p.weight) || 0), 0);
    
    // Build documents array based on HS code validation
    const requiredDocs = [
      { name: 'Commercial Invoice', type: 'invoice' },
      { name: 'Packing List', type: 'packing-list' },
      { name: 'Certificate of Origin', type: 'certificate' }
    ];
    
    // Add additional documents based on HS code requirements
    products.forEach(p => {
      const validation = hsCodeValidation[p.id];
      if (validation?.requiredDocs) {
        validation.requiredDocs.forEach((doc) => {
          if (!requiredDocs.find(d => d.name === doc)) {
            requiredDocs.push({ 
              name: doc, 
              type: doc.toLowerCase().includes('certificate') ? 'certificate' : 
                    doc.toLowerCase().includes('invoice') ? 'invoice' : 
                    doc.toLowerCase().includes('specification') ? 'specification' : 'document'
            });
          }
        });
      }
    });
    
    const newShipment = {
      id: `SHP${Date.now()}`,
      productName: products.map(p => p.name).join(', '),
      productDescription: products[0].description,
      hsCode: products[0].hsCode,
      products: products,
      quantity: products.reduce((sum, p) => sum + (parseInt(p.quantity) || 0), 0).toString(),
      weight: totalWeight.toString(),
      value: totalValue.toString(),
      currency: currency.code,
      originCountry: formData.originCountry,
      originCity: formData.originCity,
      originAddress: formData.originAddress,
      originPhone: formData.originPhone,
      originEmail: formData.originEmail,
      originPinCode: formData.originPinCode,
      destCountry: formData.destCountry,
      destCity: formData.destCity,
      destAddress: formData.destAddress,
      destPhone: formData.destPhone,
      destEmail: formData.destEmail,
      destPinCode: formData.destPinCode,
      status: 'draft',
      aiApproval: 'not-started',
      brokerApproval: 'not-started',
      aiComplianceScore: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shipperId: 'shipper-1',
      shipperName: 'ABC Exports',
      documents: requiredDocs.map(doc => ({
        name: doc.name,
        type: doc.type,
        uploaded: false
      }))
    };

    shipmentsStore.saveShipment(newShipment);
    onNavigate('shipment-details', newShipment);
  };

  const HSCodeSuggestionPanel = ({ productId, suggestions }) => {
    if (!suggestions || suggestions.length === 0) return null;

    return (
      <div className="mt-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <p className="text-sm text-purple-900">AI-Powered HS Code Suggestions</p>
        </div>
        
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectHSCode(productId, suggestion, index)}
              className={`w-full p-3 rounded-lg border text-left transition-all ${
                selectedHsCodeIndex[productId] === index
                  ? 'border-purple-500 bg-purple-100'
                  : 'border-purple-200 bg-white hover:border-purple-400'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-slate-900">{suggestion.code}</p>
                    {suggestion.status === 'valid' && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Valid
                      </span>
                    )}
                    {suggestion.status === 'restricted' && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Restricted
                      </span>
                    )}
                    {suggestion.status === 'banned' && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Banned
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm">{suggestion.description}</p>
                </div>
                {selectedHsCodeIndex[productId] === index && (
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                )}
              </div>
              
              {suggestion.restrictions && suggestion.restrictions.length > 0 && (
                <div className="mt-2 pt-2 border-t border-purple-200">
                  <p className="text-xs text-slate-500 mb-1">Restrictions:</p>
                  <ul className="text-xs text-slate-600 space-y-0.5">
                    {suggestion.restrictions.map((restriction, i) => (
                      <li key={i}>• {restriction}</li>
                    ))}
                  </ul>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const HSCodeValidationWidget = ({ productId }) => {
    const validation = hsCodeValidation[productId];
    if (!validation) return null;

    return (
      <div className={`mt-3 p-4 rounded-lg border ${
        validation.status === 'valid' ? 'bg-green-50 border-green-200' :
        validation.status === 'restricted' ? 'bg-amber-50 border-amber-200' :
        'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-start gap-3">
          {validation.status === 'valid' && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
          {validation.status === 'restricted' && <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />}
          {validation.status === 'banned' && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
          
          <div className="flex-1">
            <p className={`text-sm mb-1 ${
              validation.status === 'valid' ? 'text-green-900' :
              validation.status === 'restricted' ? 'text-amber-900' :
              'text-red-900'
            }`}>
              {validation.message}
            </p>
            
            {validation.requiredDocs && validation.requiredDocs.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-slate-600 mb-1">Required Documents:</p>
                <ul className="text-xs text-slate-700 space-y-0.5">
                  {validation.requiredDocs.map((doc, i) => (
                    <li key={i}>• {doc}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {validation.restrictions && validation.restrictions.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-slate-600 mb-1">Compliance Requirements:</p>
                <ul className="text-xs text-slate-700 space-y-0.5">
                  {validation.restrictions.map((restriction, i) => (
                    <li key={i}>• {restriction}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Create New Shipment</h1>
        <p className="text-slate-600">Enter all shipment details to begin AI-powered pre-clearance process</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl space-y-8">
        {/* Products Section */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-slate-900">Product Information</h2>
                <p className="text-slate-500 text-sm">Add product details with AI-powered HS code suggestions</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddProduct}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          <div className="space-y-6">
            {products.map((product, index) => (
              <div key={product.id} className="p-5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-900">Product {index + 1}</h3>
                  {products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-slate-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Electronic Circuit Boards"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-slate-700 mb-2">Product Description</label>
                    <textarea
                      value={product.description}
                      onChange={(e) => handleProductChange(product.id, 'description', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Detailed product description..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-slate-700 mb-2">
                      HS Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={product.hsCode}
                      onChange={(e) => handleProductChange(product.id, 'hsCode', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 8541.10.00"
                      required
                    />
                    
                    {loadingSuggestions[product.id] && (
                      <p className="mt-2 text-sm text-purple-600 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        AI is analyzing product and suggesting HS codes...
                      </p>
                    )}
                    
                    {hsCodeSuggestions[product.id] && !loadingSuggestions[product.id] && (
                      <HSCodeSuggestionPanel 
                        productId={product.id} 
                        suggestions={hsCodeSuggestions[product.id]} 
                      />
                    )}
                    
                    {product.hsCode && <HSCodeValidationWidget productId={product.id} />}
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(product.id, 'quantity', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={product.weight}
                      onChange={(e) => handleProductChange(product.id, 'weight', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 50.5"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-slate-700 mb-2">
                      Product Value ({currency.code}) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                        {currency.symbol}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        value={product.value}
                        onChange={(e) => handleProductChange(product.id, 'value', e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 5000.00"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-900">Total Shipment Value</p>
                  <p className="text-2xl text-blue-700">
                    {currency.symbol}{products.reduce((sum, p) => sum + (parseFloat(p.value) || 0), 0).toFixed(2)} {currency.code}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-700">
                    {products.length} product{products.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-blue-600">
                    Total Weight: {products.reduce((sum, p) => sum + (parseFloat(p.weight) || 0), 0).toFixed(2)} kg
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Origin Address */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-slate-900">Origin Address</h2>
              <p className="text-slate-500 text-sm">Shipper's complete address details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                name="originCountry"
                value={formData.originCountry}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="IN">India</option>
                <option value="CN">China</option>
                <option value="GB">United Kingdom</option>
                <option value="JP">Japan</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="originCity"
                value={formData.originCity}
                onChange={handleChange}
                onBlur={() => validateField('originAddress')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.originCity ? 'border-red-500' : 'border-slate-300'
                }`}
                required
              />
              {validationErrors.originCity && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.originCity}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-700 mb-2">
                Full Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="originAddress"
                value={formData.originAddress}
                onChange={handleChange}
                onBlur={() => validateField('originAddress')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.originAddress ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Street address, building number, etc."
                required
              />
              {validationErrors.originAddress && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.originAddress}
                </p>
              )}
              {validatedFields.has('originAddress') && !validationErrors.originAddress && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Address validated successfully
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                PIN/Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="originPinCode"
                value={formData.originPinCode}
                onChange={handleChange}
                onBlur={() => validateField('originAddress')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.originPinCode ? 'border-red-500' : 'border-slate-300'
                }`}
                required
              />
              {validationErrors.originPinCode && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.originPinCode}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Phone (with country code) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="originPhone"
                value={formData.originPhone}
                onChange={handleChange}
                onBlur={() => validateField('originPhone')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.originPhone ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="+1 234 567 8900"
                required
              />
              {validationErrors.originPhone && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.originPhone}
                </p>
              )}
              {validatedFields.has('originPhone') && !validationErrors.originPhone && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Phone number validated
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="originEmail"
                value={formData.originEmail}
                onChange={handleChange}
                onBlur={() => validateField('originEmail')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.originEmail ? 'border-red-500' : 'border-slate-300'
                }`}
                required
              />
              {validationErrors.originEmail && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.originEmail}
                </p>
              )}
              {validatedFields.has('originEmail') && !validationErrors.originEmail && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Email validated
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Destination Address */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-slate-900">Destination Address</h2>
              <p className="text-slate-500 text-sm">Receiver's complete address details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                name="destCountry"
                value={formData.destCountry}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="IN">India</option>
                <option value="CN">China</option>
                <option value="GB">United Kingdom</option>
                <option value="JP">Japan</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="destCity"
                value={formData.destCity}
                onChange={handleChange}
                onBlur={() => validateField('destAddress')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.destCity ? 'border-red-500' : 'border-slate-300'
                }`}
                required
              />
              {validationErrors.destCity && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.destCity}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-700 mb-2">
                Full Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="destAddress"
                value={formData.destAddress}
                onChange={handleChange}
                onBlur={() => validateField('destAddress')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.destAddress ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Street address, building number, etc."
                required
              />
              {validationErrors.destAddress && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.destAddress}
                </p>
              )}
              {validatedFields.has('destAddress') && !validationErrors.destAddress && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Address validated successfully
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                PIN/Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="destPinCode"
                value={formData.destPinCode}
                onChange={handleChange}
                onBlur={() => validateField('destAddress')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.destPinCode ? 'border-red-500' : 'border-slate-300'
                }`}
                required
              />
              {validationErrors.destPinCode && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.destPinCode}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Phone (with country code) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="destPhone"
                value={formData.destPhone}
                onChange={handleChange}
                onBlur={() => validateField('destPhone')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.destPhone ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="+1 234 567 8900"
                required
              />
              {validationErrors.destPhone && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.destPhone}
                </p>
              )}
              {validatedFields.has('destPhone') && !validationErrors.destPhone && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Phone number validated
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="destEmail"
                value={formData.destEmail}
                onChange={handleChange}
                onBlur={() => validateField('destEmail')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.destEmail ? 'border-red-500' : 'border-slate-300'
                }`}
                required
              />
              {validationErrors.destEmail && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.destEmail}
                </p>
              )}
              {validatedFields.has('destEmail') && !validationErrors.destEmail && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Email validated
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => onNavigate('shipper-dashboard')}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isValidating}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Shipment & Run AI Check
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
