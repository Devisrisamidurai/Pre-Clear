import { useState } from 'react';
import { FileText, Plus, Edit, Trash2, Globe, Package, AlertCircle, Upload, Search, Filter, Calendar } from 'lucide-react';
import { useShipments } from '../../hooks/useShipments';

export function ImportExportRules() {
  const { importExportRules, addImportExportRule, updateImportExportRule, deleteImportExportRule } = useShipments();
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  // filters removed per request (keeping only search)

  const [formData, setFormData] = useState({
    country: '',
    countryCode: '',
    currency: 'USD',
    productCategory: '',
    hsCodeRange: '',
    restrictions: [],
    requiredDocuments: [],
    bannedProducts: [],
    maxValue: undefined,
    maxWeight: undefined,
    additionalNotes: '',
  });

  // Small country -> currency mapping for the form dropdowns
  const countries = [
    { name: 'United States', code: 'US', currency: 'USD' },
    { name: 'China', code: 'CN', currency: 'CNY' },
    { name: 'India', code: 'IN', currency: 'INR' },
    { name: 'United Kingdom', code: 'GB', currency: 'GBP' },
    { name: 'Germany', code: 'DE', currency: 'EUR' },
    { name: 'Canada', code: 'CA', currency: 'CAD' },
    { name: 'Australia', code: 'AU', currency: 'AUD' },
  ];

  const currencyOptions = Array.from(new Set(countries.map(c => c.currency)));

  const handleOpenForm = (rule) => {
    if (rule) {
      setEditingRule(rule);
      setFormData(rule);
    } else {
      setEditingRule(null);
      setFormData({
        country: '',
        countryCode: '',
        currency: 'USD',
        productCategory: '',
        hsCodeRange: '',
        restrictions: [],
        requiredDocuments: [],
        bannedProducts: [],
        maxValue: undefined,
        maxWeight: undefined,
        additionalNotes: '',
      });
    }
    setShowForm(true);
  };

  const handleSaveRule = () => {
    if (!formData.country || !formData.countryCode || !formData.productCategory) {
      alert('Please fill in all required fields');
      return;
    }

    const rule = {
      id: editingRule?.id || `rule-${Date.now()}`,
      country: formData.country,
      countryCode: formData.countryCode,
      currency: formData.currency || 'USD',
      productCategory: formData.productCategory,
      hsCodeRange: formData.hsCodeRange || '',
      restrictions: formData.restrictions || [],
      requiredDocuments: formData.requiredDocuments || [],
      bannedProducts: formData.bannedProducts || [],
      maxValue: formData.maxValue,
      maxWeight: formData.maxWeight,
      additionalNotes: formData.additionalNotes,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'Admin',
    };

    if (editingRule) {
      updateImportExportRule(editingRule.id, rule);
    } else {
      addImportExportRule(rule);
    }

    setShowForm(false);
  };

  const handleDeleteRule = (id) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      deleteImportExportRule(id);
    }
  };

  const handleArrayInput = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData({ ...formData, [field]: items });
  };

  const filteredRules = importExportRules.filter(rule => {
    const matchesSearch = rule.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rule.productCategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div style={{ background: '#FBF9F6', minHeight: '100vh', padding: 24 }}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-slate-900 mb-2">Import/Export Rules Management</h1>
          <p className="text-slate-600">Configure country-wise import/export rules and compliance requirements</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          style={{ background: '#E6B800', color: '#2F1B17', border: '2px solid #2F1B17' }}
        >
          <Plus className="w-4 h-4" />
          Add New Rule
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-4">
        <div className="flex items-center">
          <Search className="w-4 h-4 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by country or category"
          />
        </div>
        {/* country/category filters removed; only search is available now */}
      </div>

      {/* Rules List */}
      <div className="grid gap-6">
        {filteredRules.map((rule) => (
          <div key={rule.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-slate-900 mb-1">
                    {rule.country} - {rule.productCategory}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    HS Code Range: {rule.hsCodeRange || 'All'}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    Last updated: {new Date(rule.lastUpdated).toLocaleDateString()} by {rule.updatedBy}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenForm(rule)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Restrictions */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <p className="text-slate-700">Restrictions</p>
                </div>
                <ul className="space-y-1">
                  {rule.restrictions.map((restriction, idx) => (
                    <li key={idx} className="text-slate-600 text-sm pl-4">• {restriction}</li>
                  ))}
                </ul>
              </div>

              {/* Required Documents */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <p className="text-slate-700">Required Documents</p>
                </div>
                <ul className="space-y-1">
                  {rule.requiredDocuments.map((doc, idx) => (
                    <li key={idx} className="text-slate-600 text-sm pl-4">• {doc}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Banned Products */}
            {rule.bannedProducts.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-red-600" />
                  <p className="text-slate-700">Banned Products</p>
                </div>
                <ul className="space-y-1">
                  {rule.bannedProducts.map((product, idx) => (
                    <li key={idx} className="text-red-600 text-sm pl-4">• {product}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Constraints */}
            {(rule.maxValue || rule.maxWeight) && (
              <div className="flex gap-4 text-sm text-slate-600 mb-4">
                {rule.maxValue && (
                  <span>Max Value: {rule.currency ? `${rule.currency} ` : '$'}{rule.maxValue.toLocaleString()}</span>
                )}
                {rule.maxWeight && (
                  <span>Max Weight: {rule.maxWeight}kg</span>
                )}
              </div>
            )}

            {/* Additional Notes */}
            {rule.additionalNotes && (
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-slate-700 text-sm">{rule.additionalNotes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-slate-900 mb-6">
              {editingRule ? 'Edit Import/Export Rule' : 'Add New Import/Export Rule'}
            </h2>

            <div className="space-y-4">
              {/* Country and Currency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-2 text-sm">Country *</label>
                  <select
                    value={formData.countryCode || ''}
                    onChange={(e) => {
                      const code = e.target.value;
                      const found = countries.find(c => c.code === code);
                      setFormData({
                        ...formData,
                        country: found ? found.name : '',
                        countryCode: found ? found.code : code,
                        currency: found ? found.currency : formData.currency,
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a country...</option>
                    {countries.map(c => (
                      <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-2 text-sm">Currency</label>
                  <select
                    value={formData.currency || 'USD'}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {currencyOptions.map(cur => (
                      <option key={cur} value={cur}>{cur}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Category & HS Code Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-2 text-sm">
                    Product Category *
                  </label>
                  <input
                    type="text"
                    value={formData.productCategory}
                    onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Electronics"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-2 text-sm">
                    HS Code Range
                  </label>
                  <input
                    type="text"
                    value={formData.hsCodeRange}
                    onChange={(e) => setFormData({ ...formData, hsCodeRange: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 8541-8548"
                  />
                </div>
              </div>

              {/* Restrictions */}
              <div>
                <label className="block text-slate-700 mb-2 text-sm">
                  Restrictions (comma-separated)
                </label>
                <textarea
                  value={formData.restrictions?.join(', ')}
                  onChange={(e) => handleArrayInput('restrictions', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="e.g., FCC certification required, RoHS compliance"
                />
              </div>

              {/* Required Documents */}
              <div>
                <label className="block text-slate-700 mb-2 text-sm">
                  Required Documents (comma-separated)
                </label>
                <textarea
                  value={formData.requiredDocuments?.join(', ')}
                  onChange={(e) => handleArrayInput('requiredDocuments', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="e.g., Commercial Invoice, Packing List, Certificate of Origin"
                />
              </div>

              {/* Banned Products */}
              <div>
                <label className="block text-slate-700 mb-2 text-sm">
                  Banned Products (comma-separated)
                </label>
                <textarea
                  value={formData.bannedProducts?.join(', ')}
                  onChange={(e) => handleArrayInput('bannedProducts', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="e.g., Counterfeit products, Prohibited items"
                />
              </div>

              {/* Constraints */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-2 text-sm">
                    Max Value
                  </label>
                  <input
                    type="number"
                    value={formData.maxValue || ''}
                    onChange={(e) => setFormData({ ...formData, maxValue: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2500"
                  />
                  <div className="text-xs text-slate-500 mt-1">Currency: {formData.currency || 'USD'}</div>
                </div>
                <div>
                  <label className="block text-slate-700 mb-2 text-sm">
                    Max Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.maxWeight || ''}
                    onChange={(e) => setFormData({ ...formData, maxWeight: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 5000"
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-slate-700 mb-2 text-sm">
                  Additional Notes
                </label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Any additional compliance notes or guidelines"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveRule}
                className="flex-1 px-4 py-2 rounded-lg transition-colors"
                style={{ background: '#E6B800', color: '#2F1B17', border: '2px solid #2F1B17' }}
              >
                {editingRule ? 'Update Rule' : 'Add Rule'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

