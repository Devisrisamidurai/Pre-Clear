import { Clock, CheckCircle, FileText, AlertTriangle, TrendingUp, MessageCircle, RefreshCw, Eye, Zap } from 'lucide-react';
import { NotificationPanel } from '../NotificationPanel';
import { SyncStatusModule } from '../SyncStatusModule';
import { ShipmentChatPanel } from '../ShipmentChatPanel';
import { shipmentsStore } from '../../store/shipmentsStore';
import { useState, useEffect } from 'react';
import { useShipments } from '../../hooks/useShipments';
import { getCurrencyByCountry } from '../../utils/validation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export function BrokerDashboard({ onNavigate }) {
  const { shipments } = useShipments();
  
  const pendingShipments = shipments.filter(s => 
    s.aiApproval === 'approved' && 
    (s.brokerApproval === 'pending' || s.brokerApproval === 'not-started')
  );
  
  const newShipments = shipments.filter(s =>
    s.status === 'documents-uploaded' || s.status === 'awaiting-ai'
  );
  
  const documentsRequested = shipments.filter(s => 
    s.status === 'document-requested'
  );
  
  const documentsResubmitted = shipments.filter(s =>
    s.status === 'awaiting-broker' && s.brokerApproval === 'documents-requested'
  );

  const [selectedShipmentForChat, setSelectedShipmentForChat] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  
  const approvedToday = shipments.filter(s => 
    s.brokerApproval === 'approved' && 
    s.brokerReviewedAt && 
    new Date(s.brokerReviewedAt).toDateString() === new Date().toDateString()
  ).length;

  const handleOpenChat = (shipmentId) => {
    setSelectedShipmentForChat(shipmentId);
    setChatOpen(true);
  };

  const getStatusBadge = (shipment) => {
    if (shipment.status === 'document-requested') {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">Awaiting Documents</span>;
    }
    if (shipment.status === 'awaiting-broker' && shipment.brokerApproval === 'documents-requested') {
      return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
        <RefreshCw className="w-3 h-3" />
        Documents Resubmitted
      </span>;
    }
    if (shipment.aiApproval === 'approved' && shipment.brokerApproval === 'pending') {
      return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Pending Review</span>;
    }
    if (shipment.status === 'documents-uploaded' || shipment.status === 'awaiting-ai') {
      return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">New - Awaiting AI</span>;
    }
    return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">{shipment.status}</span>;
  };

  const ShipmentTable = ({ shipments }) => {
    if (shipments.length === 0) {
      return null;
    }

    return (
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Shipment ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>HS Code</TableHead>
              <TableHead>Shipper Name</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>AI Score</TableHead>
              <TableHead>Status</TableHead>
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
                    <span className="text-slate-600 text-sm">{shipment.hsCode}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-900">{shipment.shipperName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-900">{shipment.originCountry}</span>
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
                              aiScore >= 80 ? 'bg-green-500' : 
                              aiScore >= 60 ? 'bg-amber-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${aiScore}%` }}
                          />
                        </div>
                        <span className={`text-sm ${
                          aiScore >= 80 ? 'text-green-700' : 
                          aiScore >= 60 ? 'text-amber-700' : 
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
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onNavigate('broker-review', shipment)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Review
                      </button>
                      <button
                        onClick={() => handleOpenChat(shipment.id)}
                        className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Broker Dashboard</h1>
        <p className="text-slate-600">Review and approve shipments pending broker verification</p>
      </div>

      {/* Real-time Notifications */}
      <div className="mb-6">
        <NotificationPanel role="broker" onNavigate={onNavigate} />
      </div>

      {/* Sync Status Module */}
      {pendingShipments.length > 0 && (
        <div className="mb-6">
          <SyncStatusModule 
            shipmentId={pendingShipments[0].id} 
            role="broker" 
          />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Pending Review</p>
              <p className="text-slate-900 text-2xl">{pendingShipments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">New Submissions</p>
              <p className="text-slate-900 text-2xl">{newShipments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Docs Requested</p>
              <p className="text-slate-900 text-2xl">{documentsRequested.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Approved Today</p>
              <p className="text-slate-900 text-2xl">{approvedToday}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Product Reviews Section */}
      {pendingShipments.length > 0 && (
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-slate-900">Pending Product Reviews</h2>
            <p className="text-slate-600 text-sm">AI-approved shipments awaiting your review</p>
          </div>
          
          <ShipmentTable shipments={pendingShipments} />
        </div>
      )}

      {/* Documents Resubmitted Section */}
      {documentsResubmitted.length > 0 && (
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-slate-900">Documents Resubmitted</h2>
            <p className="text-slate-600 text-sm">Shippers have uploaded requested documents</p>
          </div>
          
          <ShipmentTable shipments={documentsResubmitted} />
        </div>
      )}

      {/* New Shipments Section */}
      {newShipments.length > 0 && (
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-slate-900">New Shipments</h2>
            <p className="text-slate-600 text-sm">Waiting for AI validation</p>
          </div>
          
          <ShipmentTable shipments={newShipments} />
        </div>
      )}

      {/* Documents Requested Section */}
      {documentsRequested.length > 0 && (
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-slate-900">Awaiting Documents</h2>
            <p className="text-slate-600 text-sm">Shipments with requested documents pending upload</p>
          </div>
          
          <ShipmentTable shipments={documentsRequested} />
        </div>
      )}

      {/* Empty State */}
      {pendingShipments.length === 0 && newShipments.length === 0 && documentsRequested.length === 0 && documentsResubmitted.length === 0 && (
        <div className="bg-slate-50 rounded-xl p-12 text-center border border-slate-200">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-slate-900 mb-2">All Caught Up!</h3>
          <p className="text-slate-600">No shipments pending review at the moment.</p>
        </div>
      )}

      {/* Chat Panel */}
      {selectedShipmentForChat && (
        <ShipmentChatPanel
          shipmentId={selectedShipmentForChat}
          isOpen={chatOpen}
          onClose={() => {
            setChatOpen(false);
            setSelectedShipmentForChat(null);
          }}
          userRole="broker"
          userName="Customs Broker"
        />
      )}
    </div>
  );
}

