import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Package,
  FileText,
  Zap,
  MessageCircle,
  Upload,
  Shield,
  TrendingUp,
  Eye,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { useShipments } from '../../hooks/useShipments';
import { getCurrencyByCountry, formatCurrency } from '../../utils/validation';
import { ShipmentChatPanel } from '../ShipmentChatPanel';
import { shipmentsStore } from '../../store/shipmentsStore';

// Helper function to format time to 12-hour format with AM/PM
const formatTimeWithAmPm = (timeString) => {
  if (!timeString) return 'N/A';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export function ApprovedShipviewpg({ shipment: initialShipment = {}, onNavigate }) {
  const [currentShipment, setCurrentShipment] = useState(initialShipment || {});
  const [chatOpen, setChatOpen] = useState(false);
    const [showApproveConfirm, setShowApproveConfirm] = useState(false);
    const [showDenyModal, setShowDenyModal] = useState(false);
    const [showDocRequestModal, setShowDocRequestModal] = useState(false);
    const [denyReason, setDenyReason] = useState('');
    const [brokerNotes, setBrokerNotes] = useState('');
    const [docRequestMessage, setDocRequestMessage] = useState('');
    const [requestedDocNames, setRequestedDocNames] = useState([]);
    const [viewingDocument, setViewingDocument] = useState(null);
    const [showAllDocs, setShowAllDocs] = useState(false);

    const currencyCode = currentShipment?.currency || 'USD';
    const currencySymbol = { 
      USD: '$', 
      EUR: '€', 
      GBP: '£', 
      JPY: '¥', 
      CAD: 'C$', 
      INR: '₹',
      CNY: '¥',
      AUD: 'A$'
    }[currencyCode] || currencyCode;

    useEffect(() => {
      const shipmentId = initialShipment?.id ?? currentShipment?.id;
      if (!shipmentId) return undefined;

      const unsubscribe = shipmentsStore.subscribe(() => {
        const updated = shipmentsStore.getShipmentById(shipmentId);
        if (updated) setCurrentShipment(updated);
      });

      return () => unsubscribe();
    }, [initialShipment?.id, currentShipment?.id]);

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Comprehensive Shipment Details */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-slate-900 mb-6">Shipment Details</h2>
              
              {/* Basics Section */}
              <div className="mb-8 pb-6 border-b border-slate-200">
                <h3 className="text-slate-900 font-semibold mb-4">Shipment Basics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Title</p>
                    <p className="text-slate-900">{currentShipment.title || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Mode</p>
                    <p className="text-slate-900">{currentShipment.mode || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Shipment Type</p>
                    <p className="text-slate-900">{currentShipment.shipmentType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Service Level</p>
                    <p className="text-slate-900">{currentShipment.serviceLevel || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Currency</p>
                    <p className="text-slate-900">{currentShipment.currency || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Pickup Type</p>
                    <p className="text-slate-900">{currentShipment.pickupType || 'N/A'}</p>
                    {currentShipment.pickupType === 'Drop-off' && currentShipment.estimatedDropoffDate && (
                      <p className="text-xs text-slate-500 mt-1">Estimated Drop-off: {new Date(currentShipment.estimatedDropoffDate).toLocaleDateString()}</p>
                    )}
                    {currentShipment.pickupType === 'Scheduled Pickup' && (
                      <div className="text-xs text-slate-500 mt-1">
                        {currentShipment.pickupLocation && <div>Location: {currentShipment.pickupLocation}</div>}
                        {currentShipment.pickupDate && <div>Date: {new Date(currentShipment.pickupDate).toLocaleDateString()}</div>}
                        {(currentShipment.pickupTimeEarliest || currentShipment.pickupTimeLatest) && (
                          <div>Time: {formatTimeWithAmPm(currentShipment.pickupTimeEarliest)} — {formatTimeWithAmPm(currentShipment.pickupTimeLatest)}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipper Section */}
              <div className="mb-8 pb-6 border-b border-slate-200">
                <h3 className="text-slate-900 font-semibold mb-4">Shipper Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Company</p>
                    <p className="text-slate-900">{currentShipment.shipper?.company || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Contact Name</p>
                    <p className="text-slate-900">{currentShipment.shipper?.contactName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Phone</p>
                    <p className="text-slate-900">{currentShipment.shipper?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Email</p>
                    <p className="text-slate-900">{currentShipment.shipper?.email || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-500 text-sm mb-1">Address</p>
                    <p className="text-slate-900">{currentShipment.shipper?.address1 || 'N/A'}</p>
                    {currentShipment.shipper?.address2 && <p className="text-slate-900">{currentShipment.shipper.address2}</p>}
                    <p className="text-slate-900">{currentShipment.shipper?.city || ''}, {currentShipment.shipper?.state || ''} {currentShipment.shipper?.postalCode || ''}</p>
                    <p className="text-slate-900">{currentShipment.shipper?.country || ''}</p>
                  </div>
                </div>
              </div>

              {/* Consignee Section */}
              <div className="mb-8 pb-6 border-b border-slate-200">
                <h3 className="text-slate-900 font-semibold mb-4">Consignee Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Company</p>
                    <p className="text-slate-900">{currentShipment.consignee?.company || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Contact Name</p>
                    <p className="text-slate-900">{currentShipment.consignee?.contactName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Phone</p>
                    <p className="text-slate-900">{currentShipment.consignee?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Email</p>
                    <p className="text-slate-900">{currentShipment.consignee?.email || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-500 text-sm mb-1">Address</p>
                    <p className="text-slate-900">{currentShipment.consignee?.address1 || 'N/A'}</p>
                    {currentShipment.consignee?.address2 && <p className="text-slate-900">{currentShipment.consignee.address2}</p>}
                    <p className="text-slate-900">{currentShipment.consignee?.city || ''}, {currentShipment.consignee?.state || ''} {currentShipment.consignee?.postalCode || ''}</p>
                    <p className="text-slate-900">{currentShipment.consignee?.country || ''}</p>
                  </div>
                </div>
              </div>

              {/* Packages and Products Section */}
              <div className="mb-8 pb-6 border-b border-slate-200">
                <h3 className="text-slate-900 font-semibold mb-4">Packages & Products</h3>
                <div className="space-y-4">
                  {(currentShipment.packages || []).map((pkg, pkgIdx) => (
                    <div key={pkgIdx} className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-slate-900 font-medium mb-3">Package {pkgIdx + 1}</p>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Type</p>
                          <p className="text-slate-900 text-sm">{pkg.type || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Dimensions</p>
                          <p className="text-slate-900 text-sm">{pkg.length}x{pkg.width}x{pkg.height} {pkg.dimUnit || 'cm'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Weight</p>
                          <p className="text-slate-900 text-sm">{pkg.weight} {pkg.weightUnit || 'kg'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Stackable</p>
                          <p className="text-slate-900 text-sm">{pkg.stackable ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                      {(pkg.products || []).length > 0 && (
                        <div className="border-t border-slate-200 pt-3">
                          <p className="text-slate-900 text-sm font-medium mb-2">Products in Package:</p>
                          <div className="space-y-2">
                            {pkg.products.map((prod, prodIdx) => (
                              <div key={prodIdx} className="text-sm bg-white p-2 rounded border border-slate-200">
                                <p className="text-slate-900 font-medium">{prod.name || 'N/A'}</p>
                                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mt-1">
                                  <div>HS Code: {prod.hsCode || 'N/A'}</div>
                                  <div>Qty: {prod.qty || 0} {prod.uom || ''}</div>
                                  <div>Unit Price: {currencySymbol}{prod.unitPrice || 0}</div>
                                  <div>Total: {currencySymbol}{prod.totalValue || 0}</div>
                                  <div className="col-span-2">Origin: {prod.originCountry || 'N/A'}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents Section */}
              <div>
                <h3 className="text-slate-900 font-semibold mb-4">Documents</h3>
                <div className="space-y-2">
                  {(currentShipment.uploadedDocuments && Object.keys(currentShipment.uploadedDocuments).length > 0) ? (
                    Object.entries(currentShipment.uploadedDocuments).map(([key, doc], idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm text-slate-900">{doc.name || key}</p>
                            {doc.uploadedAt && <p className="text-xs text-slate-500">Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>}
                          </div>
                        </div>
                        <button
                          onClick={() => setViewingDocument({ ...doc, shipmentId: currentShipment.id })}
                          className="px-3 py-1 rounded-lg text-sm"
                          style={{ background: '#2563EB', color: '#ffffff', border: '2px solid #1E40AF' }}
                        >
                          View
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No documents uploaded</p>
                  )}
                </div>
              </div>
            </div>

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
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-slate-900 mb-4">Shipment Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-600">Shipment ID:</span><span className="text-slate-900">{currentShipment.id}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Status:</span><span className="text-slate-900">{currentShipment.status}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">AI Approval:</span><span className={currentShipment.aiApproval === 'approved' ? 'text-green-600' : 'text-amber-600'}>{currentShipment.aiApproval}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Broker Approval:</span><span className={currentShipment.brokerApproval === 'approved' ? 'text-green-600' : 'text-amber-600'}>{currentShipment.brokerApproval}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Payment Status:</span><span className={currentShipment.paymentStatus === 'completed' ? 'text-green-600' : 'text-amber-600'}>{currentShipment.paymentStatus || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Total Paid:</span><span className="text-slate-900">{formatCurrency(parseFloat(currentShipment.pricing?.total || 0), currentShipment.currency || currency.code)}</span></div>

                <div className="flex justify-between"><span className="text-slate-600">Created:</span><span className="text-slate-900">{currentShipment.createdAt ? new Date(currentShipment.createdAt).toLocaleDateString() : ''}</span></div>
              </div>
            </div>

            {/* Pickup Information */}
            {currentShipment?.pickupType && (
              <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
                <h4 className="text-purple-900 font-semibold mb-3">Pickup Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-purple-600">Pickup Type</p>
                    <p className="text-purple-900">{currentShipment.pickupType || 'N/A'}</p>
                  </div>
                  {currentShipment.pickupType === 'Scheduled Pickup' && (
                    <>
                      <div>
                        <p className="text-purple-600">Location</p>
                        <p className="text-purple-900">{currentShipment.pickupLocation || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-purple-600">Pickup Date</p>
                        <p className="text-purple-900">{currentShipment.pickupDate ? new Date(currentShipment.pickupDate).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-purple-600">Time Window</p>
                        <p className="text-purple-900">{formatTimeWithAmPm(currentShipment.pickupTimeEarliest)} — {formatTimeWithAmPm(currentShipment.pickupTimeLatest)}</p>
                      </div>
                    </>
                  )}
                  {currentShipment.pickupType === 'Drop-off' && (
                    <div>
                      <p className="text-purple-600">Estimated Drop-off Date</p>
                      <p className="text-purple-900">{currentShipment.estimatedDropoffDate ? new Date(currentShipment.estimatedDropoffDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

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

export default ApprovedShipviewpg;
