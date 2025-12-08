import { 
  Clock, 
  CheckCircle, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  MessageCircle, 
  RefreshCw, 
  Eye,
  Zap
} from 'lucide-react';
import { ShipmentChatPanel } from '../ShipmentChatPanel';
import { shipmentsStore } from '../../store/shipmentsStore';
import { useState, useEffect } from 'react';
import { useShipments } from '../../hooks/useShipments';
import { getCurrencyByCountry } from '../../utils/validation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export function BrokerDashboard({ onNavigate }) {
  const { shipments = [] } = useShipments();

  // Derived groups (still available if you want to show counts)
  const pendingShipments = shipments.filter(s =>
    s.aiApproval === 'approved' &&
    (s.brokerApproval === 'pending' || s.brokerApproval === 'not-started')
  );
  const newShipments = shipments.filter(s =>
    s.status === 'documents-uploaded' || s.status === 'awaiting-ai'
  );
  const documentsRequested = shipments.filter(s => s.status === 'document-requested');
  const documentsResubmitted = shipments.filter(s =>
    s.status === 'awaiting-broker' && s.brokerApproval === 'documents-requested'
  );

  // Chat state
  const [selectedShipmentForChat, setSelectedShipmentForChat] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  // Notifications removed from dashboard header per user request

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
      return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Documents Resubmitted</span>;
    }
    if (shipment.aiApproval === 'approved' && shipment.brokerApproval === 'pending') {
      return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Pending Review</span>;
    }
    if (shipment.status === 'documents-uploaded' || shipment.status === 'awaiting-ai') {
      return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">New - Awaiting AI</span>;
    }
    return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">{shipment.status}</span>;
  };

  // Unified table component that lists all shipments
  const UnifiedShipmentTable = ({ shipmentsList }) => {
    if (!shipmentsList || shipmentsList.length === 0) {
      return (
        <div className="bg-white border border-slate-200 rounded-lg p-6 text-center">
          <p className="text-slate-600">No shipments to show.</p>
        </div>
      );
    }

    return (
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Shipment ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>HS Code</TableHead>
              <TableHead>Shipper</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>AI Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {shipmentsList.map((shipment) => {
              const currency = getCurrencyByCountry(shipment.originCountry || 'US');
              const aiScore = shipment.aiScore || 0;

              return (
                <TableRow key={shipment.id} className="hover:bg-slate-50">
                  <TableCell><span className="text-slate-900">#{shipment.id}</span></TableCell>
                  <TableCell><span className="text-slate-900">{shipment.productName}</span></TableCell>
                  <TableCell><span className="text-slate-600 text-sm">{shipment.hsCode}</span></TableCell>
                  <TableCell><span className="text-slate-900">{shipment.shipperName}</span></TableCell>
                  <TableCell><span className="text-slate-900">{shipment.originCountry}</span></TableCell>
                  <TableCell><span className="text-slate-900">{currency.symbol}{shipment.value} {currency.code}</span></TableCell>

                  <TableCell>
                    {aiScore > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${aiScore >= 80 ? 'bg-green-500' : aiScore >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${aiScore}%` }}
                          />
                        </div>
                        <span className={`text-sm ${aiScore >= 80 ? 'text-green-700' : aiScore >= 60 ? 'text-amber-700' : 'text-red-700'}`}>{aiScore}%</span>
                      </div>
                    ) : <span className="text-slate-400 text-sm">-</span>}
                  </TableCell>

                  <TableCell>{getStatusBadge(shipment)}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* REVIEW button - light coffee brown with white text */}
                      <button
                        onClick={() => onNavigate('broker-review', shipment)}
                        className="px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                        style={{ background: '#7A5B52', color: '#ffffff' }}
                      >
                        <Eye className="w-3.5 h-3.5 text-white" />
                        Review
                      </button>

                      {/* CHAT button - also yellow outline */}
                      <button
                        onClick={() => handleOpenChat(shipment.id)}
                        className="px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                        style={{ background: '#FFF4DC', color: '#2F1B17', border: '2px solid #E6B800' }}
                        title="Open chat"
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

  // Use shipments array as the single combined table source
  const allShipments = shipments;

  return (
    <div style={{ background: '#FBF9F6', minHeight: '100vh', paddingBottom: 48 }}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[#2F1B17] mb-2 text-2xl font-semibold">Broker Dashboard</h1>
          <p className="text-[#7A5B52]">Review and approve shipments pending broker verification</p>
        </div>

        {/* notifications removed */}
      </div>

      {/* notification panel removed from dashboard */}

      {/* Stats (kept as quick overview) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-0">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Pending Review</p>
              <p className="text-slate-900 text-2xl font-semibold">{pendingShipments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">New Submissions</p>
              <p className="text-slate-900 text-2xl font-semibold">{newShipments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Docs Requested</p>
              <p className="text-slate-900 text-2xl font-semibold">{documentsRequested.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Approved Today</p>
              <p className="text-slate-900 text-2xl font-semibold">{approvedToday}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Unified table showing all shipments */}
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-[#2F1B17]">All Shipments</h2>
          <p className="text-[#7A5B52] text-sm">Combined list of all shipments (filter/sort in table component as needed)</p>
        </div>

        <UnifiedShipmentTable shipmentsList={allShipments} />
      </div>

      {/* Empty state when no shipments */}
      {(!allShipments || allShipments.length === 0) && (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-slate-900 mb-2">All Caught Up!</h3>
          <p className="text-slate-500">No shipments available right now.</p>
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

export default BrokerDashboard;
