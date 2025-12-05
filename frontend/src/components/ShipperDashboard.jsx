import { PackagePlus, CheckCircle, Clock, AlertTriangle, XCircle, Package } from 'lucide-react';

interface ShipperDashboardProps {
  onNavigate: (page: string) => void;
}

export function ShipperDashboard({ onNavigate }: ShipperDashboardProps) {
  const myProducts = [
    {
      id: 'PRD-001',
      name: 'Wireless Bluetooth Headphones',
      status: 'approved',
      tokenId: 'PCT-87654321',
      hsCode: '8518.30.20',
      origin: '🇨🇳 China',
      destination: '🇮🇳 India',
      date: '2024-12-01'
    },
    {
      id: 'PRD-002',
      name: 'Organic Cotton T-Shirts',
      status: 'pending',
      tokenId: null,
      hsCode: '6109.10.00',
      origin: '🇮🇳 India',
      destination: '🇺🇸 United States',
      date: '2024-12-02'
    },
    {
      id: 'PRD-003',
      name: 'Lithium Batteries',
      status: 'fix-required',
      tokenId: null,
      hsCode: '8506.50.00',
      origin: '🇯🇵 Japan',
      destination: '🇮🇳 India',
      date: '2024-12-02',
      issue: 'Missing MSDS documentation'
    },
    {
      id: 'PRD-004',
      name: 'Ceramic Kitchenware',
      status: 'rejected',
      tokenId: null,
      hsCode: '6911.10.00',
      origin: '🇨🇳 China',
      destination: '🇮🇳 India',
      date: '2024-11-30',
      issue: 'Product does not meet BIS standards'
    }
  ];

  const myTokens = myProducts.filter(p => p.status === 'approved');
  const myShipments = [
    {
      id: 'SHP-001',
      tokenId: 'PCT-87654321',
      product: 'Wireless Bluetooth Headphones',
      status: 'in-transit',
      tracking: 'TRK-1234567890',
      destination: '🇮🇳 India'
    },
    {
      id: 'SHP-002',
      tokenId: 'PCT-87654320',
      product: 'Smartphone Cases',
      status: 'delivered',
      tracking: 'TRK-0987654321',
      destination: '🇮🇳 India'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1 w-fit">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" />
            Pending Review
          </span>
        );
      case 'fix-required':
        return (
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-1 w-fit">
            <AlertTriangle className="w-3 h-3" />
            Fix Required
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1 w-fit">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Shipper Dashboard</h1>
        <p className="text-slate-600">Manage your pre-clearance verifications and shipments</p>
      </div>

      {/* Start Verification Button */}
      <div className="mb-8">
        <button
          onClick={() => onNavigate('pre-clear')}
          className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-3"
        >
          <PackagePlus className="w-6 h-6" />
          <span className="text-lg">Start Pre-Clear Verification</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Approved</p>
              <p className="text-slate-900 text-xl">{myProducts.filter(p => p.status === 'approved').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Pending</p>
              <p className="text-slate-900 text-xl">{myProducts.filter(p => p.status === 'pending').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Fix Required</p>
              <p className="text-slate-900 text-xl">{myProducts.filter(p => p.status === 'fix-required').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Rejected</p>
              <p className="text-slate-900 text-xl">{myProducts.filter(p => p.status === 'rejected').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* My Products */}
      <div className="mb-8">
        <h2 className="text-slate-900 mb-4">My Products</h2>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left py-4 px-6 text-slate-700">Product ID</th>
                  <th className="text-left py-4 px-6 text-slate-700">Product Name</th>
                  <th className="text-left py-4 px-6 text-slate-700">Route</th>
                  <th className="text-left py-4 px-6 text-slate-700">HS Code</th>
                  <th className="text-left py-4 px-6 text-slate-700">Status</th>
                  <th className="text-left py-4 px-6 text-slate-700">Token ID</th>
                  <th className="text-left py-4 px-6 text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myProducts.map((product) => (
                  <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <p className="text-slate-900">{product.id}</p>
                      <p className="text-slate-500 text-sm">{product.date}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-900">{product.name}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-700">{product.origin} → {product.destination}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-900 font-mono text-sm">{product.hsCode}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        {getStatusBadge(product.status)}
                        {product.issue && (
                          <p className="text-orange-600 text-xs mt-1">{product.issue}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {product.tokenId ? (
                        <span className="text-blue-600 font-mono text-sm">{product.tokenId}</span>
                      ) : (
                        <span className="text-slate-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {product.status === 'approved' && (
                        <button
                          onClick={() => onNavigate('shipment-booking')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Book Shipment
                        </button>
                      )}
                      {product.status === 'fix-required' && (
                        <button
                          onClick={() => onNavigate('exceptions')}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                        >
                          Fix Issues
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* My Tokens */}
      <div className="mb-8">
        <h2 className="text-slate-900 mb-4">My Pre-Clear Tokens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myTokens.map((token) => (
            <div key={token.id} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-slate-600 text-sm mb-1">Token ID</p>
                  <p className="text-slate-900 text-xl font-mono">{token.tokenId}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-slate-600 text-sm">Product</p>
                  <p className="text-slate-900">{token.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-600 text-sm">HS Code</p>
                    <p className="text-slate-900 font-mono text-sm">{token.hsCode}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm">Route</p>
                    <p className="text-slate-900 text-sm">{token.origin} → {token.destination}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('shipment-booking')}
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book Shipment with This Token
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* My Shipments */}
      <div>
        <h2 className="text-slate-900 mb-4">My Shipments</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="space-y-4">
            {myShipments.map((shipment) => (
              <div key={shipment.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-slate-900">{shipment.id} - {shipment.product}</p>
                    <p className="text-slate-600 text-sm">Token: {shipment.tokenId} • Tracking: {shipment.tracking}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    shipment.status === 'delivered' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {shipment.status === 'delivered' ? 'Delivered' : 'In Transit'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
