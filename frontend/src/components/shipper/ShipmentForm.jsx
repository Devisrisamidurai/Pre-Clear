import { useState, useEffect } from 'react';
import { 
  MapPin, Package, Truck, Clock, DollarSign, Info, AlertCircle, CheckCircle2, 
  AlertTriangle, ChevronDown, Plus, Trash2, FileText, Globe, Settings, Users, Pencil
} from 'lucide-react';
import { shipmentsStore } from '../../store/shipmentsStore';
import { suggestHSCode, validateAndCheckHSCode, getCurrencyByCountry } from '../../utils/validation';

const modes = ['Air', 'Sea', 'Road', 'Rail', 'Courier', 'Multimodal'];
const shipmentTypes = ['Domestic', 'International'];
const pickupTypes = ['Scheduled Pickup', 'Drop-off'];
const serviceLevels = ['Standard', 'Express', 'Economy', 'Freight'];
const incoterms = ['FOB', 'CIF', 'DDP', 'EXW', 'CPT', 'DAP'];
const billToOptions = ['Shipper', 'Consignee', 'ThirdParty'];
const paymentTimings = ['Prepaid', 'Collect', 'COD'];
const paymentMethods = ['Credit Card', 'Bank Transfer', 'Wire Transfer', 'Check'];
const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CNY', 'JPY', 'CAD', 'AUD', 'SGD', 'CHF'];
const packageTypes = ['Box', 'Pallet', 'Crate', 'Bag', 'Case', 'Envelope'];
const uoms = ['kg', 'lb', 'pieces', 'meters', 'units', 'sets'];

// Country options (code + full name) shown in selects
const countryOptions = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'MX', name: 'Mexico' },
  { code: 'BR', name: 'Brazil' },
  { code: 'AR', name: 'Argentina' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'IE', name: 'Ireland' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'ES', name: 'Spain' },
  { code: 'PT', name: 'Portugal' },
  { code: 'IT', name: 'Italy' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'PL', name: 'Poland' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'SG', name: 'Singapore' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'PH', name: 'Philippines' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'QA', name: 'Qatar' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'KE', name: 'Kenya' },
  { code: 'NG', name: 'Nigeria' },
];

// Country code to full name mapping for lookups
const countryNames = countryOptions.reduce((acc, { code, name }) => {
  acc[code] = name;
  return acc;
}, {});

const resolveCountryCode = (value) => {
  if (!value) return '';
  const codeList = countryOptions.map(c => c.code);
  if (codeList.includes(value)) return value;
  const match = countryOptions.find((c) => c.name.toLowerCase() === value.toLowerCase());
  return match ? match.code : value;
};

// Try multiple localStorage keys for profile data
const getStoredProfile = () => {
  const keys = ['userProfile', 'profile', 'shipperProfile'];
  for (const k of keys) {
    try {
      const raw = localStorage.getItem(k);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore parse errors and continue
    }
  }
  return null;
};
const CollapsibleSection = ({ title, isOpen, onToggle, children, icon: Icon }) => (
  <div className="border border-slate-200 rounded-lg overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-slate-600" />}
        <h3 className="text-slate-900 font-semibold">{title}</h3>
      </div>
      <ChevronDown 
        className={`w-5 h-5 text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
    {isOpen && (
      <div className="p-6 bg-white border-t border-slate-200 space-y-4">
        {children}
      </div>
    )}
  </div>
);

const InputField = ({ label, type = 'text', name, value, onChange, required = false, placeholder = '', disabled = false }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
      {required && <span className="text-red-600">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required = false, disabled = false }) => {
  const normalize = (opt) => {
    if (typeof opt === 'string') return { value: opt, label: opt };
    return { value: opt.value ?? opt.code, label: opt.label ?? opt.name ?? opt.value ?? '' };
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
      >
        <option value="">-- Select {label} --</option>
        {options.map(opt => {
          const { value: val, label: lab } = normalize(opt);
          return (
            <option key={val} value={val}>{lab}</option>
          );
        })}
      </select>
    </div>
  );
};

const CheckboxField = ({ label, name, checked, onChange }) => (
  <div className="flex items-center gap-3">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 border-slate-300 rounded focus:ring-blue-500"
    />
    <label className="text-sm font-medium text-slate-700">{label}</label>
  </div>
);

export function ShipmentForm({ shipment, onNavigate }) {
  const [formData, setFormData] = useState(shipment || {});
  const [profileCountry, setProfileCountry] = useState('');
  const [profileCurrency, setProfileCurrency] = useState('USD');
  const [profileData, setProfileData] = useState(null);
  const [shipperEditable, setShipperEditable] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basics: true,
    shipper: false,
    consignee: false,
    packages: false,
    products: false,
    service: false,
    compliance: false,
    documents: false,
  });
  const [errors, setErrors] = useState({});
  const [pricing, setPricing] = useState({
    basePrice: 2400,
    serviceCharge: 0,
    customsClearance: 450,
    insurance: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  // HS code suggestion + validation state (per-product)
  const [hsSuggestions, setHsSuggestions] = useState({});
  const [loadingHsSuggestions, setLoadingHsSuggestions] = useState({});
  const [hsValidation, setHsValidation] = useState({});
  const [selectedHsIndex, setSelectedHsIndex] = useState({});

  // Apply profile data into the form (used on load and when profile changes)
  const applyProfileToForm = (profile) => {
    const countryCode = resolveCountryCode(profile.countryCode || profile.country || '');
    const currency = countryCode ? getCurrencyByCountry(countryCode).code : 'USD';
    setProfileCountry(countryCode);
    setProfileCurrency(currency);
    setProfileData(profile);

    // Only overwrite locked fields when shipper is not being edited manually
    setFormData(prev => {
      const nextShipper = shipperEditable ? prev.shipper || {} : {
        ...prev.shipper,
        company: profile.companyName ?? prev.shipper?.company ?? '',
        contactName: `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || prev.shipper?.contactName || '',
        phone: profile.phone ?? prev.shipper?.phone ?? '',
        email: profile.email ?? prev.shipper?.email ?? '',
        address1: profile.addressLine1 ?? prev.shipper?.address1 ?? '',
        address2: profile.addressLine2 ?? prev.shipper?.address2 ?? '',
        city: profile.city ?? prev.shipper?.city ?? '',
        state: profile.state ?? prev.shipper?.state ?? '',
        postalCode: profile.pinCode ?? prev.shipper?.postalCode ?? '',
        country: prev.shipper?.country || countryCode,
        taxId: prev.shipper?.taxId || ''
      };

      const resolvedCurrency = prev.currency || currency;
      const updatedProducts = (prev.products && prev.products.length ? prev.products : [
        {
          id: `PROD-${Date.now()}`,
          name: '',
          description: '',
          hsCode: '',
          category: '',
          qty: '',
          uom: '',
          unitPrice: '',
          totalValue: '',
          originCountry: countryCode,
          reasonForExport: '',
        }
      ]).map(prod => ({
        ...prod,
        originCountry: prod.originCountry || countryCode,
      }));

      return {
        ...prev,
        shipper: nextShipper,
        currency: resolvedCurrency,
        serviceLevel: prev.serviceLevel || 'Standard',
        billTo: prev.billTo || 'Shipper',
        products: updatedProducts,
      };
    });
    setExpandedSections(prev => ({ ...prev, shipper: true, service: true, products: true }));
  };

  // Auto-fill shipper info and currency from stored user profile on load
  useEffect(() => {
    if (shipment) return; // Don't override if editing existing shipment
    try {
      const profile = getStoredProfile();
      if (profile) applyProfileToForm(profile);
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipment, shipperEditable]);

  // Listen for profile changes (storage events / tab visibility) to refresh shipper info
  useEffect(() => {
    if (shipment) return;
    const handleProfileRefresh = () => {
      try {
        const profile = getStoredProfile();
        if (profile) applyProfileToForm(profile);
      } catch (e) {
        // ignore
      }
    };

    const onStorage = (e) => {
      if (e.key === 'userProfile') handleProfileRefresh();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') handleProfileRefresh();
    };

    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [shipment, shipperEditable]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setFormData(prev => {
      const existing = Array.isArray(prev[arrayName]) ? prev[arrayName] : [];
      const newArray = [...existing];
      newArray[index] = { ...(newArray[index] || {}), [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  const addArrayItem = (arrayName, template) => {
    setFormData(prev => {
      const existing = Array.isArray(prev[arrayName]) ? prev[arrayName] : [];
      return {
        ...prev,
        [arrayName]: [...existing, template]
      };
    });
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => {
      const existing = Array.isArray(prev[arrayName]) ? prev[arrayName] : [];
      return {
        ...prev,
        [arrayName]: existing.filter((_, i) => i !== index)
      };
    });
  };

  // Calculate pricing
  useEffect(() => {
    const serviceLevelMultiplier = {
      'Standard': 1.0,
      'Express': 1.5,
      'Economy': 0.8,
      'Freight': 0.7,
    };
    
    const basePrice = formData.declaredValue ? formData.declaredValue * 0.05 : 2400;
    const serviceCharge = basePrice * (serviceLevelMultiplier[formData.serviceLevel] || 1.0);
    const insurance = formData.insuranceRequired ? (formData.declaredValue || 0) * 0.01 : 0;
    const subtotal = basePrice + serviceCharge + pricing.customsClearance + insurance;
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    setPricing({
      basePrice,
      serviceCharge,
      customsClearance: pricing.customsClearance,
      insurance,
      subtotal,
      tax,
      total
    });
  }, [formData.declaredValue, formData.serviceLevel, formData.insuranceRequired]);

  // Trigger HS code suggestions when product name/description/category change
  useEffect(() => {
    if (!formData.products) return;

    formData.products.forEach(async (product) => {
      const productKey = product.id || '';
      const triggerText = `${product.name || ''} ${product.description || ''} ${product.category || ''}`.trim();
      if (!triggerText || triggerText.length < 3) return;

      try {
        setLoadingHsSuggestions(prev => ({ ...prev, [productKey]: true }));
        const suggestions = await suggestHSCode(product.name || '', product.description || '');
        setHsSuggestions(prev => ({ ...prev, [productKey]: suggestions }));
      } catch (err) {
        console.error('HS suggestion error', err);
      } finally {
        setLoadingHsSuggestions(prev => ({ ...prev, [productKey]: false }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.products ? formData.products.map(p => `${p.name}|${p.description}|${p.category}`).join('||') : '']);

  // Validate HS codes when changed
  useEffect(() => {
    if (!formData.products) return;

    formData.products.forEach(async (product) => {
      const productKey = product.id || '';
      if (!product.hsCode || product.hsCode.trim().length < 4) return;
      try {
        const validation = await validateAndCheckHSCode(product.hsCode, formData.consignee?.country || formData.shipper?.country);
        setHsValidation(prev => ({ ...prev, [productKey]: validation }));
      } catch (err) {
        console.error('HS validation error', err);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.products ? formData.products.map(p => p.hsCode).join('||') : '', formData.consignee?.country, formData.shipper?.country]);

  // Keep currency and product origin in sync with selected shipper country
  useEffect(() => {
    const selectedCountry = formData.shipper?.country;
    if (!selectedCountry) return;
    const code = resolveCountryCode(selectedCountry);
    const desiredCurrency = getCurrencyByCountry(code).code;

    setProfileCountry(code);
    setProfileCurrency(desiredCurrency);

    // Normalize country code if user entered full name
    if (code !== selectedCountry) {
      setFormData(prev => ({
        ...prev,
        shipper: { ...prev.shipper, country: code }
      }));
      return;
    }

    setFormData(prev => {
      let updated = prev;
      if (prev.currency !== desiredCurrency) {
        updated = { ...updated, currency: desiredCurrency };
      }
      const updatedProducts = (prev.products || []).map(p => {
        if (!p.originCountry) return { ...p, originCountry: code };
        return p;
      });
      const productsChanged = JSON.stringify(updatedProducts) !== JSON.stringify(prev.products || []);
      if (productsChanged) {
        updated = { ...updated, products: updatedProducts };
      }
      return updated;
    });
  }, [formData.shipper?.country]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.referenceId) newErrors.referenceId = 'Reference ID is required';
    if (!formData.title) newErrors.title = 'Shipment title is required';
    if (!formData.mode) newErrors.mode = 'Mode is required';
    if (!formData.shipmentType) newErrors.shipmentType = 'Shipment type is required';
    if (!formData.shipper?.company) newErrors.shipperCompany = 'Shipper company is required';
    if (!formData.consignee?.company) newErrors.consigneeCompany = 'Consignee company is required';
    if (formData.packages?.length === 0) newErrors.packages = 'At least one package is required';
    if (formData.products?.length === 0) newErrors.products = 'At least one product is required';
    if (!formData.declaredValue || formData.declaredValue <= 0) newErrors.declaredValue = 'Declared value must be greater than 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = () => {
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    // Prepare shipment object to save
    const updatedShipment = {
      ...formData,
      id: formData.id || `SHP-${Date.now()}`,
      referenceId: formData.referenceId || `REF-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
      status: 'ai-review',
      updatedAt: new Date().toISOString(),
      createdAt: formData.createdAt || new Date().toISOString(),
    };

    // Ensure arrays exist
    updatedShipment.products = updatedShipment.products || [];
    updatedShipment.packages = updatedShipment.packages || [];
    updatedShipment.documents = updatedShipment.documents || {};

    // Save to store and navigate to details for AI evaluation
    try {
      shipmentsStore.saveShipment(updatedShipment);
      onNavigate('shipment-details', updatedShipment);
    } catch (err) {
      console.error('Error saving shipment', err);
      alert('Failed to save shipment - please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* BASICS SECTION */}
          <CollapsibleSection
            title="Shipment Basics"
            isOpen={expandedSections.basics}
            onToggle={() => toggleSection('basics')}
            icon={Truck}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Reference ID"
                name="referenceId"
                value={formData.referenceId || ''}
                onChange={handleChange}
                placeholder="REF-2024-001"
                required
              />
              <InputField
                label="Shipment Title"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                placeholder="Electronic Components Shipment"
                required
              />
              <SelectField
                label="Mode"
                name="mode"
                value={formData.mode || ''}
                onChange={handleChange}
                options={modes}
                required
              />
              <SelectField
                label="Shipment Type"
                name="shipmentType"
                value={formData.shipmentType || ''}
                onChange={handleChange}
                options={shipmentTypes}
                required
              />
              <SelectField
                label="Pickup Type"
                name="pickupType"
                value={formData.pickupType || ''}
                onChange={handleChange}
                options={pickupTypes}
              />
              <InputField
                label="Ship Date"
                type="date"
                name="shipDate"
                value={formData.shipDate || ''}
                onChange={handleChange}
              />
              <InputField
                label="Expected Delivery"
                type="date"
                name="expectedDelivery"
                value={formData.expectedDelivery || ''}
                onChange={handleChange}
              />
            </div>
          </CollapsibleSection>

          {/* SHIPPER SECTION */}
          <CollapsibleSection
            title="Shipper Information"
            isOpen={expandedSections.shipper}
            onToggle={() => toggleSection('shipper')}
            icon={Users}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-600">Autofilled from Profile. Use edit to adjust.</p>
              <button
                type="button"
                onClick={() => setShipperEditable(prev => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <Pencil className="w-4 h-4 text-slate-600" />
                <span className="text-slate-700">{shipperEditable ? 'Lock' : 'Edit'}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Company Name"
                name="company"
                value={formData.shipper?.company || profileData?.companyName || ''}
                onChange={(e) => handleNestedChange('shipper', 'company', e.target.value)}
                disabled={!shipperEditable}
                required
                placeholder="ABC Exports"
              />
              <InputField
                label="Contact Name"
                name="contactName"
                value={formData.shipper?.contactName || (profileData ? `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() : '') || ''}
                onChange={(e) => handleNestedChange('shipper', 'contactName', e.target.value)}
                disabled={!shipperEditable}
                placeholder="John Smith"
              />
              <InputField
                label="Phone"
                type="tel"
                name="phone"
                value={formData.shipper?.phone || profileData?.phone || ''}
                onChange={(e) => handleNestedChange('shipper', 'phone', e.target.value)}
                disabled={!shipperEditable}
                placeholder="+1-555-0001"
              />
              <InputField
                label="Email"
                type="email"
                name="email"
                value={formData.shipper?.email || profileData?.email || ''}
                onChange={(e) => handleNestedChange('shipper', 'email', e.target.value)}
                disabled={!shipperEditable}
                placeholder="john@company.com"
              />
              <InputField
                label="Address Line 1"
                name="address1"
                value={formData.shipper?.address1 || profileData?.addressLine1 || ''}
                onChange={(e) => handleNestedChange('shipper', 'address1', e.target.value)}
                disabled={!shipperEditable}
                placeholder="123 Manufacturing St"
              />
              <InputField
                label="Address Line 2"
                name="address2"
                value={formData.shipper?.address2 || profileData?.addressLine2 || ''}
                onChange={(e) => handleNestedChange('shipper', 'address2', e.target.value)}
                disabled={!shipperEditable}
                placeholder="Suite 100"
              />
              <InputField
                label="City"
                name="city"
                value={formData.shipper?.city || profileData?.city || ''}
                onChange={(e) => handleNestedChange('shipper', 'city', e.target.value)}
                disabled={!shipperEditable}
                placeholder="Shanghai"
              />
              <InputField
                label="State/Province"
                name="state"
                value={formData.shipper?.state || profileData?.state || ''}
                onChange={(e) => handleNestedChange('shipper', 'state', e.target.value)}
                disabled={!shipperEditable}
                placeholder="SH"
              />
              <InputField
                label="Postal Code"
                name="postalCode"
                value={formData.shipper?.postalCode || profileData?.pinCode || ''}
                onChange={(e) => handleNestedChange('shipper', 'postalCode', e.target.value)}
                disabled={!shipperEditable}
                placeholder="200000"
              />
              <SelectField
                label="Country"
                name="country"
                value={formData.shipper?.country || profileData?.countryCode || profileCountry || ''}
                onChange={(e) => handleNestedChange('shipper', 'country', e.target.value)}
                disabled={!shipperEditable}
                options={countryOptions.map(c => ({ value: c.code, label: c.name }))}
              />
              <InputField
                label="Tax ID"
                name="taxId"
                value={formData.shipper?.taxId || ''}
                onChange={(e) => handleNestedChange('shipper', 'taxId', e.target.value)}
                disabled={!shipperEditable}
                placeholder="CN123456789"
              />
              <div className="md:col-span-2">
                <CheckboxField
                  label="Exporter of Record"
                  name="exporterOfRecord"
                  checked={formData.shipper?.exporterOfRecord || false}
                  onChange={(e) => handleNestedChange('shipper', 'exporterOfRecord', e.target.checked)}
                  disabled={!shipperEditable}
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* CONSIGNEE SECTION */}
          <CollapsibleSection
            title="Consignee Information"
            isOpen={expandedSections.consignee}
            onToggle={() => toggleSection('consignee')}
            icon={MapPin}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Company Name"
                name="company"
                value={formData.consignee?.company || ''}
                onChange={(e) => handleNestedChange('consignee', 'company', e.target.value)}
                required
                placeholder="Tech Imports Inc"
              />
              <InputField
                label="Contact Name"
                name="contactName"
                value={formData.consignee?.contactName || ''}
                onChange={(e) => handleNestedChange('consignee', 'contactName', e.target.value)}
                placeholder="Jane Doe"
              />
              <InputField
                label="Phone"
                type="tel"
                name="phone"
                value={formData.consignee?.phone || ''}
                onChange={(e) => handleNestedChange('consignee', 'phone', e.target.value)}
                placeholder="+1-555-0101"
              />
              <InputField
                label="Email"
                type="email"
                name="email"
                value={formData.consignee?.email || ''}
                onChange={(e) => handleNestedChange('consignee', 'email', e.target.value)}
                placeholder="jane@company.com"
              />
              <InputField
                label="Address Line 1"
                name="address1"
                value={formData.consignee?.address1 || ''}
                onChange={(e) => handleNestedChange('consignee', 'address1', e.target.value)}
                placeholder="456 Import Ave"
              />
              <InputField
                label="Address Line 2"
                name="address2"
                value={formData.consignee?.address2 || ''}
                onChange={(e) => handleNestedChange('consignee', 'address2', e.target.value)}
                placeholder="Floor 5"
              />
              <InputField
                label="City"
                name="city"
                value={formData.consignee?.city || ''}
                onChange={(e) => handleNestedChange('consignee', 'city', e.target.value)}
                placeholder="New York"
              />
              <InputField
                label="State/Province"
                name="state"
                value={formData.consignee?.state || ''}
                onChange={(e) => handleNestedChange('consignee', 'state', e.target.value)}
                placeholder="NY"
              />
              <InputField
                label="Postal Code"
                name="postalCode"
                value={formData.consignee?.postalCode || ''}
                onChange={(e) => handleNestedChange('consignee', 'postalCode', e.target.value)}
                placeholder="10001"
              />
              <SelectField
                label="Country"
                name="country"
                value={formData.consignee?.country || ''}
                onChange={(e) => handleNestedChange('consignee', 'country', e.target.value)}
                options={countryOptions.map(c => ({ value: c.code, label: c.name }))}
              />
              <InputField
                label="Tax ID"
                name="taxId"
                value={formData.consignee?.taxId || ''}
                onChange={(e) => handleNestedChange('consignee', 'taxId', e.target.value)}
                placeholder="US987654321"
              />
              <div className="md:col-span-2">
                <CheckboxField
                  label="Importer of Record"
                  name="importerOfRecord"
                  checked={formData.consignee?.importerOfRecord || false}
                  onChange={(e) => handleNestedChange('consignee', 'importerOfRecord', e.target.checked)}
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* PACKAGES SECTION */}
          <CollapsibleSection
            title="Packages"
            isOpen={expandedSections.packages}
            onToggle={() => toggleSection('packages')}
            icon={Package}
          >
            <div className="space-y-4">
              {formData.packages && formData.packages.map((pkg, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-semibold text-slate-900">Package {idx + 1}</h4>
                    <button
                      onClick={() => removeArrayItem('packages', idx)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SelectField
                      label="Package Type"
                      name="type"
                      value={pkg.type || ''}
                      onChange={(e) => handleArrayChange('packages', idx, 'type', e.target.value)}
                      options={packageTypes}
                    />
                    <InputField
                      label="Length (cm)"
                      type="number"
                      name="length"
                      value={pkg.length || ''}
                      onChange={(e) => handleArrayChange('packages', idx, 'length', parseFloat(e.target.value))}
                    />
                    <InputField
                      label="Width (cm)"
                      type="number"
                      name="width"
                      value={pkg.width || ''}
                      onChange={(e) => handleArrayChange('packages', idx, 'width', parseFloat(e.target.value))}
                    />
                    <InputField
                      label="Height (cm)"
                      type="number"
                      name="height"
                      value={pkg.height || ''}
                      onChange={(e) => handleArrayChange('packages', idx, 'height', parseFloat(e.target.value))}
                    />
                    <InputField
                      label="Weight"
                      type="number"
                      name="weight"
                      value={pkg.weight || ''}
                      onChange={(e) => handleArrayChange('packages', idx, 'weight', parseFloat(e.target.value))}
                    />
                    <SelectField
                      label="Weight Unit"
                      name="weightUnit"
                      value={pkg.weightUnit || 'kg'}
                      onChange={(e) => handleArrayChange('packages', idx, 'weightUnit', e.target.value)}
                      options={['kg', 'lb']}
                    />
                    <div className="md:col-span-3">
                      <CheckboxField
                        label="Stackable"
                        name="stackable"
                        checked={pkg.stackable || false}
                        onChange={(e) => handleArrayChange('packages', idx, 'stackable', e.target.checked)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('packages', {
                  id: `PKG-${Date.now()}`,
                  type: '',
                  length: '',
                  width: '',
                  height: '',
                  dimUnit: 'cm',
                  weight: '',
                  weightUnit: 'kg',
                  stackable: false,
                })}
                className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-slate-400 hover:text-slate-700 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Package
              </button>
            </div>
          </CollapsibleSection>

          {/* PRODUCTS SECTION */}
          <CollapsibleSection
            title="Products"
            isOpen={expandedSections.products}
            onToggle={() => toggleSection('products')}
            icon={Package}
          >
            <div className="space-y-6">
              {formData.products && formData.products.map((product, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">Product {idx + 1}</h4>
                      {product.category && <p className="text-xs text-slate-600 mt-1">Category: <span className="font-semibold text-slate-700">{product.category}</span></p>}
                    </div>
                    <button
                      onClick={() => removeArrayItem('products', idx)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Product Basics */}
                    <InputField
                      label="Product Name"
                      name="name"
                      value={product.name || ''}
                      onChange={(e) => handleArrayChange('products', idx, 'name', e.target.value)}
                      placeholder="Electronic Integrated Circuits"
                    />
                    <InputField
                      label="Category"
                      name="category"
                      value={product.category || ''}
                      onChange={(e) => handleArrayChange('products', idx, 'category', e.target.value)}
                      placeholder="Electronics, Textiles, Medical, etc."
                    />
                    <div className="md:col-span-2">
                      <InputField
                        label="Description"
                        name="description"
                        value={product.description || ''}
                        onChange={(e) => handleArrayChange('products', idx, 'description', e.target.value)}
                        placeholder="Product description"
                      />
                    </div>

                    {/* HS CODE SECTION */}
                    <div className="md:col-span-2 space-y-3">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        HS Code
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={product.hsCode || ''}
                        onChange={(e) => handleArrayChange('products', idx, 'hsCode', e.target.value)}
                        placeholder="8541.10.00"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {/* HS Code loading indicator */}
                      {loadingHsSuggestions[product.id] && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-700 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            Analyzing product for HS code suggestions...
                          </p>
                        </div>
                      )}

                      {/* AI Suggested HS Codes - Attractive Cards */}
                      {hsSuggestions[product.id] && hsSuggestions[product.id].length > 0 && (
                        <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl w-full">
                          <h5 className="text-sm font-bold text-purple-900 mb-3 flex items-center gap-2">
                            <span className="inline-block w-3 h-3 bg-purple-500 rounded-full"></span>
                            AI Suggested HS Codes
                          </h5>
                          <div className="space-y-3 max-h-64 overflow-y-auto w-full">
                            {hsSuggestions[product.id].map((sugg, sidx) => (
                              <button
                                key={sidx}
                                type="button"
                                onClick={() => {
                                  handleArrayChange('products', idx, 'hsCode', sugg.code);
                                  setSelectedHsIndex(prev => ({ ...prev, [product.id]: sidx }));
                                }}
                                className={`w-full p-3 rounded-lg text-left border-2 transition-all transform hover:scale-105 ${
                                  selectedHsIndex[product.id] === sidx
                                    ? 'border-purple-500 bg-white shadow-lg ring-2 ring-purple-200'
                                    : 'border-purple-300 bg-white hover:border-purple-400 shadow'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="text-slate-900 font-mono font-bold text-base">{sugg.code}</div>
                                    <div className="text-xs text-slate-600 mt-1">{sugg.description}</div>
                                    {sugg.restrictions && sugg.restrictions.length > 0 && (
                                      <div className="text-xs text-slate-500 mt-2 italic">{sugg.restrictions.join(' • ')}</div>
                                    )}
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    {sugg.status === 'valid' && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Valid</span>}
                                    {sugg.status === 'restricted' && <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded">Restricted</span>}
                                    {sugg.status === 'banned' && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">Banned</span>}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* HS Validation Result */}
                      {hsValidation[product.id] && (
                        <div className={`mt-3 p-3 rounded-lg border-l-4 ${
                          hsValidation[product.id].status === 'valid'
                            ? 'bg-green-50 border-l-green-500'
                            : hsValidation[product.id].status === 'restricted'
                            ? 'bg-amber-50 border-l-amber-500'
                            : 'bg-red-50 border-l-red-500'
                        }`}>
                          <p className={`text-sm font-medium ${
                            hsValidation[product.id].status === 'valid'
                              ? 'text-green-900'
                              : hsValidation[product.id].status === 'restricted'
                              ? 'text-amber-900'
                              : 'text-red-900'
                          }`}>
                            {hsValidation[product.id].message}
                          </p>
                          {hsValidation[product.id].requiredDocs && hsValidation[product.id].requiredDocs.length > 0 && (
                            <div className="mt-2 text-xs text-slate-700">
                              <span className="font-semibold">Required Docs:</span> {hsValidation[product.id].requiredDocs.join(', ')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Quantity & Pricing */}
                    <InputField
                      label="Quantity"
                      type="number"
                      name="qty"
                      value={product.qty || ''}
                      onChange={(e) => handleArrayChange('products', idx, 'qty', parseFloat(e.target.value))}
                    />
                    <SelectField
                      label="Unit of Measure"
                      name="uom"
                      value={product.uom || ''}
                      onChange={(e) => handleArrayChange('products', idx, 'uom', e.target.value)}
                      options={uoms}
                    />
                    <InputField
                      label="Unit Price"
                      type="number"
                      name="unitPrice"
                      value={product.unitPrice || ''}
                      onChange={(e) => handleArrayChange('products', idx, 'unitPrice', parseFloat(e.target.value))}
                    />
                    <InputField
                      label="Total Value"
                      type="number"
                      name="totalValue"
                      value={product.totalValue || ''}
                      onChange={(e) => handleArrayChange('products', idx, 'totalValue', parseFloat(e.target.value))}
                    />
                    <SelectField
                      label="Origin Country"
                      name="originCountry"
                      value={product.originCountry || formData.shipper?.country || profileCountry || ''}
                      onChange={(e) => handleArrayChange('products', idx, 'originCountry', e.target.value)}
                      options={countryOptions.map(c => ({ value: c.code, label: c.name }))}
                    />
                    <InputField
                      label="Reason for Export"
                      name="reasonForExport"
                      value={product.reasonForExport || ''}
                      onChange={(e) => handleArrayChange('products', idx, 'reasonForExport', e.target.value)}
                      placeholder="Commercial Trade"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('products', {
                  id: `PROD-${Date.now()}`,
                  name: '',
                  description: '',
                  hsCode: '',
                  category: '',
                  qty: '',
                  uom: '',
                  unitPrice: '',
                  totalValue: '',
                  originCountry: profileCountry || formData.shipper?.country || '',
                  reasonForExport: '',
                })}
                className="w-full py-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center gap-2 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" /> Add Product
              </button>
            </div>
          </CollapsibleSection>

          {/* SERVICE & BILLING SECTION */}
          <CollapsibleSection
            title="Service & Billing"
            isOpen={expandedSections.service}
            onToggle={() => toggleSection('service')}
            icon={DollarSign}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Service Level"
                name="serviceLevel"
                value={formData.serviceLevel || ''}
                onChange={handleChange}
                options={serviceLevels}
              />
              <SelectField
                label="Incoterm"
                name="incoterm"
                value={formData.incoterm || ''}
                onChange={handleChange}
                options={incoterms}
              />
              <SelectField
                label="Bill To"
                name="billTo"
                value={formData.billTo || ''}
                onChange={handleChange}
                options={billToOptions}
              />
              <InputField
                label="Billing Account Number"
                name="billingAccountNumber"
                value={formData.billingAccountNumber || ''}
                onChange={handleChange}
                placeholder="ACC-12345678"
              />
              <SelectField
                label="Currency"
                name="currency"
                value={formData.currency || ''}
                onChange={handleChange}
                options={currencies}
              />
              <InputField
                label="Declared Value"
                type="number"
                name="declaredValue"
                value={formData.declaredValue || ''}
                onChange={handleChange}
                required
              />
              <SelectField
                label="Payment Timing"
                name="paymentTiming"
                value={formData.paymentTiming || ''}
                onChange={handleChange}
                options={paymentTimings}
              />
              <SelectField
                label="Payment Method"
                name="paymentMethod"
                value={formData.paymentMethod || ''}
                onChange={handleChange}
                options={paymentMethods}
              />
              <div className="md:col-span-2">
                <CheckboxField
                  label="Insurance Required"
                  name="insuranceRequired"
                  checked={formData.insuranceRequired || false}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* COMPLIANCE SECTION */}
          <CollapsibleSection
            title="Compliance & Restrictions"
            isOpen={expandedSections.compliance}
            onToggle={() => toggleSection('compliance')}
            icon={AlertTriangle}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CheckboxField
                label="Contains Dangerous Goods"
                name="dangerousGoods"
                checked={formData.dangerousGoods || false}
                onChange={handleChange}
              />
              <CheckboxField
                label="Contains Lithium Batteries"
                name="lithiumBattery"
                checked={formData.lithiumBattery || false}
                onChange={handleChange}
              />
              <CheckboxField
                label="Food/Pharma Product"
                name="foodPharmaFlag"
                checked={formData.foodPharmaFlag || false}
                onChange={handleChange}
              />
              <CheckboxField
                label="Temperature Controlled Required"
                name="temperatureControlled"
                checked={formData.temperatureControlled || false}
                onChange={handleChange}
              />
              <InputField
                label="ECCN (Export Control Classification Number)"
                name="eccn"
                value={formData.eccn || ''}
                onChange={handleChange}
                placeholder="0A919"
              />
              <CheckboxField
                label="Export License Required"
                name="exportLicenseRequired"
                checked={formData.exportLicenseRequired || false}
                onChange={handleChange}
              />
              {formData.exportLicenseRequired && (
                <InputField
                  label="License Number"
                  name="licenseNumber"
                  value={formData.licenseNumber || ''}
                  onChange={handleChange}
                  placeholder="EXP-LIC-12345"
                />
              )}
              <CheckboxField
                label="Item Contains Restricted Materials"
                name="restrictedFlag"
                checked={formData.restrictedFlag || false}
                onChange={handleChange}
              />
              <CheckboxField
                label="Suspected Sanctioned Country"
                name="sanctionedCountryFlag"
                checked={formData.sanctionedCountryFlag || false}
                onChange={handleChange}
              />
            </div>
          </CollapsibleSection>

          {/* DOCUMENTS SECTION */}
          <CollapsibleSection
            title="Attachments"
            isOpen={expandedSections.documents}
            onToggle={() => toggleSection('documents')}
            icon={FileText}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CheckboxField
                label="Commercial Invoice"
                name="commercialInvoice"
                checked={formData.documents?.commercialInvoice || false}
                onChange={(e) => handleNestedChange('documents', 'commercialInvoice', e.target.checked)}
              />
              <CheckboxField
                label="Packing List"
                name="packingList"
                checked={formData.documents?.packingList || false}
                onChange={(e) => handleNestedChange('documents', 'packingList', e.target.checked)}
              />
              <CheckboxField
                label="Certificate of Origin"
                name="certificateOfOrigin"
                checked={formData.documents?.certificateOfOrigin || false}
                onChange={(e) => handleNestedChange('documents', 'certificateOfOrigin', e.target.checked)}
              />
              <CheckboxField
                label="Export License"
                name="exportLicense"
                checked={formData.documents?.exportLicense || false}
                onChange={(e) => handleNestedChange('documents', 'exportLicense', e.target.checked)}
              />
              <CheckboxField
                label="Import License"
                name="importLicense"
                checked={formData.documents?.importLicense || false}
                onChange={(e) => handleNestedChange('documents', 'importLicense', e.target.checked)}
              />
              <CheckboxField
                label="Safety Data Sheet (SDS)"
                name="sds"
                checked={formData.documents?.sds || false}
                onChange={(e) => handleNestedChange('documents', 'sds', e.target.checked)}
              />
              <CheckboxField
                label="Airway Bill (AWB)"
                name="awb"
                checked={formData.documents?.awb || false}
                onChange={(e) => handleNestedChange('documents', 'awb', e.target.checked)}
              />
              <CheckboxField
                label="Bill of Lading (BOL)"
                name="bol"
                checked={formData.documents?.bol || false}
                onChange={(e) => handleNestedChange('documents', 'bol', e.target.checked)}
              />
              <CheckboxField
                label="CMR (International Road Transport)"
                name="cmr"
                checked={formData.documents?.cmr || false}
                onChange={(e) => handleNestedChange('documents', 'cmr', e.target.checked)}
              />
            </div>
          </CollapsibleSection>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 pt-8 border-t border-slate-200">
            <button
              onClick={handleSubmit}
              className="flex-1 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              {formData.status === 'token-generated' ? 'Proceed to Booking' : 'Upload and Submit for AI Review'}
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex-1 py-4 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* RIGHT SIDEBAR - SUMMARY */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-lg sticky top-6 overflow-hidden">
            {/* Summary Cards */}
            <div className="p-6 space-y-6 max-h-[calc(100vh-100px)] overflow-y-auto">
              
              {/* Shipment Overview */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Shipment Overview</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Reference ID:</span>
                    <span className="text-slate-900 font-mono">{formData.referenceId || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Mode:</span>
                    <span className="text-slate-900">{formData.mode || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type:</span>
                    <span className="text-slate-900">{formData.shipmentType || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Service:</span>
                    <span className="text-slate-900">{formData.serviceLevel || '—'}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-semibold text-slate-900 mb-3">Parties</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-600 mb-1">Shipper:</p>
                    <p className="text-slate-900 font-medium">{formData.shipper?.company || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-1">Consignee:</p>
                    <p className="text-slate-900 font-medium">{formData.consignee?.company || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-semibold text-slate-900 mb-3">Weight & Packages</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Packages:</span>
                    <span className="text-slate-900 font-semibold">{formData.packages?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Products:</span>
                    <span className="text-slate-900 font-semibold">{formData.products?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Weight:</span>
                    <span className="text-slate-900">{formData.totalWeight || '—'} kg</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-semibold text-slate-900 mb-3">Pricing Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Base Price:</span>
                    <span className="text-slate-900">${pricing.basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Service Charge:</span>
                    <span className="text-slate-900">${pricing.serviceCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Clearance:</span>
                    <span className="text-slate-900">${pricing.customsClearance.toFixed(2)}</span>
                  </div>
                  {formData.insuranceRequired && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Insurance:</span>
                      <span className="text-slate-900">${pricing.insurance.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-t border-slate-200">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="text-slate-900">${pricing.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax (18%):</span>
                    <span className="text-slate-900">${pricing.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3 border-t border-slate-200 text-base font-semibold">
                    <span className="text-slate-900">Total:</span>
                    <span className="text-blue-600">${pricing.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${formData.referenceId || 'shipment'}-summary.json`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full py-2 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                >
                  Download Summary
                </button>
              </div>

              {/* Status Badge */}
              {formData.status && (
                <div className="border-t border-slate-200 pt-6">
                  <div className={`p-3 rounded-lg text-center text-sm font-semibold ${
                    formData.status === 'token-generated' 
                      ? 'bg-green-50 text-green-700'
                      : formData.status === 'ai-approved'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-slate-50 text-slate-700'
                  }`}>
                    Status: {formData.status.toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShipmentForm;
