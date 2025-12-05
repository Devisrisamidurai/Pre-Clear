import { CheckCircle, XCircle, AlertTriangle, Scale, Package, DollarSign, FileWarning, Truck } from 'lucide-react';

export function ConstraintsValidationWidget({ shipment, validationResults }) {
  // Auto-calculate validation if not provided
  const weight = parseFloat(shipment?.weight || '0');
  const quantity = parseFloat(shipment?.quantity || '0');
  const value = parseFloat(shipment?.value || '0');

  const defaultResults = {
    weightCheck: {
      passed: weight > 0 && weight <= 5000,
      message: weight > 5000 ? 'Weight exceeds maximum limit' : 'Weight within acceptable range',
      details: `${weight} kg ${weight > 5000 ? '(Max: 5000 kg)' : ''}`
    },
    quantityCheck: {
      passed: quantity > 0 && quantity <= 1000,
      message: quantity > 1000 ? 'Quantity exceeds maximum limit' : 'Quantity within acceptable range',
      details: `${quantity} units ${quantity > 1000 ? '(Max: 1000 units)' : ''}`
    },
    valueCheck: {
      passed: value > 0 && value <= 250000,
      message: value > 250000 ? 'Declared value exceeds threshold' : 'Value within acceptable range',
      details: `$${value.toLocaleString()} ${value > 250000 ? '(Max: $250,000)' : ''}`
    },
    msdsRequired: {
      required: shipment?.productDescription?.toLowerCase().includes('chemical') || 
                 shipment?.productDescription?.toLowerCase().includes('battery'),
      message: 'Material Safety Data Sheet (MSDS) required for chemical/battery products'
    },
    specialHandling: {
      required: weight > 1000 || value > 50000,
      message: 'Special handling required for heavy or high-value shipments',
      type: weight > 1000 ? 'Heavy Cargo' : value > 50000 ? 'High Value' : undefined
    }
  };

  const results = validationResults || defaultResults;

  const getStatusIcon = (passed, isCheck = true) => {
    if (isCheck) {
      return passed ? (
        <CheckCircle className="w-5 h-5 text-green-600" />
      ) : (
        <XCircle className="w-5 h-5 text-red-600" />
      );
    } else {
      // For requirements (not checks)
      return passed ? (
        <AlertTriangle className="w-5 h-5 text-amber-600" />
      ) : (
        <CheckCircle className="w-5 h-5 text-green-600" />
      );
    }
  };

  const getStatusClass = (passed, isCheck = true) => {
    if (isCheck) {
      return passed 
        ? 'bg-green-50 border-green-200 text-green-800' 
        : 'bg-red-50 border-red-200 text-red-800';
    } else {
      return passed 
        ? 'bg-amber-50 border-amber-200 text-amber-800' 
        : 'bg-green-50 border-green-200 text-green-800';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <h3 className="text-slate-900 mb-4">Shipment Constraints Validation</h3>
      <p className="text-slate-600 text-sm mb-6">
        Comprehensive validation of quantity, weight, value constraints, and special requirements
      </p>

      <div className="space-y-3">
        {/* Weight Check */}
        <details className="group">
          <summary className={`cursor-pointer p-4 rounded-lg border ${getStatusClass(results.weightCheck.passed)} flex items-center justify-between hover:shadow-sm transition-all`}>
            <div className="flex items-center gap-3 flex-1">
              {getStatusIcon(results.weightCheck.passed)}
              <Scale className="w-5 h-5 text-slate-600" />
              <div className="flex-1">
                <p className="font-medium">{results.weightCheck.message}</p>
                <p className="text-sm opacity-75 mt-1">{results.weightCheck.details}</p>
              </div>
            </div>
            <span className="text-xs opacity-50 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-2 ml-12 p-3 bg-slate-50 rounded-lg text-sm text-slate-700">
            <p><strong>Weight Limit:</strong> Most shipments have a 5,000 kg maximum weight limit.</p>
            <p className="mt-1"><strong>Current Weight:</strong> {weight} kg</p>
            {!results.weightCheck.passed && (
              <p className="mt-2 text-red-700">⚠️ Consider splitting into multiple shipments or requesting special handling.</p>
            )}
          </div>
        </details>

        {/* Quantity Check */}
        <details className="group">
          <summary className={`cursor-pointer p-4 rounded-lg border ${getStatusClass(results.quantityCheck.passed)} flex items-center justify-between hover:shadow-sm transition-all`}>
            <div className="flex items-center gap-3 flex-1">
              {getStatusIcon(results.quantityCheck.passed)}
              <Package className="w-5 h-5 text-slate-600" />
              <div className="flex-1">
                <p className="font-medium">{results.quantityCheck.message}</p>
                <p className="text-sm opacity-75 mt-1">{results.quantityCheck.details}</p>
              </div>
            </div>
            <span className="text-xs opacity-50 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-2 ml-12 p-3 bg-slate-50 rounded-lg text-sm text-slate-700">
            <p><strong>Quantity Limit:</strong> Standard limit is 1,000 units per shipment.</p>
            <p className="mt-1"><strong>Current Quantity:</strong> {quantity} units</p>
            {!results.quantityCheck.passed && (
              <p className="mt-2 text-red-700">⚠️ Large quantity shipments may require additional documentation.</p>
            )}
          </div>
        </details>

        {/* Value Check */}
        <details className="group">
          <summary className={`cursor-pointer p-4 rounded-lg border ${getStatusClass(results.valueCheck.passed)} flex items-center justify-between hover:shadow-sm transition-all`}>
            <div className="flex items-center gap-3 flex-1">
              {getStatusIcon(results.valueCheck.passed)}
              <DollarSign className="w-5 h-5 text-slate-600" />
              <div className="flex-1">
                <p className="font-medium">{results.valueCheck.message}</p>
                <p className="text-sm opacity-75 mt-1">{results.valueCheck.details}</p>
              </div>
            </div>
            <span className="text-xs opacity-50 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-2 ml-12 p-3 bg-slate-50 rounded-lg text-sm text-slate-700">
            <p><strong>Value Threshold:</strong> Shipments over $250,000 require additional scrutiny.</p>
            <p className="mt-1"><strong>Declared Value:</strong> ${value.toLocaleString()}</p>
            {!results.valueCheck.passed && (
              <p className="mt-2 text-red-700">⚠️ High-value shipments require insurance and enhanced security measures.</p>
            )}
          </div>
        </details>

        {/* MSDS Requirement */}
        <details className="group">
          <summary className={`cursor-pointer p-4 rounded-lg border ${getStatusClass(!results.msdsRequired.required, false)} flex items-center justify-between hover:shadow-sm transition-all`}>
            <div className="flex items-center gap-3 flex-1">
              {getStatusIcon(!results.msdsRequired.required, false)}
              <FileWarning className="w-5 h-5 text-slate-600" />
              <div className="flex-1">
                <p className="font-medium">
                  {results.msdsRequired.required ? 'MSDS Required' : 'No MSDS Required'}
                </p>
                <p className="text-sm opacity-75 mt-1">{results.msdsRequired.message}</p>
              </div>
            </div>
            <span className="text-xs opacity-50 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-2 ml-12 p-3 bg-slate-50 rounded-lg text-sm text-slate-700">
            <p><strong>Material Safety Data Sheet (MSDS):</strong> Required for hazardous materials, chemicals, batteries, and certain products.</p>
            {results.msdsRequired.required && (
              <p className="mt-2 text-amber-700">⚠️ Please ensure MSDS is uploaded before shipment can be approved.</p>
            )}
          </div>
        </details>

        {/* Special Handling Requirement */}
        <details className="group">
          <summary className={`cursor-pointer p-4 rounded-lg border ${getStatusClass(!results.specialHandling.required, false)} flex items-center justify-between hover:shadow-sm transition-all`}>
            <div className="flex items-center gap-3 flex-1">
              {getStatusIcon(!results.specialHandling.required, false)}
              <Truck className="w-5 h-5 text-slate-600" />
              <div className="flex-1">
                <p className="font-medium">
                  {results.specialHandling.required ? `Special Handling Required${results.specialHandling.type ? ` (${results.specialHandling.type})` : ''}` : 'Standard Handling'}
                </p>
                <p className="text-sm opacity-75 mt-1">{results.specialHandling.message}</p>
              </div>
            </div>
            <span className="text-xs opacity-50 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-2 ml-12 p-3 bg-slate-50 rounded-lg text-sm text-slate-700">
            <p><strong>Special Handling:</strong> Required for oversized, heavy, fragile, or high-value shipments.</p>
            {results.specialHandling.required && (
              <p className="mt-2 text-amber-700">⚠️ Additional fees and extended transit time may apply for special handling.</p>
            )}
          </div>
        </details>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <p className="text-slate-700 text-sm">Overall Constraints Status:</p>
          <div className="flex items-center gap-2">
            {results.weightCheck.passed && 
             results.quantityCheck.passed && 
             results.valueCheck.passed ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700">All checks passed</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="text-amber-700">Action required</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
