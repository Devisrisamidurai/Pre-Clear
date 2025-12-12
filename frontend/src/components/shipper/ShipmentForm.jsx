import { useState, useEffect } from 'react';
import { 
  MapPin, Package, Truck, Clock, DollarSign, Info, AlertCircle, CheckCircle2, 
  AlertTriangle, ChevronDown, Plus, Trash2, FileText, Globe, Settings, Users, Pencil, Sparkles, Upload
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
const reasonsForExport = [
  'Sending a gift',
  'Commercial Trade',
  'Sample/Prototype',
  'Return/Repair',
  'Personal Effects',
  'Temporary Import',
  'Exhibition',
  'Other'
];

// Helper to get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Customs clearance configuration by country/region
const CLEARANCE_CONFIG = {
  'IN': { base: 50, threshold: 10000, formalFee: 2000, extraLineItemFee: 100, specialCommodityFee: 1500 },
  'US': { base: 0, threshold: 800, formalFee: 35, extraLineItemFee: 5, specialCommodityFee: 25 },
  'GB': { base: 20, threshold: 150, formalFee: 40, extraLineItemFee: 5, specialCommodityFee: 30 },
  'FR': { base: 20, threshold: 150, formalFee: 40, extraLineItemFee: 5, specialCommodityFee: 30 },
  'DE': { base: 20, threshold: 150, formalFee: 40, extraLineItemFee: 5, specialCommodityFee: 30 },
  'IT': { base: 20, threshold: 150, formalFee: 40, extraLineItemFee: 5, specialCommodityFee: 30 },
  'ES': { base: 20, threshold: 150, formalFee: 40, extraLineItemFee: 5, specialCommodityFee: 30 },
  'NL': { base: 20, threshold: 150, formalFee: 40, extraLineItemFee: 5, specialCommodityFee: 30 },
  'BE': { base: 20, threshold: 150, formalFee: 40, extraLineItemFee: 5, specialCommodityFee: 30 },
  'default': { base: 30, threshold: 100, formalFee: 50, extraLineItemFee: 5, specialCommodityFee: 30 }
};

// Pickup charge configuration by origin country
const PICKUP_CONFIG = {
  'IN': 250,
  'US': 35,
  'GB': 25,
  'FR': 28,
  'DE': 30,
  'IT': 27,
  'ES': 26,
  'NL': 32,
  'BE': 29,
  'CN': 40,
  'JP': 50,
  'SG': 45,
  'AU': 55,
  'CA': 40,
  'MX': 38,
  'BR': 42,
  'default': 50
};

// Helper function to calculate estimated customs clearance
const calculateClearance = (destCountry, customsValue, lineItemCount, isSpecialCommodity) => {
  const country = destCountry?.toUpperCase() || '';
  const config = CLEARANCE_CONFIG[country] || CLEARANCE_CONFIG['default'];
  
  let clearance = config.base;
  
  // Add formal clearance fee if customs value exceeds threshold
  if (customsValue > config.threshold) {
    clearance += config.formalFee;
  }
  
  // Add extra line item fee if line items > 5
  if (lineItemCount > 5) {
    clearance += (lineItemCount - 5) * config.extraLineItemFee;
  }
  
  // Add special commodity surcharge if applicable
  if (isSpecialCommodity) {
    clearance += config.specialCommodityFee;
  }
  
  return Math.round(clearance);
};

// Helper function to calculate pickup charge based on origin country
const calculatePickupCharge = (originCountry) => {
  const country = originCountry?.toUpperCase() || '';
  return PICKUP_CONFIG[country] || PICKUP_CONFIG['default'];
};

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

// Small helper: return state/province options for a given country code
const getStateOptions = (countryCode) => {
  const cc = (countryCode || '').toUpperCase();
  const US_STATES = [
    { value: 'AL', label: 'Alabama' },{ value: 'AK', label: 'Alaska' },{ value: 'AZ', label: 'Arizona' },{ value: 'AR', label: 'Arkansas' },{ value: 'CA', label: 'California' },{ value: 'CO', label: 'Colorado' },{ value: 'CT', label: 'Connecticut' },{ value: 'DE', label: 'Delaware' },{ value: 'FL', label: 'Florida' },{ value: 'GA', label: 'Georgia' },{ value: 'HI', label: 'Hawaii' },{ value: 'ID', label: 'Idaho' },{ value: 'IL', label: 'Illinois' },{ value: 'IN', label: 'Indiana' },{ value: 'IA', label: 'Iowa' },{ value: 'KS', label: 'Kansas' },{ value: 'KY', label: 'Kentucky' },{ value: 'LA', label: 'Louisiana' },{ value: 'ME', label: 'Maine' },{ value: 'MD', label: 'Maryland' },{ value: 'MA', label: 'Massachusetts' },{ value: 'MI', label: 'Michigan' },{ value: 'MN', label: 'Minnesota' },{ value: 'MS', label: 'Mississippi' },{ value: 'MO', label: 'Missouri' },{ value: 'MT', label: 'Montana' },{ value: 'NE', label: 'Nebraska' },{ value: 'NV', label: 'Nevada' },{ value: 'NH', label: 'New Hampshire' },{ value: 'NJ', label: 'New Jersey' },{ value: 'NM', label: 'New Mexico' },{ value: 'NY', label: 'New York' },{ value: 'NC', label: 'North Carolina' },{ value: 'ND', label: 'North Dakota' },{ value: 'OH', label: 'Ohio' },{ value: 'OK', label: 'Oklahoma' },{ value: 'OR', label: 'Oregon' },{ value: 'PA', label: 'Pennsylvania' },{ value: 'RI', label: 'Rhode Island' },{ value: 'SC', label: 'South Carolina' },{ value: 'SD', label: 'South Dakota' },{ value: 'TN', label: 'Tennessee' },{ value: 'TX', label: 'Texas' },{ value: 'UT', label: 'Utah' },{ value: 'VT', label: 'Vermont' },{ value: 'VA', label: 'Virginia' },{ value: 'WA', label: 'Washington' },{ value: 'WV', label: 'West Virginia' },{ value: 'WI', label: 'Wisconsin' },{ value: 'WY', label: 'Wyoming' }
  ];
  const CA_PROVINCES = [
    { value: 'AB', label: 'Alberta' },{ value: 'BC', label: 'British Columbia' },{ value: 'MB', label: 'Manitoba' },{ value: 'NB', label: 'New Brunswick' },{ value: 'NL', label: 'Newfoundland and Labrador' },{ value: 'NS', label: 'Nova Scotia' },{ value: 'ON', label: 'Ontario' },{ value: 'PE', label: 'Prince Edward Island' },{ value: 'QC', label: 'Quebec' },{ value: 'SK', label: 'Saskatchewan' },{ value: 'NT', label: 'Northwest Territories' },{ value: 'NU', label: 'Nunavut' },{ value: 'YT', label: 'Yukon' }
  ];
  const IN_STATES = [
    { value: 'AN', label: 'Andaman and Nicobar Islands' },{ value: 'AP', label: 'Andhra Pradesh' },{ value: 'AR', label: 'Arunachal Pradesh' },{ value: 'AS', label: 'Assam' },{ value: 'BR', label: 'Bihar' },{ value: 'CH', label: 'Chandigarh' },{ value: 'CT', label: 'Chhattisgarh' },{ value: 'DN', label: 'Dadra and Nagar Haveli' },{ value: 'DD', label: 'Daman and Diu' },{ value: 'DL', label: 'Delhi' },{ value: 'GA', label: 'Goa' },{ value: 'GJ', label: 'Gujarat' },{ value: 'HR', label: 'Haryana' },{ value: 'HP', label: 'Himachal Pradesh' },{ value: 'JK', label: 'Jammu and Kashmir' },{ value: 'JH', label: 'Jharkhand' },{ value: 'KA', label: 'Karnataka' },{ value: 'KL', label: 'Kerala' },{ value: 'LD', label: 'Lakshadweep' },{ value: 'MP', label: 'Madhya Pradesh' },{ value: 'MH', label: 'Maharashtra' },{ value: 'MN', label: 'Manipur' },{ value: 'ML', label: 'Meghalaya' },{ value: 'MZ', label: 'Mizoram' },{ value: 'NL', label: 'Nagaland' },{ value: 'OR', label: 'Odisha' },{ value: 'PY', label: 'Puducherry' },{ value: 'PB', label: 'Punjab' },{ value: 'RJ', label: 'Rajasthan' },{ value: 'SK', label: 'Sikkim' },{ value: 'TN', label: 'Tamil Nadu' },{ value: 'TG', label: 'Telangana' },{ value: 'TR', label: 'Tripura' },{ value: 'UP', label: 'Uttar Pradesh' },{ value: 'UT', label: 'Uttarakhand' },{ value: 'WB', label: 'West Bengal' }
  ];
  const AU_STATES = [
    { value: 'NSW', label: 'New South Wales' },{ value: 'VIC', label: 'Victoria' },{ value: 'QLD', label: 'Queensland' },{ value: 'WA', label: 'Western Australia' },{ value: 'SA', label: 'South Australia' },{ value: 'TAS', label: 'Tasmania' },{ value: 'ACT', label: 'Australian Capital Territory' },{ value: 'NT', label: 'Northern Territory' }
  ];

  if (cc === 'US') return US_STATES;
  if (cc === 'CA') return CA_PROVINCES;
  if (cc === 'IN') return IN_STATES;
  if (cc === 'AU') return AU_STATES;
  // For countries without a predefined list, return an empty array so SelectField shows placeholder
  return [];
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
      className="w-full flex items-center justify-between p-4 transition-colors"
      style={{ background: '#EAD8C3' }}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5" style={{ color: '#2F1B17' }} />}
        <h3 className="font-semibold" style={{ color: '#2F1B17' }}>{title}</h3>
      </div>
      <ChevronDown 
        className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        style={{ color: '#2F1B17' }}
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
  // Initialize form data with default values for all array fields
  const [formData, setFormData] = useState(() => ({
    packages: [],
    products: [],
    documents: [],
    documentRequests: [],
    ...shipment
  }));
  const [profileCountry, setProfileCountry] = useState('');
  const [profileCurrency, setProfileCurrency] = useState('USD');
  const [profileData, setProfileData] = useState(null);
  const [shipperEditable, setShipperEditable] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basics: true,
    shipper: false,
    consignee: false,
    packages: false,
    service: false,
    documents: false,
  });
  const [requiredDocuments, setRequiredDocuments] = useState([]);
  const [documentFiles, setDocumentFiles] = useState({});
  const [analyzingDocuments, setAnalyzingDocuments] = useState(false);
  const [errors, setErrors] = useState({});
  const [pricing, setPricing] = useState({
    basePrice: 0,
    serviceCharge: 0,
    customsClearance: 0,
    pickupCharge: 0,
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

  // Shared yellow button style used across the form (darker yellow, coffee-brown border/text)
  const yellowButtonStyle = { background: '#F2B705', color: '#2F1B17', border: '1px solid #2F1B17' };
  // Grey style for Cancel button
  const greyButtonStyle = { background: '#E5E7EB', color: '#111827', border: '1px solid #D1D5DB' };


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
      // Initialize packages if not present
      const updatedPackages = prev.packages && prev.packages.length > 0 ? prev.packages : [
        {
          id: `PKG-${Date.now()}`,
          type: '',
          length: '',
          width: '',
          height: '',
          dimUnit: 'cm',
          weight: '',
          weightUnit: 'kg',
          stackable: false,
          products: [],
        }
      ];

      return {
        ...prev,
        shipper: nextShipper,
        currency: resolvedCurrency,
        serviceLevel: prev.serviceLevel || 'Standard',
        packages: updatedPackages,
      };
    });
    setExpandedSections(prev => ({ ...prev, shipper: true, service: true, packages: true }));
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
      // Ensure the array exists and is an array
      const currentArray = Array.isArray(prev[arrayName]) ? prev[arrayName] : [];
      const newArray = [...currentArray];
      
      // Ensure the item at index exists
      if (!newArray[index]) {
        newArray[index] = {};
      }
      
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  const addArrayItem = (arrayName, template) => {
    setFormData(prev => {
      // Ensure the array exists and is an array
      const currentArray = Array.isArray(prev[arrayName]) ? prev[arrayName] : [];
      return {
        ...prev,
        [arrayName]: [...currentArray, template]
      };
    });
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => {
      // Ensure the array exists and is an array
      const currentArray = Array.isArray(prev[arrayName]) ? prev[arrayName] : [];
      return {
        ...prev,
        [arrayName]: currentArray.filter((_, i) => i !== index)
      };
    });
  };

  // Calculate pricing and customs value
  useEffect(() => {
    const serviceLevelMultiplier = {
      'Standard': 1.0,
      'Express': 1.5,
      'Economy': 0.8,
      'Freight': 0.7,
    };
    
    // Auto-calculate customs value from package products
    let calculatedCustomsValue = 0;
    let lineItemCount = 0;
    if (formData.packages && Array.isArray(formData.packages)) {
      formData.packages.forEach(pkg => {
        if (pkg.products && Array.isArray(pkg.products)) {
          pkg.products.forEach(prod => {
            calculatedCustomsValue += parseFloat(prod.totalValue) || 0;
            lineItemCount += 1;
          });
        }
      });
    }
    
    // Update customs value in form data
    if (calculatedCustomsValue > 0 && formData.customsValue !== calculatedCustomsValue) {
      setFormData(prev => ({ ...prev, customsValue: calculatedCustomsValue }));
    }
    
    const customsValue = formData.customsValue || calculatedCustomsValue || 0;
    
    // Only calculate pricing if customs value is greater than zero (i.e., products exist)
    if (customsValue <= 0) {
      setPricing({
        basePrice: 0,
        serviceCharge: 0,
        customsClearance: 0,
        pickupCharge: 0,
        insurance: 0,
        subtotal: 0,
        tax: 0,
        total: 0
      });
      return;
    }
    
    const basePrice = customsValue * 0.05;
    const serviceCharge = basePrice * (serviceLevelMultiplier[formData.serviceLevel] || 1.0);
    
    // Calculate estimated customs clearance
    const destCountry = formData.consignee?.country || formData.shipper?.country || '';
    const isSpecialCommodity = formData.specialCommodity || false;
    const customsClearance = calculateClearance(destCountry, customsValue, lineItemCount, isSpecialCommodity);
    
    // Calculate pickup charge if scheduled pickup is selected
    const originCountry = formData.shipper?.country || '';
    let pickupCharge = 0;
    if (formData.pickupType === 'Scheduled Pickup') {
      pickupCharge = calculatePickupCharge(originCountry);
    }
    
    const subtotal = basePrice + serviceCharge + customsClearance + pickupCharge;
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    setPricing({
      basePrice,
      serviceCharge,
      customsClearance,
      pickupCharge,
      insurance: 0,
      subtotal,
      tax,
      total
    });
  }, [formData.packages, formData.customsValue, formData.serviceLevel, formData.consignee?.country, formData.shipper?.country, formData.specialCommodity, formData.pickupType]);

  // Trigger HS code suggestions when product name/description/category change (iterate packages -> products)
  useEffect(() => {
    if (!formData.packages) return;

    formData.packages.forEach(pkg => {
      if (!pkg.products) return;
      pkg.products.forEach(async (product) => {
        const productKey = product.id || `${pkg.id || 'pkg'}-${Math.random()}`;
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
    });
    // build dependency by concatenating product names/descriptions across packages
  }, [formData.packages ? formData.packages.map(pkg => (pkg.products || []).map(p => `${p.name}|${p.description}|${p.category}`).join('||')).join('|||') : '']);

  // Validate HS codes when changed (iterate packages -> products)
  useEffect(() => {
    if (!formData.packages) return;

    formData.packages.forEach(pkg => {
      if (!pkg.products) return;
      pkg.products.forEach(async (product) => {
        const productKey = product.id || `${pkg.id || 'pkg'}-${Math.random()}`;
        if (!product.hsCode || product.hsCode.trim().length < 4) return;
        try {
          const validation = await validateAndCheckHSCode(product.hsCode, formData.consignee?.country || formData.shipper?.country);
          setHsValidation(prev => ({ ...prev, [productKey]: validation }));
        } catch (err) {
          console.error('HS validation error', err);
        }
      });
    });
  }, [formData.packages ? formData.packages.map(pkg => (pkg.products || []).map(p => p.hsCode).join('|')).join('||') : '', formData.consignee?.country, formData.shipper?.country]);

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
      // Update origin country for products within packages
      if (prev.packages && Array.isArray(prev.packages)) {
        const updatedPackages = prev.packages.map(pkg => {
          if (pkg.products && Array.isArray(pkg.products)) {
            const updatedProducts = pkg.products.map(p => ({
              ...p,
              originCountry: p.originCountry || code
            }));
            return { ...pkg, products: updatedProducts };
          }
          return pkg;
        });
        updated = { ...updated, packages: updatedPackages };
      }
      return updated;
    });
  }, [formData.shipper?.country]);

  const validateForm = () => {
    const newErrors = {};
    
    // Reference ID removed from shipper UI — backend will generate if missing
    if (!formData.title) newErrors.title = 'Shipment title is required';
    if (!formData.mode) newErrors.mode = 'Mode is required';
    if (!formData.shipmentType) newErrors.shipmentType = 'Shipment type is required';
    if (!formData.shipper?.company) newErrors.shipperCompany = 'Shipper company is required';
    if (!formData.consignee?.company) newErrors.consigneeCompany = 'Consignee company is required';
    if (formData.packages?.length === 0) newErrors.packages = 'At least one package is required';
    
    // Check that each package has at least one product
    if (formData.packages && formData.packages.length > 0) {
      formData.packages.forEach((pkg, idx) => {
        if (!pkg.products || pkg.products.length === 0) {
          newErrors[`package${idx}Products`] = `Package ${idx + 1} must have at least one product`;
        }
      });
    }
    
    // Calculate and validate customs value
    let calculatedCustomsValue = 0;
    if (formData.packages && Array.isArray(formData.packages)) {
      formData.packages.forEach(pkg => {
        if (pkg.products && Array.isArray(pkg.products)) {
          pkg.products.forEach(prod => {
            calculatedCustomsValue += parseFloat(prod.totalValue) || 0;
          });
        }
      });
    }
    
    if (calculatedCustomsValue <= 0) {
      newErrors.customsValue = 'Customs value must be greater than 0. Please add products with values.';
    }
    
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
    updatedShipment.packages = updatedShipment.packages || [];
    updatedShipment.documents = updatedShipment.documents || {};
    
    // Ensure each package has products array
    updatedShipment.packages = updatedShipment.packages.map(pkg => ({
      ...pkg,
      products: pkg.products || []
    }));
    
    // Calculate customs value from packages (sum of product totalValue)
    let calculatedCustomsValue = 0;
    updatedShipment.packages.forEach(pkg => {
      if (pkg.products && Array.isArray(pkg.products)) {
        pkg.products.forEach(prod => {
          calculatedCustomsValue += parseFloat(prod.totalValue) || 0;
        });
      }
    });
    updatedShipment.customsValue = calculatedCustomsValue;

    // Calculate total shipment weight (sum of package weight * quantity if provided)
    const totalWeight = updatedShipment.packages.reduce((acc, pkg) => {
      const pkgQty = pkg.quantity || 1;
      const pkgWeight = parseFloat(pkg.weight || 0);
      return acc + (pkgWeight * pkgQty);
    }, 0);
    updatedShipment.weight = totalWeight || updatedShipment.weight || 0;

    // Set declared value from calculated customs value if not explicitly provided
    updatedShipment.value = (updatedShipment.value && updatedShipment.value !== '') ? updatedShipment.value : String(calculatedCustomsValue || 0);

    // Ensure currency is set
    updatedShipment.currency = updatedShipment.currency || profileCurrency || 'USD';

    // Ensure shipmentType and mode have defaults if missing
    updatedShipment.shipmentType = updatedShipment.shipmentType || 'International';
    updatedShipment.mode = updatedShipment.mode || 'Air';

    // Save uploaded documents from form to uploadedDocuments
    if (Object.keys(documentFiles).length > 0) {
      updatedShipment.uploadedDocuments = updatedShipment.uploadedDocuments || {};
      Object.entries(documentFiles).forEach(([docName, file]) => {
        updatedShipment.uploadedDocuments[docName.toLowerCase().replace(/\s+/g, '_')] = {
          name: docName,
          fileName: file.name,
          uploaded: true,
          uploadedAt: new Date().toISOString(),
          source: 'form'
        };
      });
    }

    // Save to store and navigate to details for AI evaluation
    try {
      shipmentsStore.saveShipment(updatedShipment);
      onNavigate('shipment-details', updatedShipment);
    } catch (err) {
      console.error('Error saving shipment', err);
      alert('Failed to save shipment - please try again.');
    }
  };

  // Download the current shipment summary as a PDF.
  // Uses jsPDF via CDN (dynamically injected) so no build-time dependency required.
  const downloadSummaryPdf = async () => {
    try {
      const content = JSON.stringify(formData, null, 2);

      // Dynamically load jsPDF UMD if not already available
      if (!window.jspdf) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }

      // jsPDF exposes a `jspdf` global containing `jsPDF`
      const JsPDF = window.jspdf && (window.jspdf.jsPDF || window.jspdf);
      if (!JsPDF) throw new Error('jsPDF not available');

      const doc = new JsPDF();
      doc.setFontSize(10);

      // Split long JSON into lines that fit PDF width
      const lines = doc.splitTextToSize(content, 180);
      doc.text(lines, 10, 10);

      const fileName = `${(formData.title || 'shipment').replace(/[^a-z0-9-_]/gi, '_')}-summary.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error('PDF generation failed', err);
      // Fallback: download JSON if PDF generation fails
      const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.title || 'shipment'}-summary.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: '#F5F5F5' }}>
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
              {formData.pickupType === 'Drop-off' && (
                <InputField
                  label="Estimated Drop-off Date"
                  type="date"
                  name="estimatedDropoffDate"
                  value={formData.estimatedDropoffDate || ''}
                  onChange={handleChange}
                  min={getTodayDateString()}
                />
              )}
              {formData.pickupType === 'Scheduled Pickup' && (
                <>
                  <InputField
                    label="Pickup Location"
                    name="pickupLocation"
                    value={formData.pickupLocation || ''}
                    onChange={handleChange}
                    placeholder="Enter pickup address"
                  />
                  <InputField
                    label="Pickup Date"
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate || ''}
                    onChange={handleChange}
                    min={getTodayDateString()}
                  />
                  <InputField
                    label="Earliest Pickup Time"
                    type="time"
                    name="pickupTimeEarliest"
                    value={formData.pickupTimeEarliest || ''}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Latest Pickup Time"
                    type="time"
                    name="pickupTimeLatest"
                    value={formData.pickupTimeLatest || ''}
                    onChange={handleChange}
                  />
                </>
              )}
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
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border"
                style={yellowButtonStyle}
              >
                  <Pencil className="w-4 h-4" style={{ color: '#2F1B17' }} />
                <span style={{ color: '#2F1B17' }}>{shipperEditable ? 'Lock' : 'Edit'}</span>
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
                placeholder="State/Province"
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
                placeholder="State/Province"
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
              
            </div>
          </CollapsibleSection>

          {/* PACKAGE AND CONTENTS SECTION */}
          <CollapsibleSection
            title="Package and Contents"
            isOpen={expandedSections.packages}
            onToggle={() => toggleSection('packages')}
            icon={Package}
          >
            <div className="space-y-6">
              {formData.packages && formData.packages.map((pkg, pkgIdx) => (
                <div key={pkgIdx} className="border border-slate-200 rounded-lg p-5 bg-white shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-semibold text-slate-900 text-lg">Package {pkgIdx + 1}</h4>
                    <button
                      onClick={() => removeArrayItem('packages', pkgIdx)}
                      className="p-2 rounded transition-colors"
                      style={{ background: 'transparent', border: 'none' }}
                      aria-label={`Remove package ${pkgIdx + 1}`}
                    >
                      <Trash2 className="w-5 h-5" style={{ color: '#dc2626' }} />
                    </button>
                  </div>
                  
                  {/* Package Details */}
                  <div className="mb-6 pb-6 border-b border-slate-200">
                    <h5 className="text-sm font-medium mb-3" style={{  color: '#131313ff', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>Package Details</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <SelectField
                        label="Package Type"
                        name="type"
                        value={pkg.type || ''}
                        onChange={(e) => handleArrayChange('packages', pkgIdx, 'type', e.target.value)}
                        options={packageTypes}
                      />
                      <InputField
                        label="Length (cm)"
                        type="number"
                        name="length"
                        value={pkg.length || ''}
                        onChange={(e) => handleArrayChange('packages', pkgIdx, 'length', parseFloat(e.target.value))}
                      />
                      <InputField
                        label="Width (cm)"
                        type="number"
                        name="width"
                        value={pkg.width || ''}
                        onChange={(e) => handleArrayChange('packages', pkgIdx, 'width', parseFloat(e.target.value))}
                      />
                      <InputField
                        label="Height (cm)"
                        type="number"
                        name="height"
                        value={pkg.height || ''}
                        onChange={(e) => handleArrayChange('packages', pkgIdx, 'height', parseFloat(e.target.value))}
                      />
                      <InputField
                        label="Weight"
                        type="number"
                        name="weight"
                        value={pkg.weight || ''}
                        onChange={(e) => handleArrayChange('packages', pkgIdx, 'weight', parseFloat(e.target.value))}
                      />
                      <SelectField
                        label="Weight Unit"
                        name="weightUnit"
                        value={pkg.weightUnit || 'kg'}
                        onChange={(e) => handleArrayChange('packages', pkgIdx, 'weightUnit', e.target.value)}
                        options={['kg', 'lb']}
                      />
                      <div className="md:col-span-3">
                        <CheckboxField
                          label="Stackable"
                          name="stackable"
                          checked={pkg.stackable || false}
                          onChange={(e) => handleArrayChange('packages', pkgIdx, 'stackable', e.target.checked)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Products within Package */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-sm font-medium" style={{ color: '#0f0e0eff', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>Product Contents</h5>
                      <button
                        type="button"
                        onClick={() => {
                          const currentProducts = pkg.products || [];
                          const newProduct = {
                            id: `PROD-${Date.now()}-${pkgIdx}`,
                            name: '',
                            description: '',
                            hsCode: '',
                            category: '',
                            uom: '',
                            qty: '',
                            unitPrice: '',
                            totalValue: '',
                            originCountry: formData.shipper?.country || profileCountry || '',
                            reasonForExport: '',
                          };
                          handleArrayChange('packages', pkgIdx, 'products', [...currentProducts, newProduct]);
                        }}
                        className="px-3 py-1.5 text-sm rounded-lg flex items-center gap-2"
                        style={yellowButtonStyle}
                      >
                        <Plus className="w-4 h-4" style={{ color: '#2F1B17' }} /> Add Product
                      </button>
                    </div>
                    
                    {pkg.products && pkg.products.length > 0 ? (
                      <div className="space-y-4">
                        {pkg.products.map((product, prodIdx) => (
                          <div key={product.id || prodIdx} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                            <div className="flex justify-between items-start mb-3">
                              <h6 className="font-medium text-slate-900">Product {prodIdx + 1}</h6>
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedProducts = pkg.products.filter((_, i) => i !== prodIdx);
                                  handleArrayChange('packages', pkgIdx, 'products', updatedProducts);
                                }}
                                className="rounded transition-colors p-1"
                                style={{ background: 'transparent', border: 'none' }}
                                aria-label={`Remove product ${prodIdx + 1}`}
                              >
                                <Trash2 className="w-4 h-4" style={{ color: '#dc2626' }} />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <InputField
                                label="Product Name"
                                name="name"
                                value={product.name || ''}
                                onChange={(e) => {
                                  const updatedProducts = [...pkg.products];
                                  updatedProducts[prodIdx] = { ...updatedProducts[prodIdx], name: e.target.value };
                                  handleArrayChange('packages', pkgIdx, 'products', updatedProducts);
                                }}
                                placeholder="Electronic Integrated Circuits"
                              />
                              <InputField
                                label="Category"
                                name="category"
                                value={product.category || ''}
                                onChange={(e) => {
                                  const updatedProducts = [...pkg.products];
                                  updatedProducts[prodIdx] = { ...updatedProducts[prodIdx], category: e.target.value };
                                  handleArrayChange('packages', pkgIdx, 'products', updatedProducts);
                                }}
                                placeholder="Electronics, Textiles, Medical, etc."
                              />
                              <div className="md:col-span-2">
                                <InputField
                                  label="Description"
                                  name="description"
                                  value={product.description || ''}
                                  onChange={(e) => {
                                    const updatedProducts = [...pkg.products];
                                    updatedProducts[prodIdx] = { ...updatedProducts[prodIdx], description: e.target.value };
                                    handleArrayChange('packages', pkgIdx, 'products', updatedProducts);
                                  }}
                                  placeholder="Product description"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                  HS Code
                                  <span className="text-red-600">*</span>
                                </label>
                                <div>
                                  <input
                                    type="text"
                                    value={product.hsCode || ''}
                                    onChange={(e) => {
                                      const updatedProducts = [...pkg.products];
                                      updatedProducts[prodIdx] = { ...updatedProducts[prodIdx], hsCode: e.target.value };
                                      handleArrayChange('packages', pkgIdx, 'products', updatedProducts);
                                    }}
                                    placeholder="8541.10.00"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />

                                  {/* HS code suggestions (AI) */}
                                  {loadingHsSuggestions[product.id] && (
                                    <p className="text-xs text-slate-500 mt-1">Fetching HS suggestions…</p>
                                  )}

                                  {hsSuggestions[product.id] && hsSuggestions[product.id].length > 0 && (
                                    <div className="mt-3 w-full rounded-lg border-2 overflow-hidden" style={{ background: '#EAD8C3', borderColor: '#2F1B17' }}>
                                      <div className="p-3">
                                        <div className="flex items-center gap-3 mb-2">
                                          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#2F1B17' }} aria-hidden="true"></span>
                                          <h4 className="font-semibold" style={{ color: '#2F1B17' }}>AI Suggested HS Codes</h4>
                                        </div>
                                        <p className="text-xs mb-2" style={{ color: '#2F1B17' }}>These suggestions are generated by the system — verify before use.</p>

                                        <div className="w-full max-h-48 overflow-y-auto pr-2">
                                          <div className="space-y-2">
                                            {hsSuggestions[product.id].map((s, idx) => {
                                              const code = s && (s.code || s);
                                              const desc = s && s.description;
                                              return (
                                                <button
                                                  key={idx}
                                                  type="button"
                                                  onClick={() => {
                                                    const updatedProducts = [...pkg.products];
                                                    updatedProducts[prodIdx] = { ...updatedProducts[prodIdx], hsCode: code.toString() };
                                                    handleArrayChange('packages', pkgIdx, 'products', updatedProducts);
                                                    setSelectedHsIndex(prev => ({ ...prev, [product.id]: idx }));
                                                  }}
                                                  className="w-full text-left border rounded-md p-3 shadow-sm transition"
                                                    style={{ background: '#FBF9F6', border: '1px solid #D4C5B9', color: '#2F1B17' }}
                                                >
                                                  <div className="flex items-center justify-between">
                                                    <div className="text-sm font-medium">{code}</div>
                                                    {desc && <div className="text-xs">{desc}</div>}
                                                  </div>
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {hsValidation[product.id] && (
                                    <p className="text-xs mt-1">
                                      {hsValidation[product.id].valid ? (
                                        <span className="text-green-700">HS code looks valid</span>
                                      ) : (
                                        <span className="text-red-700">HS code may be invalid or require review</span>
                                      )}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <SelectField
                                label="Unit of Measure"
                                name="uom"
                                value={product.uom || ''}
                                onChange={(e) => {
                                  const updatedProducts = [...pkg.products];
                                  updatedProducts[prodIdx] = { ...updatedProducts[prodIdx], uom: e.target.value };
                                  handleArrayChange('packages', pkgIdx, 'products', updatedProducts);
                                }}
                                options={uoms}
                              />
                              <InputField
                                label="Quantity"
                                type="number"
                                name="qty"
                                value={product.qty || ''}
                                onChange={(e) => {
                                  const qty = parseFloat(e.target.value) || 0;
                                  const unitPrice = parseFloat(product.unitPrice) || 0;
                                  const totalValue = qty * unitPrice;
                                  const updatedProducts = [...pkg.products];
                                  updatedProducts[prodIdx] = { 
                                    ...updatedProducts[prodIdx], 
                                    qty: qty,
                                    totalValue: totalValue
                                  };
                                  handleArrayChange('packages', pkgIdx, 'products', updatedProducts);
                                }}
                              />
                              <InputField
                                label="Unit Price"
                                type="number"
                                name="unitPrice"
                                value={product.unitPrice || ''}
                                onChange={(e) => {
                                  const unitPrice = parseFloat(e.target.value) || 0;
                                  const qty = parseFloat(product.qty) || 0;
                                  const totalValue = qty * unitPrice;
                                  const updatedProducts = [...pkg.products];
                                  updatedProducts[prodIdx] = { 
                                    ...updatedProducts[prodIdx], 
                                    unitPrice: unitPrice,
                                    totalValue: totalValue
                                  };
                                  handleArrayChange('packages', pkgIdx, 'products', updatedProducts);
                                }}
                              />
                              <InputField
                                label="Total Value"
                                type="number"
                                name="totalValue"
                                value={product.totalValue || ''}
                                onChange={(e) => {
                                  const updatedProducts = [...pkg.products];
                                  updatedProducts[prodIdx] = { ...updatedProducts[prodIdx], totalValue: parseFloat(e.target.value) || 0 };
                                  handleArrayChange('packages', pkgIdx, 'products', updatedProducts);
                                }}
                                disabled
                              />
                              <SelectField
                                label="Origin Country"
                                name="originCountry"
                                value={product.originCountry || formData.shipper?.country || profileCountry || ''}
                                onChange={(e) => {
                                  const updatedProducts = [...pkg.products];
                                  updatedProducts[prodIdx] = { ...updatedProducts[prodIdx], originCountry: e.target.value };
                                  handleArrayChange('packages', pkgIdx, 'products', updatedProducts);
                                }}
                                options={countryOptions.map(c => ({ value: c.code, label: c.name }))}
                              />
                              <SelectField
                                label="Reason for Export"
                                name="reasonForExport"
                                value={product.reasonForExport || ''}
                                onChange={(e) => {
                                  const updatedProducts = [...pkg.products];
                                  updatedProducts[prodIdx] = { ...updatedProducts[prodIdx], reasonForExport: e.target.value };
                                  handleArrayChange('packages', pkgIdx, 'products', updatedProducts);
                                }}
                                options={reasonsForExport}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500 text-sm">
                        No products added yet. Click "Add Product" to add product details to this package.
                      </div>
                    )}
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
                  products: [],
                })}
                className="w-full py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
                style={{ ...yellowButtonStyle, borderStyle: 'dashed' }}
              >
                <Plus className="w-5 h-5" style={{ color: '#2F1B17' }} /> Add Package
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
                label="Currency"
                name="currency"
                value={formData.currency || ''}
                onChange={handleChange}
                options={currencies}
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Customs Value
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="customsValue"
                  value={(() => {
                    // Auto-calculate as sum of all package product total values
                    if (!formData.packages || formData.packages.length === 0) return '';
                    let total = 0;
                    formData.packages.forEach(pkg => {
                      if (pkg.products && Array.isArray(pkg.products)) {
                        pkg.products.forEach(prod => {
                          total += parseFloat(prod.totalValue) || 0;
                        });
                      }
                    });
                    return total > 0 ? total : '';
                  })()}
                  onChange={handleChange}
                  disabled
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-100 text-slate-500 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-slate-500">Automatically calculated from package product values</p>
              </div>
            </div>
          </CollapsibleSection>

          {/* COMPLIANCE & ATTACHMENTS SECTION */}
          <CollapsibleSection
            title="Required Documents"
            isOpen={expandedSections.documents}
            onToggle={() => toggleSection('documents')}
            icon={Sparkles}
          >
            <div className="space-y-6">
              {/* AI Document Suggestions */}
                <div className="border-2 rounded-xl p-6" style={{ background: '#EAD8C3', borderColor: '#2F1B17' }}>
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6" style={{ color: '#2F1B17' }} />
                  <h4 className="text-lg font-semibold" style={{ color: '#2F1B17' }}>AI-Powered Required Documents</h4>
                </div>
                <p className="text-sm mb-4" style={{ color: '#2F1B17' }}>
                  Based on your shipment details, the following documents are required for customs clearance:
                </p>
                
                {analyzingDocuments ? (
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-300">
                    <span className="inline-block w-3 h-3 rounded-full animate-pulse" style={{ background: '#2F1B17' }}></span>
                    <span className="text-sm" style={{ color: '#2F1B17' }}>Analyzing shipment details and product information...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {requiredDocuments.length > 0 ? (
                      requiredDocuments.map((doc, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-4 border border-slate-300 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5" style={{ color: '#2F1B17' }} />
                            <div>
                              <p className="font-medium text-slate-900">{doc.name}</p>
                              {doc.description && (
                                <p className="text-xs text-slate-600 mt-1">{doc.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {doc.required && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">Required</span>
                            )}
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setDocumentFiles(prev => ({ ...prev, [doc.name]: file }));
                                }
                              }}
                              className="hidden"
                              id={`file-${idx}`}
                            />
                            <label
                              htmlFor={`file-${idx}`}
                              className="px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm flex items-center gap-2 text-white font-medium"
                              style={yellowButtonStyle}
                            >
                              <Upload className="w-4 h-4" style={{ color: '#2F1B17' }} />
                              {documentFiles[doc.name] ? 'Change File' : 'Upload'}
                            </label>
                            {documentFiles[doc.name] && (
                              <span className="text-sm text-green-700 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                {documentFiles[doc.name].name}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white rounded-lg p-4 border border-slate-300 text-center">
                        <p className="text-sm" style={{ color: '#2F1B17' }}>Click "Analyze Documents" to get AI-powered document suggestions</p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      setAnalyzingDocuments(true);
                      // Simulate AI analysis - in real app, this would call an API
                      await new Promise(resolve => setTimeout(resolve, 1500));
                      
                      // Generate document suggestions based on shipment data
                      const suggestedDocs = [
                        { name: 'Commercial Invoice', required: true, description: 'Required for all shipments' },
                        { name: 'Packing List', required: true, description: 'Required for all shipments' },
                      ];
                      
                      // Add documents based on HS codes
                      if (formData.packages) {
                        formData.packages.forEach(pkg => {
                          if (pkg.products) {
                            pkg.products.forEach(prod => {
                              if (prod.hsCode) {
                                // Add Certificate of Origin for international shipments
                                if (formData.shipmentType === 'International' && 
                                    !suggestedDocs.find(d => d.name === 'Certificate of Origin')) {
                                  suggestedDocs.push({ 
                                    name: 'Certificate of Origin', 
                                    required: true,
                                    description: 'Required for international shipments'
                                  });
                                }
                                
                                // Add Export License for certain HS codes
                                if (prod.hsCode.startsWith('85') && 
                                    !suggestedDocs.find(d => d.name === 'Export License')) {
                                  suggestedDocs.push({ 
                                    name: 'Export License', 
                                    required: false,
                                    description: 'May be required for electronic goods'
                                  });
                                }
                              }
                            });
                          }
                        });
                      }
                      
                      setRequiredDocuments(suggestedDocs);
                      setAnalyzingDocuments(false);
                    }}
                    className="px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm text-white"
                      style={yellowButtonStyle}
                  >
                        <Sparkles className="w-4 h-4" style={{ color: '#2F1B17' }} />
                    Analyze Documents
                  </button>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 pt-8 border-t border-slate-200">
              <button
                onClick={handleSubmit}
                className="flex-1 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 flex-wrap"
                style={yellowButtonStyle}
              >
              <CheckCircle2 className="w-5 h-5" />
              <span>{formData.status === 'token-generated' ? 'Proceed to Booking' : 'Submit for AI Review'}</span>
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex-1 py-4 rounded-lg font-semibold transition-colors"
              style={greyButtonStyle}
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
                <h3 className="font-semibold mb-3" style={{ background: '#EAD8C3', color: '#2F1B17', padding: '0.35rem 0.5rem', borderRadius: '0.25rem' }}>Shipment Overview</h3>
                <div className="space-y-2 text-sm">
                  {formData.title && (
                    <div className="flex justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-600">Shipment Title:</span>
                      <span className="text-slate-900 font-semibold">{formData.title}</span>
                    </div>
                  )}
                  
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
                <h3 className="font-semibold mb-3" style={{ background: '#EAD8C3', color: '#2F1B17', padding: '0.35rem 0.5rem', borderRadius: '0.25rem' }}>Parties</h3>
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
                <h3 className="font-semibold mb-3" style={{ background: '#EAD8C3', color: '#2F1B17', padding: '0.35rem 0.5rem', borderRadius: '0.25rem' }}>Weight & Packages</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Packages:</span>
                    <span className="text-slate-900 font-semibold">{formData.packages?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Products:</span>
                    <span className="text-slate-900 font-semibold">
                      {formData.packages?.reduce((sum, pkg) => sum + (pkg.products?.length || 0), 0) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Weight:</span>
                    <span className="text-slate-900">{formData.totalWeight || '—'} kg</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-semibold mb-3" style={{ background: '#EAD8C3', color: '#2F1B17', padding: '0.35rem 0.5rem', borderRadius: '0.25rem' }}>Pricing Summary</h3>
                <div className="space-y-2 text-sm">
                  
                  <div className="flex justify-between">
                    <span className="text-slate-600">Customs Value:</span>
                    <span className="text-slate-900">{formData.currency } {(formData.customsValue || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Base Price:</span>
                    <span className="text-slate-900">{formData.currency} {(pricing.basePrice || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Service Charge:</span>
                    <span className="text-slate-900">{formData.currency } {(pricing.serviceCharge || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Estimated Clearance:</span>
                    <span className="text-slate-900">{formData.currency} {(pricing.customsClearance || 0).toFixed(2)}</span>
                  </div>
                  {pricing.pickupCharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Pickup Charge:</span>
                      <span className="text-slate-900">{formData.currency} {(pricing.pickupCharge || 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-t border-slate-200">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="text-slate-900">{formData.currency } {(pricing.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax (18%):</span>
                    <span className="text-slate-900">{formData.currency } {(pricing.tax || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3 border-t border-slate-200 text-base font-semibold">
                    <span className="text-slate-900">Total:</span>
                    <span className="text-blue-600">{formData.currency } {(pricing.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={downloadSummaryPdf}
                  className="w-full py-2 rounded-lg transition-colors text-sm font-semibold"
                  style={{ ...yellowButtonStyle, color: '#2F1B17' }}
                >
                  Download Summary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShipmentForm;
