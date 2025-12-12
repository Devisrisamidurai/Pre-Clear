import { PackagePlus, Package, Clock, CheckCircle, XCircle, AlertTriangle, TrendingUp, Upload, DollarSign, Eye, Edit, Filter, MessageSquare } from 'lucide-react';
import { NotificationPanel } from '../NotificationPanel';
import { shipmentsStore, createDefaultShipment } from '../../store/shipmentsStore';
import { useState } from 'react';
import { useShipments } from '../../hooks/useShipments';
import { getCurrencyByCountry, formatCurrency } from '../../utils/validation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';


export function ShipperDashboard({ onNavigate }) {
  const { shipments: allShipments } = useShipments();
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewingDocuments, setViewingDocuments] = useState(null);
  
  // Categorize shipments
  const pendingReview = allShipments.filter(s => 
    s.status === 'draft' || 
    s.status === 'documents-uploaded' || 
    s.status === 'document-requested'
  );
  
  const inReview = allShipments.filter(s => 
    s.status === 'awaiting-ai' || 
    s.status === 'awaiting-broker' ||
    (s.aiApproval === 'pending' || s.brokerApproval === 'pending')
  );
  
  const cleared = allShipments.filter(s => 
    s.status === 'token-generated' || 
    (s.aiApproval === 'approved' && s.brokerApproval === 'approved')
  );
  
  const cancelled = allShipments.filter(s => s.status === 'cancelled');
  
  // Filter shipments based on selected status
  const getFilteredShipments = () => {
    if (filterStatus === 'all') return allShipments;
    if (filterStatus === 'pending') return pendingReview;
    if (filterStatus === 'review') return inReview;
    if (filterStatus === 'cleared') return cleared;
    if (filterStatus === 'cancelled') return cancelled;
    return allShipments;
  };
  
  const filteredShipments = getFilteredShipments();

  const getStatusBadge = (shipment) => {
    if (shipment.status === 'cancelled') {
      return (
        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Cancelled
        </span>
      );
    }
    if (shipment.status === 'document-requested') {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Documents Requested
        </span>
      );
    }
    if (shipment.token && shipment.status === 'token-generated') {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Cleared
        </span>
      );
    }
    if (shipment.aiApproval === 'approved' && shipment.brokerApproval === 'approved') {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Cleared
        </span>
      );
    }
    if (shipment.status === 'awaiting-broker' || shipment.brokerApproval === 'pending') {
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Broker Review
        </span>
      );
    }
    if (shipment.status === 'awaiting-ai' || shipment.aiApproval === 'pending') {
      return (
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1">
          <Clock className="w-3 h-3" />
          AI Processing
        </span>
      );
    }
    if (shipment.aiApproval === 'rejected' || shipment.brokerApproval === 'rejected') {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Rejected
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Pending Review
      </span>
    );
  };

  const getActionButton = (shipment) => {
    if (shipment.status === 'cancelled') return null;

    const hasUploadedDocuments = shipment.uploadedDocuments && Object.keys(shipment.uploadedDocuments).length > 0;

    // Draft / Documents requested: show View + Upload/Uploaded
    if (shipment.status === 'draft' || shipment.status === 'document-requested') {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => {
              const latest = allShipments.find(s => s.id === shipment.id) || shipment;
              onNavigate('shipment-details', latest);
            }}
            className="px-3 py-1.5 bg-yellow-500 text-yellow-900 rounded-lg hover:bg-yellow-600 hover:shadow-md transition-all text-sm flex items-center gap-1"
            title="View shipment details"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>

          {shipment.status === 'document-requested' && (shipment.brokerApproval === 'documents-requested' || !hasUploadedDocuments) && (
            <button
              onClick={() => onNavigate('chat', shipment, { showRequiredDocuments: true })}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
              title="Open chat to upload required documents"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload
            </button>
          )}

          {shipment.status === 'document-requested' && hasUploadedDocuments && shipment.brokerApproval !== 'documents-requested' && (
            <button
              disabled
              className="px-3 py-1.5 bg-slate-200 text-slate-500 rounded-lg transition-colors text-sm flex items-center gap-1 cursor-not-allowed"
              title="Documents uploaded"
            >
              <Upload className="w-3.5 h-3.5" />
              Uploaded
            </button>
          )}
        </div>
      );
    }

    // If payment pending
    if (shipment.token && !shipment.paymentStatus) {
      return (
        <button
          onClick={() => onNavigate('payment', shipment)}
          className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
        >
          <DollarSign className="w-3.5 h-3.5" />
          Pay Now
        </button>
      );
    }

    // Default: just View details
    return (
      <div className="flex gap-2">
        <button
          onClick={() => {
            const latest = allShipments.find(s => s.id === shipment.id) || shipment;
            onNavigate('shipment-details', latest);
          }}
          className="px-3 py-1.5 bg-yellow-500 text-yellow-900 rounded-lg hover:bg-yellow-600 hover:shadow-md transition-all text-sm flex items-center gap-1"
          title="View shipment details"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </button>
      </div>
    );
  };

  const UnifiedShipmentTable = ({ shipments }) => {
    if (shipments.length === 0) {
      return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-500 text-base">No shipments found</p>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or create a new shipment</p>
          </div>
      );
    }

    return (
      <div className="bg-white rounded-lg overflow-hidden" style={{ border: '2px solid #3A2B28' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#D4AFA0' }}>
                <th className="p-4 text-left font-semibold text-sm" style={{ color: '#2F1B17', width: '10%' }}>Shipment ID</th>
                <th className="p-4 text-left font-semibold text-sm" style={{ color: '#2F1B17', width: '12%' }}>Title</th>
                <th className="p-4 text-left font-semibold text-sm" style={{ color: '#2F1B17', width: '14%' }}>Origin → Destination</th>
                <th className="p-4 text-left font-semibold text-sm" style={{ color: '#2F1B17', width: '11%' }}>Value</th>
                <th className="p-4 text-left font-semibold text-sm" style={{ color: '#2F1B17', width: '11%' }}>AI Score</th>
                <th className="p-4 text-left font-semibold text-sm" style={{ color: '#2F1B17', width: '13%' }}>Status</th>
                <th className="p-4 text-left font-semibold text-sm" style={{ color: '#2F1B17', width: '12%' }}>Date Created</th>
                <th className="p-4 text-right font-semibold text-sm" style={{ color: '#2F1B17', width: '17%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
                {shipments.map((shipment, index) => {
                // prefer explicit shipment.currency, otherwise infer from shipper country
                const currency = shipment.currency ? { symbol: (getCurrencyByCountry(shipment.currency) || {}).symbol || '$', code: shipment.currency } : getCurrencyByCountry(shipment.shipper?.country || 'US');
                const aiScore = shipment.aiScore || 0;
                const isEvenRow = index % 2 === 0;

                return (
                  <tr key={shipment.id} className={`${isEvenRow ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100` }>
                    <td className="p-4 text-slate-900 font-semibold text-sm">#{shipment.id}</td>
                    <td className="p-4 text-slate-900 text-sm">
                      <div className="max-w-[150px] truncate">{shipment.title || shipment.productName}</div>
                    </td>
                    <td className="p-4 text-slate-900 text-sm">
                      <div className="text-sm"><strong>{shipment.shipper?.city || shipment.shipper?.company || 'N/A'}</strong> → <strong>{shipment.consignee?.city || shipment.consignee?.company || 'N/A'}</strong></div>
                      <div className="text-xs text-slate-500 mt-1">{(shipment.mode || 'N/A')} • {shipment.shipmentType || 'N/A'}</div>
                    </td>
                    <td className="p-4 text-slate-900 font-medium text-sm">{formatCurrency(shipment.value || 0, shipment.currency || currency.code)}</td>
                    <td className="p-4">
                      {aiScore > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`${aiScore >= 85 ? 'bg-green-500' : aiScore >= 70 ? 'bg-amber-500' : 'bg-red-500'} h-full`}
                              style={{ width: `${aiScore}%` }}
                            />
                          </div>
                          <span className={`${aiScore >= 85 ? 'text-green-700' : aiScore >= 70 ? 'text-amber-700' : 'text-red-700'} text-sm font-semibold`}>{aiScore}%</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="p-4">{getStatusBadge(shipment)}</td>
                    <td className="p-4 text-slate-600 text-sm">{new Date(shipment.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {getActionButton(shipment)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-cream-50 min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-yellow-900 text-3xl font-bold mb-2">Shipper Dashboard</h1>
        <p className="text-slate-600 text-base opacity-80">Manage your shipments and track pre-clearance approvals</p>
      </div>

      {/* Real-time Notifications */}
      <div className="mb-6">
        <NotificationPanel role="shipper" onNavigate={onNavigate} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 border border-slate-200 transition-all hover:shadow-lg cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-600 text-sm font-medium opacity-80">Pending Review</p>
            <Clock className="text-yellow-500 w-5 h-5" />
          </div>
          <p className="text-yellow-900 text-3xl font-bold">{pendingReview.length}</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-slate-200 transition-all hover:shadow-lg cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-600 text-sm font-medium opacity-80">In Review</p>
            <TrendingUp className="text-blue-500 w-5 h-5" />
          </div>
          <p className="text-yellow-900 text-3xl font-bold">{inReview.length}</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-slate-200 transition-all hover:shadow-lg cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-600 text-sm font-medium opacity-80">Cleared</p>
            <CheckCircle className="text-green-500 w-5 h-5" />
          </div>
          <p className="text-yellow-900 text-3xl font-bold">{cleared.length}</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-slate-200 transition-all hover:shadow-lg cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-600 text-sm font-medium opacity-80">Cancelled</p>
            <XCircle className="text-gray-500 w-5 h-5" />
          </div>
          <p className="text-yellow-900 text-3xl font-bold">{cancelled.length}</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 flex items-center gap-3 flex-wrap">
      
        {[
          { label: 'All Shipments', value: 'all' },
          { label: 'Pending Review', value: 'pending' },
          { label: 'In Review', value: 'review' },
          { label: 'Cleared', value: 'cleared' },
          { label: 'Cancelled', value: 'cancelled' }
        ].map(filter => (
          <button
            key={filter.value}
            onClick={() => setFilterStatus(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterStatus === filter.value 
                ? 'bg-yellow-500 text-yellow-900' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Unified Shipments Table */}
      <div>
        <h2 className="text-yellow-900 text-lg font-bold mb-4">
          {filterStatus === 'all' ? 'All Shipments' : 
           filterStatus === 'pending' ? 'Pending Review' : 
           filterStatus === 'review' ? 'In Review' : 
           filterStatus === 'cleared' ? 'Cleared' : 
           'Cancelled'} ({filteredShipments.length})
        </h2>
        <UnifiedShipmentTable shipments={filteredShipments} />
      </div>

      {/* Documents Viewer Modal */}
      {viewingDocuments && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-900 text-lg font-semibold">Documents - Shipment #{viewingDocuments.id}</h3>
              <button onClick={() => setViewingDocuments(null)} className="text-slate-500 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Form Documents */}
              {viewingDocuments.uploadedDocuments && Object.values(viewingDocuments.uploadedDocuments).filter(d => d.source === 'form').length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2 text-sm">Documents from Form</h4>
                  <div className="space-y-2">
                    {Object.entries(viewingDocuments.uploadedDocuments)
                      .filter(([_, doc]) => doc.source === 'form')
                      .map(([key, doc]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-green-600" />
                            <div>
                              <p className="text-sm text-slate-900">{doc.name || key}</p>
                              {doc.fileName && <p className="text-xs text-slate-500">File: {doc.fileName}</p>}
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Form</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Chat Documents */}
              {viewingDocuments.uploadedDocuments && Object.values(viewingDocuments.uploadedDocuments).filter(d => !d.source || d.source !== 'form').length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2 text-sm">Documents from Chat</h4>
                  <div className="space-y-2">
                    {Object.entries(viewingDocuments.uploadedDocuments)
                      .filter(([_, doc]) => !doc.source || doc.source !== 'form')
                      .map(([key, doc]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-purple-600" />
                            <div>
                              <p className="text-sm text-slate-900">{doc.name || key}</p>
                              {doc.uploadedAt && <p className="text-xs text-slate-500">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</p>}
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Chat</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {!viewingDocuments.uploadedDocuments || Object.keys(viewingDocuments.uploadedDocuments).length === 0 && (
                <p className="text-slate-600 text-center py-8">No documents uploaded yet</p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setViewingDocuments(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}