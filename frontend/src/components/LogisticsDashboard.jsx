import { CheckCircle, Package, MapPin, Globe, TrendingUp, FileText } from 'lucide-react';

export function LogisticsDashboard({ onNavigate }) {
  const tokenApprovedShipments = [
    {
      id: 'SHP-001',
      tokenId: 'PCT-87654321',
      product: 'Wireless Bluetooth Headphones',
      shipper: 'Global Electronics Ltd',
      origin: '🇨🇳 China',
      destination: '🇮🇳 India',
      readiness: 100,
      status: 'ready',
      bookingStatus: 'booked',
      carrier: 'DHL Express',
      eta: '2024-12-10'
    },
    {
      id: 'SHP-002',
      tokenId: 'PCT-87654322',
      product: 'Organic Cotton T-Shirts',
      shipper: 'Textile Exports Inc',
      origin: '🇮🇳 India',
      destination: '🇺🇸 United States',
      readiness: 85,
      status: 'preparing',
      bookingStatus: 'pending',
      carrier: 'FedEx',
      eta: '2024-12-12'
    },
    {
      id: 'SHP-003',
      tokenId: 'PCT-87654323',
      product: 'Medical Equipment',
      shipper: 'HealthCare Supplies Co',
      origin: '🇺🇸 United States',
      destination: '🇮🇳 India',
      readiness: 100,
      status: 'ready',
      bookingStatus: 'in-transit',
      carrier: 'UPS Worldwide',
      eta: '2024-12-08'
    }
  ];

  const countryRules = [
    {
      country: 'India',
      flag: '🇮🇳',
      activeRules: 12,
      updates: 2,
      compliance: 95
    },
    {
      country: 'United States',
      flag: '🇺🇸',
      activeRules: 18,
      updates: 1,
      compliance: 98
    },
    {
      country: 'China',
      flag: '🇨🇳',
      activeRules: 15,
      updates: 3,
      compliance: 92
    },
    {
      country: 'European Union',
      flag: '🇪🇺',
      activeRules: 20,
      updates: 0,
      compliance: 97
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Logistics Manager Dashboard</h1>
        <p className="text-slate-600">Monitor token-approved shipments and routing workflows</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Token-Approved</p>
              <p className="text-slate-900 text-2xl">{tokenApprovedShipments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Ready to Ship</p>
              <p className="text-slate-900 text-2xl">
                {tokenApprovedShipments.filter(s => s.status === 'ready').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">In Transit</p>
              <p className="text-slate-900 text-2xl">
                {tokenApprovedShipments.filter(s => s.bookingStatus === 'in-transit').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Avg. Readiness</p>
              <p className="text-slate-900 text-2xl">95%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Token-Approved Shipments */}
      <div className="mb-8">
        <h2 className="text-slate-900 mb-4">Token-Approved Shipments</h2>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left py-4 px-6 text-slate-700">Shipment ID</th>
                  <th className="text-left py-4 px-6 text-slate-700">Token ID</th>
                  <th className="text-left py-4 px-6 text-slate-700">Product</th>
                  <th className="text-left py-4 px-6 text-slate-700">Route</th>
                  <th className="text-left py-4 px-6 text-slate-700">Carrier</th>
                  <th className="text-left py-4 px-6 text-slate-700">Readiness</th>
                  <th className="text-left py-4 px-6 text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {tokenApprovedShipments.map((shipment) => (
                  <tr key={shipment.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <p className="text-slate-900">{shipment.id}</p>
                      <p className="text-slate-500 text-sm">ETA: {shipment.eta}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-blue-600 font-mono text-sm">{shipment.tokenId}</span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-900">{shipment.product}</p>
                      <p className="text-slate-500 text-sm">{shipment.shipper}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-700">{shipment.origin} → {shipment.destination}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-700">{shipment.carrier}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-700 text-sm">{shipment.readiness}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              shipment.readiness === 100 ? 'bg-green-600' : 'bg-orange-500'
                            }`}
                            style={{ width: `${shipment.readiness}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        shipment.bookingStatus === 'booked' 
                          ? 'bg-green-100 text-green-700'
                          : shipment.bookingStatus === 'in-transit'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {shipment.bookingStatus === 'booked' ? 'Booked' : 
                         shipment.bookingStatus === 'in-transit' ? 'In Transit' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Shipment Readiness Checklist */}
      <div className="mb-8">
        <h2 className="text-slate-900 mb-4">Shipment Readiness Checklist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-slate-900">Pre-Clear Token</h3>
            </div>
            <p className="text-slate-600 text-sm">All shipments have valid tokens</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-slate-900">Documentation</h3>
            </div>
            <p className="text-slate-600 text-sm">Complete and verified</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-slate-900">Compliance Checks</h3>
            </div>
            <p className="text-slate-600 text-sm">All regulations met</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-5 h-5 text-blue-600" />
              <h3 className="text-slate-900">Packaging</h3>
            </div>
            <p className="text-slate-600 text-sm">Standards verified</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-purple-600" />
              <h3 className="text-slate-900">Labels & Marking</h3>
            </div>
            <p className="text-slate-600 text-sm">Ready to print</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-5 h-5 text-orange-600" />
              <h3 className="text-slate-900">Carrier Assignment</h3>
            </div>
            <p className="text-slate-600 text-sm">Routes optimized</p>
          </div>
        </div>
      </div>

      {/* Country-Specific Rules Overview */}
      <div>
        <h2 className="text-slate-900 mb-4">Country-Specific Rules Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {countryRules.map((rule, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{rule.flag}</span>
                  <div>
                    <h3 className="text-slate-900">{rule.country}</h3>
                    <p className="text-slate-600 text-sm">{rule.activeRules} active rules</p>
                  </div>
                </div>
                {rule.updates > 0 && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                    {rule.updates} new update{rule.updates > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600 text-sm">Compliance Rate</span>
                  <span className="text-green-900">{rule.compliance}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 rounded-full"
                    style={{ width: `${rule.compliance}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Routing Workflow */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-slate-900 mb-2">Routing Workflow Optimizer</h3>
            <p className="text-slate-600 text-sm">
              AI-powered route optimization for token-approved shipments
            </p>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Globe className="w-5 h-5 inline mr-2" />
            Optimize Routes
          </button>
        </div>
      </div>
    </div>
  );
}
