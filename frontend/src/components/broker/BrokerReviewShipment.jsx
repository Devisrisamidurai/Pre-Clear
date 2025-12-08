import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Package,
  MapPin,
  FileText,
  Zap,
  MessageCircle,
  Upload,
  Shield,
  TrendingUp,
  Eye
} from 'lucide-react';
import { useShipments } from '../../hooks/useShipments';
import { getCurrencyByCountry } from '../../utils/validation';
import { ShipmentChatPanel } from '../ShipmentChatPanel';
import { shipmentsStore } from '../../store/shipmentsStore';

export function BrokerReviewShipment({ shipment: initialShipment = {}, onNavigate }) {
  const { brokerApprove, brokerDeny } = useShipments();
  const [currentShipment, setCurrentShipment] = useState(initialShipment || {});
  const [chatOpen, setChatOpen] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [showDocRequestModal, setShowDocRequestModal] = useState(false);
  const [denyReason, setDenyReason] = useState('');
  const [brokerNotes, setBrokerNotes] = useState(''); // kept for approve handler, UI removed per request
  const [docRequestMessage, setDocRequestMessage] = useState('');
  const [requestedDocNames, setRequestedDocNames] = useState([]);
  const [viewingDocument, setViewingDocument] = useState(null);
  const [showAllDocs, setShowAllDocs] = useState(false);

  // Keep currency derived from origin country (fallback to US)
  const currency = getCurrencyByCountry(currentShipment?.originCountry || 'US');

  // Subscribe to store updates for this shipment id (if available)
  useEffect(() => {
    const shipmentId = initialShipment?.id ?? currentShipment?.id;
    if (!shipmentId) return undefined;

    const unsubscribe = shipmentsStore.subscribe(() => {
      const updated = shipmentsStore.getShipmentById(shipmentId);
      if (updated) setCurrentShipment(updated);
    });

    return () => unsubscribe();
  }, [initialShipment?.id, currentShipment?.id]);

  // Approve handler
  const handleApprove = () => {
    const id = currentShipment?.id;
    if (!id) return;
    shipmentsStore.brokerApprove(id, brokerNotes || 'Approved after document review.');
    setShowApproveConfirm(false);

    shipmentsStore.addNotification({
      id: `notif-${Date.now()}`,
      type: 'broker-approved',
      title: 'Shipment Approved!',
      message: `Your shipment #${id} has been approved by the broker. Token generated.`,
      shipmentId: id,
      timestamp: new Date().toISOString(),
      read: false,
      recipientRole: 'shipper'
    });

    onNavigate?.('broker-dashboard');
  };

  // Deny handler
  const handleDeny = () => {
    const id = currentShipment?.id;
    if (!id || !denyReason.trim()) return;
    shipmentsStore.brokerDeny(id, denyReason);

    shipmentsStore.addNotification({
      id: `notif-${Date.now()}`,
      type: 'broker-denied',
      title: 'Shipment Denied',
      message: `Your shipment #${id} has been denied by the broker. Reason: ${denyReason}`,
      shipmentId: id,
      timestamp: new Date().toISOString(),
      read: false,
      recipientRole: 'shipper'
    });

    setShowDenyModal(false);
    onNavigate?.('broker-dashboard');
  };

  // Request additional documents handler
  const handleRequestDocuments = () => {
    const id = currentShipment?.id;
    if (!id || requestedDocNames.length === 0 || !docRequestMessage) return;

    const docs = requestedDocNames.map((name) => ({
      name,
      type: name.toLowerCase().includes('invoice') ? 'invoice' : 'document'
    }));

    shipmentsStore.brokerRequestDocuments(id, docs, docRequestMessage);

    shipmentsStore.addNotification({
      id: `notif-${Date.now()}`,
      type: 'documents-requested',
      title: 'Additional Documents Requested',
      message: `Broker has requested additional documents for shipment #${id}`,
      shipmentId: id,
      timestamp: new Date().toISOString(),
      read: false,
      recipientRole: 'shipper'
    });

    setShowDocRequestModal(false);
    onNavigate?.('broker-dashboard');
  };

  // Safely render fallback if no shipment
  if (!currentShipment || Object.keys(currentShipment).length === 0) {
    return (
      <div style={{ background: '#FBF9F6', minHeight: '100vh', padding: 24 }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-slate-700">No shipment selected.</p>
          <button
            onClick={() => onNavigate?.('broker-dashboard')}
            className="mt-4 px-4 py-2 rounded-lg"
            style={{ background: '#7A5B52', color: '#ffffff', border: '2px solid #5a4038' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#FBF9F6', minHeight: '100vh', padding: 24 }}>
      {/* Header: Back + Title */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate?.('broker-dashboard')}
          className="mb-2 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <h1 className="text-slate-900 mb-1">Review Shipment #{currentShipment.id}</h1>
        <p className="text-slate-600">Detailed compliance review and approval</p>
      </div>

      {/* Shipper details and Quick Actions — parallel (side-by-side on md+) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-start">
        {/* Shipper details card (left) */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="text-left">
            <h3 className="text-sm font-medium text-slate-900 mb-2">Shipper Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Shipper Name</p>
                <p className="text-slate-900">{currentShipment.shipperName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Shipper ID</p>
                <p className="text-slate-900">{currentShipment.shipperId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Origin Country</p>
                <p className="text-slate-900">{currentShipment.originCountry}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Origin City</p>
                <p className="text-slate-900">{currentShipment.originCity}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-slate-500 mb-1">Origin Address</p>
                <p className="text-slate-900 text-sm">{currentShipment.originAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions card (right) */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <h3 className="text-slate-900 mb-3">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowApproveConfirm(true)}
              className="w-full px-4 py-2 rounded-md text-white font-medium"
              style={{ background: '#16A34A', border: '2px solid #12733A' }}
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Approve</span>
              </div>
            </button>

            <button
              onClick={() => setShowDocRequestModal(true)}
              className="w-full px-4 py-2 rounded-md text-white font-medium"
              style={{ background: '#2563EB', border: '2px solid #1E40AF' }}
            >
              <div className="flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Request Documents</span>
              </div>
            </button>

            <button
              onClick={() => setShowDenyModal(true)}
              className="w-full px-4 py-2 rounded-md text-white font-medium"
              style={{ background: '#EF4444', border: '2px solid #B91C1C' }}
            >
              <div className="flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" />
                <span>Deny</span>
              </div>
            </button>

            <button
              onClick={() => setChatOpen(true)}
              className="w-full px-4 py-2 rounded-md text-[#2F1B17] font-medium border-2 border-[#2F1B17] bg-[#FBF9F6]"
            >
              <div className="flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>Message</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Product Details */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h2 className="text-slate-900 mb-4">Product Details</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <p className="text-xs text-slate-500 mb-1">Product Name</p>
                <p className="text-slate-900">{currentShipment.productName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">HS Code</p>
                <p className="text-slate-900">{currentShipment.hsCode}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Quantity</p>
                <p className="text-slate-900">{currentShipment.quantity} units</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Weight</p>
                <p className="text-slate-900">{currentShipment.weight} kg</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Product Value</p>
                <p className="text-slate-900">{currency.symbol}{currentShipment.value} {currency.code}</p>
              </div>
            </div>
          </div>

          {/* AI Compliance Flags */}
          {currentShipment.aiResults && currentShipment.aiResults.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-slate-900 mb-4">AI Compliance Flags</h2>
              <div className="space-y-3">
                {currentShipment.aiResults.map((result, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${result.status === 'passed' ? 'bg-green-50 border-green-200' : result.status === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start gap-3">
                      {result.status === 'passed' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {result.status === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                      {result.status === 'failed' && <XCircle className="w-5 h-5 text-red-600" />}
                      <div className="flex-1">
                        <p className={`text-sm mb-1 ${result.status === 'passed' ? 'text-green-900' : result.status === 'warning' ? 'text-amber-900' : 'text-red-900'}`}>{result.title}</p>
                        <p className="text-xs text-slate-600">{result.description}</p>
                        {result.suggestion && <p className="text-xs text-slate-500 mt-1">💡 {result.suggestion}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Status */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-900">Document Status</h2>
              <div>
                <button onClick={() => setShowAllDocs(true)} className="text-sm px-3 py-1 rounded-lg" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }}>View All Documents</button>
              </div>
            </div>
            <div className="space-y-2">
              {(currentShipment.documents || []).length > 0 ? (
                (currentShipment.documents || []).map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {doc.uploaded ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                      <div>
                        <p className="text-sm text-slate-900">{doc.name}</p>
                        {doc.uploaded && doc.uploadedAt && <p className="text-xs text-slate-500">Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {doc.uploaded ? (
                        <button
                          onClick={() => setViewingDocument({ ...doc, shipmentId: currentShipment.id })}
                          className="px-3 py-1 rounded-lg text-sm"
                          style={{ background: '#2563EB', color: '#ffffff', border: '2px solid #1E40AF' }}
                        >
                          View
                        </button>
                      ) : (
                        <span className={`px-2 py-1 text-xs rounded-full ${doc.uploaded ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{doc.uploaded ? 'Uploaded' : 'Missing'}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No documents uploaded yet</p>
              )}
            </div>
          </div>

          {/* NOTE: "Notes to Shipper" section removed as requested */}
        </div>

        {/* Right column: Shipment Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="text-slate-900 mb-4">Shipment Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-600">Shipment ID:</span><span className="text-slate-900">{currentShipment.id}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Status:</span><span className="text-slate-900">{currentShipment.status}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">AI Approval:</span><span className={currentShipment.aiApproval === 'approved' ? 'text-green-600' : 'text-amber-600'}>{currentShipment.aiApproval}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Created:</span><span className="text-slate-900">{currentShipment.createdAt ? new Date(currentShipment.createdAt).toLocaleDateString() : ''}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Confirmation Modal */}
      {showApproveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div>
              <div>
                <h3 className="text-slate-900 mb-2">Approve Shipment?</h3>
                <p className="text-slate-600 text-sm">This will generate a token for shipment #{currentShipment.id} and notify the shipper.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowApproveConfirm(false)} className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg">Cancel</button>
              <button onClick={handleApprove} className="flex-1 px-4 py-3 rounded-lg" style={{ background: '#16A34A', color: '#ffffff', border: '2px solid #12733A' }}>Confirm Approval</button>
            </div>
          </div>
        </div>
      )}

      {/* Deny Modal */}
      {showDenyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-slate-900 mb-4">Deny Shipment</h3>
            <p className="text-slate-600 text-sm mb-4">Please provide a reason for denying this shipment:</p>
            <textarea value={denyReason} onChange={(e) => setDenyReason(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-4" rows={4} />
            <div className="flex gap-3">
              <button onClick={() => setShowDenyModal(false)} className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg">Cancel</button>
              <button onClick={handleDeny} disabled={!denyReason.trim()} className="flex-1 px-4 py-3 rounded-lg" style={{ background: '#EF4444', color: '#ffffff', border: '2px solid #B91C1C' }}>Confirm Denial</button>
            </div>
          </div>
        </div>
      )}

      {/* Request Documents Modal */}
      {showDocRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h3 className="text-slate-900 mb-4">Request Additional Documents</h3>
            <div className="mb-4">
              <label className="block text-slate-700 mb-2">Document Names (one per line)</label>
              <textarea value={requestedDocNames.join('\n')} onChange={(e) => setRequestedDocNames(e.target.value.split('\n').filter(Boolean))} className="w-full p-3 border border-slate-300 rounded-lg h-32" placeholder="Safety Certificate\nTechnical Specifications\nISO Certification" />
            </div>
            <div className="mb-6">
              <label className="block text-slate-700 mb-2">Message to Shipper</label>
              <textarea value={docRequestMessage} onChange={(e) => setDocRequestMessage(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg h-24" placeholder="Please provide the following additional documents for customs clearance..." />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDocRequestModal(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg">Cancel</button>
              <button onClick={handleRequestDocuments} disabled={requestedDocNames.length === 0 || !docRequestMessage} className="px-4 py-2 rounded-lg" style={{ background: '#2563EB', color: '#ffffff', border: '2px solid #1E40AF' }}>Send Request</button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Panel */}
      <ShipmentChatPanel shipmentId={currentShipment.id} isOpen={chatOpen} onClose={() => setChatOpen(false)} userRole="broker" userName="Customs Broker" />

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900">{viewingDocument.name}</h3>
              <button onClick={() => setViewingDocument(null)} className="text-slate-500">Close</button>
            </div>
            <p className="text-slate-600 text-sm mb-4">Preview not available in demo. You can download the file below.</p>
            <div className="flex justify-end">
              <a href="#" onClick={(e) => { e.preventDefault(); alert(`Downloading ${viewingDocument.name} for shipment ${viewingDocument.shipmentId}`); }} className="px-4 py-2 rounded-lg" style={{ background: '#2563EB', color: '#ffffff', border: '2px solid #1E40AF' }}>Download</a>
            </div>
          </div>
        </div>
      )}

      {/* All Documents Modal */}
      {showAllDocs && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900">All Uploaded Documents</h3>
              <button onClick={() => setShowAllDocs(false)} className="text-slate-500">Close</button>
            </div>
            <div className="space-y-3">
              {(currentShipment.documents || []).filter(d => d.uploaded).length > 0 ? (
                (currentShipment.documents || []).filter(d => d.uploaded).map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm text-slate-900">{doc.name}</p>
                      {doc.uploadedAt && <p className="text-xs text-slate-500">Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setViewingDocument({ ...doc, shipmentId: currentShipment.id }); setShowAllDocs(false); }} className="px-3 py-1 rounded-lg text-sm" style={{ background: '#2563EB', color: '#ffffff', border: '2px solid #1E40AF' }}>View</button>
                      <a href="#" onClick={(e) => { e.preventDefault(); alert(`Downloading ${doc.name} for shipment ${currentShipment.id}`); }} className="px-3 py-1 rounded-lg text-sm" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }}>Download</a>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No uploaded documents available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrokerReviewShipment;
