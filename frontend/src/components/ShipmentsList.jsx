import { useState } from 'react';
import { Search, Filter, Download, Eye, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';

export function ShipmentsList() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const shipments = [
    {
      id: 'SHP-2024-1001',
      tokenId: 'PCT-87654321',
      productName: 'Wireless Bluetooth Headphones',
      origin: { country: 'China', flag: '🇨🇳' },
      destination: { country: 'United States', flag: '🇺🇸' },
      hsCode: '8518.30.20',
      value: 5000,
      status: 'approved',
      date: '2024-12-01',
      documents: 4
    },
    {
      id: 'SHP-2024-1002',
      tokenId: 'PCT-87654322',
      productName: 'Cotton T-Shirts',
      origin: { country: 'India', flag: '🇮🇳' },
      destination: { country: 'United Kingdom', flag: '🇬🇧' },
      hsCode: '6109.10.00',
      value: 8500,
      status: 'token-issued',
      date: '2024-12-02',
      documents: 5
    },
    {
      id: 'SHP-2024-1003',
      tokenId: null,
      productName: 'Lithium Batteries',
      origin: { country: 'Japan', flag: '🇯🇵' },
      destination: { country: 'Germany', flag: '🇩🇪' },
      hsCode: '8506.50.00',
      value: 12000,
      status: 'flagged',
      date: '2024-12-02',
      documents: 2,
      issue: 'Missing MSDS documentation'
    },
    {
      id: 'SHP-2024-1004',
      tokenId: null,
      productName: 'Ceramic Tiles',
      origin: { country: 'Brazil', flag: '🇧🇷' },
      destination: { country: 'Canada', flag: '🇨🇦' },
      hsCode: '6908.90.00',
      value: 15000,
      status: 'draft',
      date: '2024-12-03',
      documents: 1
    },
    {
      id: 'SHP-2024-1005',
      tokenId: 'PCT-87654323',
      productName: 'Organic Coffee Beans',
      origin: { country: 'Brazil', flag: '🇧🇷' },
      destination: { country: 'European Union', flag: '🇪🇺' },
      hsCode: '0901.21.00',
      value: 6200,
      status: 'approved',
      date: '2024-11-30',
      documents: 6
    },
    {
      id: 'SHP-2024-1006',
      tokenId: 'PCT-87654324',
      productName: 'Medical Equipment',
      origin: { country: 'United States', flag: '🇺🇸' },
      destination: { country: 'Singapore', flag: '🇸🇬' },
      hsCode: '9018.90.80',
      value: 25000,
      status: 'token-issued',
      date: '2024-12-01',
      documents: 7
    },
    {
      id: 'SHP-2024-1007',
      tokenId: null,
      productName: 'Automotive Parts',
      origin: { country: 'Germany', flag: '🇩🇪' },
      destination: { country: 'Australia', flag: '🇦🇺' },
      hsCode: '8708.30.50',
      value: 18000,
      status: 'flagged',
      date: '2024-12-03',
      documents: 3,
      issue: 'Incomplete certificate of origin'
    },
    {
      id: 'SHP-2024-1008',
      tokenId: null,
      productName: 'Pharmaceutical Products',
      origin: { country: 'India', flag: '🇮🇳' },
      destination: { country: 'United States', flag: '🇺🇸' },
      hsCode: '3004.90.00',
      value: 32000,
      status: 'draft',
      date: '2024-12-03',
      documents: 2
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
      case 'token-issued':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1 w-fit">
            <CheckCircle className="w-3 h-3" />
            Token Issued
          </span>
        );
      case 'flagged':
        return (
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-1 w-fit">
            <AlertTriangle className="w-3 h-3" />
            Flagged
          </span>
        );
      case 'draft':
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" />
            Draft
          </span>
        );
      default:
        return null;
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;
    const matchesSearch = shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shipment.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shipment.tokenId?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Shipments</h1>
        <p className="text-slate-600">Manage and track all your shipments</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, product, or token..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="token-issued">Token Issued</option>
              <option value="flagged">Flagged</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-slate-600 text-sm mb-1">Total Shipments</p>
          <p className="text-slate-900 text-2xl">{shipments.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-green-700 text-sm mb-1">Approved</p>
          <p className="text-green-900 text-2xl">
            {shipments.filter(s => s.status === 'approved').length}
          </p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-blue-700 text-sm mb-1">Token Issued</p>
          <p className="text-blue-900 text-2xl">
            {shipments.filter(s => s.status === 'token-issued').length}
          </p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
          <p className="text-orange-700 text-sm mb-1">Flagged</p>
          <p className="text-orange-900 text-2xl">
            {shipments.filter(s => s.status === 'flagged').length}
          </p>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-4 px-6 text-slate-700">Shipment ID</th>
                <th className="text-left py-4 px-6 text-slate-700">Product</th>
                <th className="text-left py-4 px-6 text-slate-700">Route</th>
                <th className="text-left py-4 px-6 text-slate-700">HS Code</th>
                <th className="text-left py-4 px-6 text-slate-700">Value</th>
                <th className="text-left py-4 px-6 text-slate-700">Token ID</th>
                <th className="text-left py-4 px-6 text-slate-700">Status</th>
                <th className="text-left py-4 px-6 text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-slate-900">{shipment.id}</p>
                      <p className="text-slate-500 text-sm">{shipment.date}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-slate-900">{shipment.productName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <FileText className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-500 text-sm">{shipment.documents} docs</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{shipment.origin.flag}</span>
                      <span className="text-slate-400">→</span>
                      <span className="text-xl">{shipment.destination.flag}</span>
                    </div>
                    <p className="text-slate-500 text-sm mt-1">
                      {shipment.origin.country} → {shipment.destination.country}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-slate-900 font-mono text-sm">{shipment.hsCode}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-slate-900">${shipment.value.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6">
                    {shipment.tokenId ? (
                      <span className="text-blue-600 font-mono text-sm">{shipment.tokenId}</span>
                    ) : (
                      <span className="text-slate-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      {getStatusBadge(shipment.status)}
                      {shipment.issue && (
                        <p className="text-orange-600 text-xs mt-1">{shipment.issue}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="View Details">
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Download">
                        <Download className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredShipments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No shipments found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
