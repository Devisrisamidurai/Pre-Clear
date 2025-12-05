import { PackagePlus, Package, Clock, CheckCircle, XCircle, AlertTriangle, TrendingUp, Upload, DollarSign, Eye } from 'lucide-react';
import { NotificationPanel } from '../NotificationPanel';
import { shipmentsStore } from '../../store/shipmentsStore';
import { useState } from 'react';
import { useShipments } from '../../hooks/useShipments';
import { getCurrencyByCountry } from '../../utils/validation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export function ShipperDashboard({ onNavigate }) {
  const { shipments: allShipments } = useShipments();
  
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

  const getStatusBadge = (shipment) => {
    if (shipment.status === 'cancelled') {
      return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm flex items-center gap-1">
        <XCircle className="w-3 h-3" />
        Cancelled
      </span>;
    }
    if (shipment.status === 'document-requested') {
      return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Documents Requested
      </span>;
    }
    if (shipment.token && shipment.status === 'token-generated') {
      return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Cleared
      </span>;
    }
    if (shipment.aiApproval === 'approved' && shipment.brokerApproval === 'approved') {
      return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Cleared
      </span>;
    }
    if (shipment.status === 'awaiting-broker' || shipment.brokerApproval === 'pending') {
      return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Broker Review
      </span>;
    }
    if (shipment.status === 'awaiting-ai' || shipment.aiApproval === 'pending') {
      return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1">
        <Clock className="w-3 h-3" />
        AI Processing
      </span>;
    }
    if (shipment.aiApproval === 'rejected' || shipment.brokerApproval === 'rejected') {
      return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1">
        <XCircle className="w-3 h-3" />
        Rejected
      </span>;
    }
    return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm flex items-center gap-1">
      <Clock className="w-3 h-3" />
      Pending Review
    </span>;
  };

  const getActionButton = (shipment) => {
    if (shipment.status === 'cancelled') {
      return null;
    }
    if (shipment.status === 'document-requested') {
      return (
        <button
          onClick={() => onNavigate('upload-documents', shipment)}
          className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
        >
          <Upload className="w-3.5 h-3.5" />
          Upload Docs
        </button>
      );
    }
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
    return (
      <button
        onClick={() => onNavigate('shipment-details', shipment)}
        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
      >
        <Eye className="w-3.5 h-3.5" />
        View
      </button>
    );
  };

  const ShipmentTable = ({ shipments }) => {
    if (shipments.length === 0) {
      return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
          <p className="text-slate-500">No shipments in this category</p>
        </div>
      );
    }

    return (
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Shipment ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>AI Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.map((shipment) => {
              const currency = getCurrencyByCountry(shipment.originCountry || 'US');
              const aiScore = shipment.aiScore || 0;
              
              return (
                <TableRow key={shipment.id} className="hover:bg-slate-50">
                  <TableCell>
                    <span className="text-slate-900">#{shipment.id}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-900">{shipment.productName}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-slate-900">{shipment.destCountry}</div>
                      <div className="text-slate-500 text-xs">{shipment.destCity}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-900">{currency.symbol}{shipment.value} {currency.code}</span>
                  </TableCell>
                  <TableCell>
                    {aiScore > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              aiScore >= 85 ? 'bg-green-500' : 
                              aiScore >= 70 ? 'bg-amber-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${aiScore}%` }}
                          />
                        </div>
                        <span className={`text-sm ${
                          aiScore >= 85 ? 'text-green-700' : 
                          aiScore >= 70 ? 'text-amber-700' : 
                          'text-red-700'
                        }`}>
                          {aiScore}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(shipment)}
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-600 text-sm">
                      {new Date(shipment.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {getActionButton(shipment)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  const CategorySection = ({ title, count, color, shipments }) => (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-slate-900">{title}</h2>
        <span className={`px-3 py-1 ${color} rounded-full text-sm`}>
          {count} shipment{count !== 1 ? 's' : ''}
        </span>
      </div>
      
      <ShipmentTable shipments={shipments} />
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Shipper Dashboard</h1>
        <p className="text-slate-600">Manage your shipments and track pre-clearance approvals</p>
      </div>

      {/* Real-time Notifications */}
      <div className="mb-6">
        <NotificationPanel role="shipper" onNavigate={onNavigate} />
      </div>

      {/* Quick Actions - Only Create Shipment */}
      <div className="mb-8">
        <button
          onClick={() => onNavigate('create-shipment')}
          className="w-full p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-2xl transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <PackagePlus className="w-7 h-7" />
            </div>
            <div className="text-left">
              <h3 className="text-xl mb-1">Create New Shipment</h3>
              <p className="text-blue-100 text-sm">Start pre-clearance process with AI-powered compliance check</p>
            </div>
          </div>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm">Pending Review</p>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-slate-900 text-2xl">{pendingReview.length}</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm">In Review</p>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-slate-900 text-2xl">{inReview.length}</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm">Cleared</p>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-slate-900 text-2xl">{cleared.length}</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm">Cancelled</p>
            <XCircle className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-slate-900 text-2xl">{cancelled.length}</p>
        </div>
      </div>

      {/* Categorized Shipments */}
      <CategorySection 
        title="Pending Review" 
        count={pendingReview.length}
        color="bg-amber-100 text-amber-700"
        shipments={pendingReview}
      />
      
      <CategorySection 
        title="In Review" 
        count={inReview.length}
        color="bg-blue-100 text-blue-700"
        shipments={inReview}
      />
      
      <CategorySection 
        title="Cleared" 
        count={cleared.length}
        color="bg-green-100 text-green-700"
        shipments={cleared}
      />
      
      <CategorySection 
        title="Cancelled" 
        count={cancelled.length}
        color="bg-slate-100 text-slate-600"
        shipments={cancelled}
      />
    </div>
  );
}

