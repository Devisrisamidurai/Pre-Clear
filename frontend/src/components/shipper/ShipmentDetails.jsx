import { useState, useEffect } from 'react';
import { 
  Package, 
  Calendar, 
  DollarSign, 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Zap, 
  UserCheck, 
  Shield, 
  Clock, 
  ArrowRight,
  MessageCircle,
  Loader,
  TrendingUp,
  Box,
  RefreshCw,
  Send,
  Trash2
} from 'lucide-react';
import { useShipments } from '../../hooks/useShipments';
import { ShipmentChatPanel } from '../ShipmentChatPanel';
import { shipmentsStore } from '../../store/shipmentsStore';
import { getCurrencyByCountry, formatCurrency } from '../../utils/validation';

// Helper function to format time to 12-hour format with AM/PM
const formatTimeWithAmPm = (timeString) => {
  if (!timeString) return 'N/A';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export function ShipmentDetails({ shipment, onNavigate }) {
  const { updateShipmentStatus, updateAIApproval, requestBrokerApproval, uploadDocument } = useShipments();
  const [currentShipment, setCurrentShipment] = useState(shipment);
  const [chatOpen, setChatOpen] = useState(false);
  const [viewingDocument, setViewingDocument] = useState(null);
  const [uploadingDocKey, setUploadingDocKey] = useState(null);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [requestingBroker, setRequestingBroker] = useState(false);
  const [showTokenNotification, setShowTokenNotification] = useState(false);
  const [resubmittingToBroker, setResubmittingToBroker] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  
  // Get currency based on origin country
  const currency = getCurrencyByCountry(currentShipment.originCountry || 'US');
  
  // Refresh shipment data and listen for real-time updates
  useEffect(() => {
    const updatedShipment = shipmentsStore.getShipmentById(shipment.id);
    if (updatedShipment) {
      const wasNotToken = currentShipment.status !== 'token-generated';
      const isNowToken = updatedShipment.status === 'token-generated';
      
      setCurrentShipment(updatedShipment);
      
      // Show notification when token is generated
      if (wasNotToken && isNowToken && updatedShipment.token) {
        setShowTokenNotification(true);
        setTimeout(() => setShowTokenNotification(false), 5000);
      }
    }
  }, [shipment.id]);
  
  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = shipmentsStore.subscribe(() => {
      const updatedShipment = shipmentsStore.getShipmentById(shipment.id);
      if (updatedShipment) {
        const wasNotToken = currentShipment.status !== 'token-generated';
        const isNowToken = updatedShipment.status === 'token-generated';
        
        setCurrentShipment(updatedShipment);
        
        // Show notification when token is generated
        if (wasNotToken && isNowToken && updatedShipment.token) {
          setShowTokenNotification(true);
          setTimeout(() => setShowTokenNotification(false), 5000);
        }
      }
    });
    
    return () => unsubscribe();
  }, [shipment.id, currentShipment.status]);

  // Required documents - map from shipment.documents selected
  const [documents, setDocuments] = useState(() => {
    const shipmentDocs = currentShipment?.documents || {};
    const uploadedDocs = currentShipment?.uploadedDocuments || {};
    const documentsList = [
      { name: 'Commercial Invoice', key: 'commercialInvoice', uploaded: uploadedDocs.commercialInvoice?.uploaded || false, fileName: uploadedDocs.commercialInvoice?.name || '', required: true },
      { name: 'Packing List', key: 'packingList', uploaded: uploadedDocs.packingList?.uploaded || false, fileName: uploadedDocs.packingList?.name || '', required: true },
      { name: 'Certificate of Origin', key: 'certificateOfOrigin', uploaded: uploadedDocs.certificateOfOrigin?.uploaded || false, fileName: uploadedDocs.certificateOfOrigin?.name || '', required: false },
      { name: 'Export License', key: 'exportLicense', uploaded: uploadedDocs.exportLicense?.uploaded || false, fileName: uploadedDocs.exportLicense?.name || '', required: false },
      { name: 'Import License', key: 'importLicense', uploaded: uploadedDocs.importLicense?.uploaded || false, fileName: uploadedDocs.importLicense?.name || '', required: false },
      { name: 'Safety Data Sheet (SDS)', key: 'sds', uploaded: uploadedDocs.sds?.uploaded || false, fileName: uploadedDocs.sds?.name || '', required: false },
      { name: 'Airway Bill (AWB)', key: 'awb', uploaded: uploadedDocs.awb?.uploaded || false, fileName: uploadedDocs.awb?.name || '', required: false },
      { name: 'Bill of Lading (BOL)', key: 'bol', uploaded: uploadedDocs.bol?.uploaded || false, fileName: uploadedDocs.bol?.name || '', required: false },
      { name: 'CMR (International Road Transport)', key: 'cmr', uploaded: uploadedDocs.cmr?.uploaded || false, fileName: uploadedDocs.cmr?.name || '', required: false },
    ];
    // Filter to show only selected documents
    return documentsList.filter(d => shipmentDocs[d.key]);
  });

  // Handle file selection and upload for a document
  const handleFileSelect = (docIndex, e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const docKey = documents[docIndex].key;
    setUploadingDocKey(docKey);

    // Simulate upload time and then persist uploaded metadata to the shipment
    setTimeout(() => {
      const updatedDocs = [...documents];
      updatedDocs[docIndex].uploaded = true;
      updatedDocs[docIndex].fileName = file.name;
      setDocuments(updatedDocs);

      // Persist uploaded document metadata into the shipment object
      const shipmentFromStore = shipmentsStore.getShipmentById(currentShipment.id) || { ...currentShipment };
      shipmentFromStore.uploadedDocuments = shipmentFromStore.uploadedDocuments || {};
      shipmentFromStore.uploadedDocuments[docKey] = {
        uploaded: true,
        name: file.name,
        uploadedAt: new Date().toISOString()
      };

      // Also mark the original documents object (if it was an object of flags) for backward compatibility
      if (shipmentFromStore.documents && typeof shipmentFromStore.documents === 'object' && !Array.isArray(shipmentFromStore.documents)) {
        shipmentFromStore.documents[docKey] = true;
      }

      shipmentsStore.saveShipment(shipmentFromStore);
      const refreshed = shipmentsStore.getShipmentById(currentShipment.id) || shipmentFromStore;
      setCurrentShipment(refreshed);
      setUploadingDocKey(null);
    }, 1500);
  };

  // Delete an uploaded document (remove metadata from shipment and UI)
  const handleDeleteDocument = (docIndex) => {
    const doc = documents[docIndex];
    if (!doc) return;

    // Update UI
    const updatedDocs = [...documents];
    updatedDocs[docIndex].uploaded = false;
    updatedDocs[docIndex].fileName = '';
    setDocuments(updatedDocs);

    // Remove from store
    const shipmentFromStore = shipmentsStore.getShipmentById(currentShipment.id) || { ...currentShipment };
    shipmentFromStore.uploadedDocuments = shipmentFromStore.uploadedDocuments || {};
    const docKey = doc.key;
    if (shipmentFromStore.uploadedDocuments[docKey]) {
      delete shipmentFromStore.uploadedDocuments[docKey];
    }

    // Keep documents flag for backward compatibility as false
    if (shipmentFromStore.documents && typeof shipmentFromStore.documents === 'object') {
      shipmentFromStore.documents[docKey] = false;
    }

    shipmentsStore.saveShipment(shipmentFromStore);
    const refreshed = shipmentsStore.getShipmentById(currentShipment.id) || shipmentFromStore;
    setCurrentShipment(refreshed);
  };

  const handleReRunAICheck = () => {
    setAiProcessing(true);
    setTimeout(() => {
      updateAIApproval(currentShipment.id, 'approved');
      const updated = shipmentsStore.getShipmentById(currentShipment.id);
      setCurrentShipment(updated);
      setAiProcessing(false);
    }, 3000);
  };

  const handleSendBackToBroker = () => {
    setResubmittingToBroker(true);
    setTimeout(() => {
      // Update status to awaiting broker after docs are uploaded
      updateShipmentStatus(currentShipment.id, 'awaiting-broker');
      requestBrokerApproval(currentShipment.id);
      const updated = shipmentsStore.getShipmentById(currentShipment.id);
      if (updated) {
        setCurrentShipment(updated);
      }
      setResubmittingToBroker(false);
    }, 2000);
  };

  const handleRequestAIEvaluation = () => {
    setAiProcessing(true);
    setTimeout(() => {
      updateAIApproval(currentShipment.id, 'approved');
      const updated = shipmentsStore.getShipmentById(currentShipment.id);
      setCurrentShipment(updated);
      setAiProcessing(false);
    }, 3000);
  };

  const handleRequestBrokerApproval = () => {
    setRequestingBroker(true);
    setTimeout(() => {
      requestBrokerApproval(currentShipment.id);
      const updated = shipmentsStore.getShipmentById(currentShipment.id);
      if (updated) {
        setCurrentShipment(updated);
      }
      setRequestingBroker(false);
    }, 2000);
  };

  const handleGenerateToken = () => {
    updateShipmentStatus(currentShipment.id, 'token-generated');
    const updated = shipmentsStore.getShipmentById(currentShipment.id);
    setCurrentShipment(updated);
  };

  const handleCancelShipment = () => {
    const updatedShipment = { ...currentShipment, status: 'cancelled' };
    shipmentsStore.saveShipment(updatedShipment);
    setShowCancelConfirm(false);
    onNavigate('dashboard');
  };

  const handleViewDocument = (docName) => {
    setViewingDocument({
      name: docName,
      message: `Viewing document: ${docName}`
    });
  };

  const allRequiredDocsUploaded = documents.filter(d => d.required).every(d => d.uploaded);
  const canRequestAI = allRequiredDocsUploaded && currentShipment.aiApproval !== 'approved';
  const canRequestBroker = currentShipment.aiApproval === 'approved' && 
    (currentShipment.brokerApproval === 'not-started' || !currentShipment.brokerApproval);
  const canGenerateToken = currentShipment.brokerApproval === 'approved';

  // Keep documents in sync if shipment updates (e.g., after upload)
  useEffect(() => {
    const shipmentDocs = currentShipment?.documents || {};
    const uploadedDocs = currentShipment?.uploadedDocuments || {};
    const documentsList = [
      { name: 'Commercial Invoice', key: 'commercialInvoice', uploaded: uploadedDocs.commercialInvoice?.uploaded || false, fileName: uploadedDocs.commercialInvoice?.name || '', required: true },
      { name: 'Packing List', key: 'packingList', uploaded: uploadedDocs.packingList?.uploaded || false, fileName: uploadedDocs.packingList?.name || '', required: true },
      { name: 'Certificate of Origin', key: 'certificateOfOrigin', uploaded: uploadedDocs.certificateOfOrigin?.uploaded || false, fileName: uploadedDocs.certificateOfOrigin?.name || '', required: false },
      { name: 'Export License', key: 'exportLicense', uploaded: uploadedDocs.exportLicense?.uploaded || false, fileName: uploadedDocs.exportLicense?.name || '', required: false },
      { name: 'Import License', key: 'importLicense', uploaded: uploadedDocs.importLicense?.uploaded || false, fileName: uploadedDocs.importLicense?.name || '', required: false },
      { name: 'Safety Data Sheet (SDS)', key: 'sds', uploaded: uploadedDocs.sds?.uploaded || false, fileName: uploadedDocs.sds?.name || '', required: false },
      { name: 'Airway Bill (AWB)', key: 'awb', uploaded: uploadedDocs.awb?.uploaded || false, fileName: uploadedDocs.awb?.name || '', required: false },
      { name: 'Bill of Lading (BOL)', key: 'bol', uploaded: uploadedDocs.bol?.uploaded || false, fileName: uploadedDocs.bol?.name || '', required: false },
      { name: 'CMR (International Road Transport)', key: 'cmr', uploaded: uploadedDocs.cmr?.uploaded || false, fileName: uploadedDocs.cmr?.name || '', required: false },
    ];
    setDocuments(documentsList.filter(d => shipmentDocs[d.key]));
  }, [currentShipment]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-slate-900 mb-2">Shipment Details</h1>
            <p className="text-slate-600">Complete shipment ID: {currentShipment.id}</p>
          </div>
          <button
            onClick={() => setChatOpen(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Chat with Broker
          </button>
        </div>
      </div>

      {/* Workflow Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-slate-900 mb-6">Workflow Progress</h2>
        <div className="flex items-center gap-4">
          {/* Step 1: Documents */}
          <div className="flex-1">
            <div className={`w-full h-2 rounded-full ${allRequiredDocsUploaded ? 'bg-green-500' : 'bg-orange-500'}`} />
            <p className="text-sm text-slate-600 mt-2">Documents Upload</p>
            <p className="text-xs text-slate-500">{allRequiredDocsUploaded ? 'Complete' : 'Pending'}</p>
          </div>
          
          {/* Step 2: AI Approval */}
          <div className="flex-1">
            <div className={`w-full h-2 rounded-full ${
              currentShipment.aiApproval === 'approved' ? 'bg-green-500' : 
              aiProcessing ? 'bg-blue-500' : 'bg-slate-200'
            }`} />
            <p className="text-sm text-slate-600 mt-2">AI Evaluation</p>
            <p className="text-xs text-slate-500">
              {currentShipment.aiApproval === 'approved' ? 'Approved' : aiProcessing ? 'Processing...' : 'Not Started'}
            </p>
          </div>
          
          {/* Step 3: Broker Approval */}
          <div className="flex-1">
            <div className={`w-full h-2 rounded-full ${
              currentShipment.brokerApproval === 'approved' ? 'bg-green-500' : 
              currentShipment.brokerApproval === 'pending' ? 'bg-blue-500' : 
              currentShipment.brokerApproval === 'documents-requested' ? 'bg-red-500' :
              'bg-slate-200'
            }`} />
            <p className="text-sm text-slate-600 mt-2">Broker Review</p>
            <p className="text-xs text-slate-500">
              {currentShipment.brokerApproval === 'approved' ? 'Approved' : 
               currentShipment.brokerApproval === 'pending' ? 'In Review' :
               currentShipment.brokerApproval === 'documents-requested' ? 'Docs Needed' :
               'Not Started'}
            </p>
          </div>
          
          {/* Step 4: Token */}
          <div className="flex-1">
            <div className={`w-full h-2 rounded-full ${
              currentShipment.status === 'token-generated' ? 'bg-green-500' : 'bg-slate-200'
            }`} />
            <p className="text-sm text-slate-600 mt-2">Token Generated</p>
            <p className="text-xs text-slate-500">
              {currentShipment.status === 'token-generated' ? 'Complete' : 'Pending'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Workflow */}
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
                  <p className="text-slate-900">{currentShipment.currency || currency.code}</p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm mb-1">Pickup</p>
                  <p className="text-slate-900">{currentShipment.pickupType || 'N/A'}</p>
                  {currentShipment.pickupType === 'Drop-off' && currentShipment.estimatedDropoffDate && (
                    <p className="text-xs text-slate-500 mt-1">Estimated Drop-off: {new Date(currentShipment.estimatedDropoffDate).toLocaleDateString()}</p>
                  )}
                  {currentShipment.pickupType === 'Scheduled Pickup' && (
                    <div className="text-xs text-slate-500 mt-1">
                      {currentShipment.pickupLocation && <div>Location: {currentShipment.pickupLocation}</div>}
                      {currentShipment.pickupDate && <div>Pickup Date: {new Date(currentShipment.pickupDate).toLocaleDateString()}</div>}
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
                  <p className="text-slate-500 text-sm mb-1">Email</p>
                  <p className="text-slate-900">{currentShipment.shipper?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">Phone</p>
                  <p className="text-slate-900">{currentShipment.shipper?.phone || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-500 text-sm mb-1">Address</p>
                  <p className="text-slate-900">
                    {currentShipment.shipper?.address1}{currentShipment.shipper?.address2 ? ` ${currentShipment.shipper.address2}` : ''}, {currentShipment.shipper?.city}, {currentShipment.shipper?.state} {currentShipment.shipper?.postalCode}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">Country</p>
                  <p className="text-slate-900">{currentShipment.shipper?.country || 'N/A'}</p>
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
                  <p className="text-slate-500 text-sm mb-1">Email</p>
                  <p className="text-slate-900">{currentShipment.consignee?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">Phone</p>
                  <p className="text-slate-900">{currentShipment.consignee?.phone || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-500 text-sm mb-1">Address</p>
                  <p className="text-slate-900">
                    {currentShipment.consignee?.address1}{currentShipment.consignee?.address2 ? ` ${currentShipment.consignee.address2}` : ''}, {currentShipment.consignee?.city}, {currentShipment.consignee?.state} {currentShipment.consignee?.postalCode}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">Country</p>
                  <p className="text-slate-900">{currentShipment.consignee?.country || 'N/A'}</p>
                </div>
                
              </div>
            </div>

            {/* Packages & Products Section */}
            <div className="mb-8 pb-6 border-b border-slate-200">
              <h3 className="text-slate-900 font-semibold mb-4">Packages & Products</h3>
              {currentShipment.packages && currentShipment.packages.length > 0 ? (
                <div className="space-y-6">
                  {currentShipment.packages.map((pkg, pkgIdx) => (
                    <div key={pkgIdx} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                      <h4 className="text-slate-900 font-medium mb-4">Package {pkgIdx + 1}</h4>
                      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-200">
                        <div>
                          <p className="text-slate-500 text-sm mb-1">Type</p>
                          <p className="text-slate-900">{pkg.type || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm mb-1">Dimensions</p>
                          <p className="text-slate-900">{pkg.length} x {pkg.width} x {pkg.height} {pkg.dimUnit || 'cm'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm mb-1">Weight</p>
                          <p className="text-slate-900">{pkg.weight} {pkg.weightUnit || 'kg'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm mb-1">Stackable</p>
                          <p className="text-slate-900">{pkg.stackable ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                      
                      {/* Products in Package */}
                      {pkg.products && pkg.products.length > 0 && (
                        <div>
                          <h5 className="text-slate-900 font-medium text-sm mb-3">Products</h5>
                          <div className="space-y-3">
                            {pkg.products.map((product, prodIdx) => (
                              <div key={prodIdx} className="bg-white p-3 rounded border border-slate-200">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-slate-500 text-xs mb-1">Name</p>
                                    <p className="text-slate-900 text-sm">{product.name || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-slate-500 text-xs mb-1">HS Code</p>
                                    <p className="text-slate-900 text-sm">{product.hsCode || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-slate-500 text-xs mb-1">Category</p>
                                    <p className="text-slate-900 text-sm">{product.category || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-slate-500 text-xs mb-1">UOM</p>
                                    <p className="text-slate-900 text-sm">{product.uom || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-slate-500 text-xs mb-1">Quantity</p>
                                    <p className="text-slate-900 text-sm">{product.qty || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-slate-500 text-xs mb-1">Unit Price</p>
                                    <p className="text-slate-900 text-sm">{product.unitPrice || 'N/A'}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-slate-500 text-xs mb-1">Total Value</p>
                                    <p className="text-slate-900 text-sm">{formatCurrency(product.totalValue || 0, currentShipment.currency || currency.code)}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-slate-500 text-xs mb-1">Description</p>
                                    <p className="text-slate-900 text-sm">{product.description || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-slate-500 text-xs mb-1">Origin Country</p>
                                    <p className="text-slate-900 text-sm">{product.originCountry || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-slate-500 text-xs mb-1">Reason for Export</p>
                                    <p className="text-slate-900 text-sm">{product.reasonForExport || 'N/A'}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600">No packages available</p>
              )}
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-900">Upload Documents</h2>
              {allRequiredDocsUploaded && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  All Required Uploaded
                </span>
              )}
            </div>
            
            {currentShipment.brokerApproval === 'documents-requested' && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-900 mb-1">Additional Documents Requested</p>
                    <p className="text-red-700 text-sm mb-2">
                      The broker has requested additional documentation. Please upload the missing documents below.
                    </p>
                    {currentShipment.brokerNotes && (
                      <p className="text-red-800 text-sm italic border-l-2 border-red-400 pl-3 mt-2">
                        Broker note: {currentShipment.brokerNotes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    doc.uploaded ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {doc.uploaded ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-slate-400" />
                      )}
                      <div>
                        <span className="text-slate-900">{doc.name}</span>
                        {doc.required && !doc.uploaded && (
                          <span className="ml-2 text-xs text-red-600">* Required</span>
                        )}
                        {doc.uploaded && (
                          <p className="text-xs text-slate-500 mt-1">Uploaded: {doc.fileName}</p>
                        )}
                      </div>
                    </div>
                    {/* Hidden file input (used for both upload and re-upload) */}
                    <input
                      id={`file-input-${doc.key}`}
                      type="file"
                      accept="application/pdf,image/*"
                      className="hidden"
                      onChange={(e) => handleFileSelect(index, e)}
                    />

                    {!doc.uploaded ? (
                      <button
                        onClick={() => document.getElementById(`file-input-${doc.key}`).click()}
                        disabled={uploadingDocKey === doc.key}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 flex items-center gap-2"
                      >
                        {uploadingDocKey === doc.key ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Upload Document
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewingDocument({ name: doc.fileName || doc.name || doc.key, key: doc.key, shipmentId: currentShipment.id, source: 'form' })}
                          className="px-3 py-2 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => document.getElementById(`file-input-${doc.key}`).click()}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Re-upload
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(index)}
                          className="p-2 text-red-600 rounded hover:bg-red-50 transition-colors"
                          aria-label={`Delete ${doc.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Chat & Form Uploaded Documents Section */}
              {currentShipment.uploadedDocuments && Object.keys(currentShipment.uploadedDocuments).length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  {/* Separate form documents from chat documents */}
                  {(() => {
                    const formDocs = Object.entries(currentShipment.uploadedDocuments).filter(([_, doc]) => doc.source === 'form');
                    const chatDocs = Object.entries(currentShipment.uploadedDocuments).filter(([_, doc]) => !doc.source || doc.source !== 'form');
                    
                    return (
                      <>
                        {/* Form Uploaded Documents */}
                        {formDocs.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-slate-900 font-semibold mb-4">Documents from Shipment Form</h3>
                            <div className="space-y-3">
                              {formDocs.map(([key, doc]) => (
                                <div key={key} className="p-4 rounded-lg border-2 bg-green-50 border-green-200">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <CheckCircle className="w-5 h-5 text-green-600" />
                                      <div>
                                        <span className="text-slate-900">{doc.name || key}</span>
                                        {doc.fileName && (
                                          <p className="text-xs text-slate-500 mt-1">File: {doc.fileName}</p>
                                        )}
                                        {doc.uploadedAt && (
                                          <p className="text-xs text-slate-500 mt-1">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()} {new Date(doc.uploadedAt).toLocaleTimeString()}</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleViewDocument(doc.name || key)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                                      >
                                        View
                                      </button>
                                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Form</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Chat Uploaded Documents */}
                        {chatDocs.length > 0 && (
                          <div>
                            <h3 className="text-slate-900 font-semibold mb-4">Documents from Chat</h3>
                            <div className="space-y-3">
                              {chatDocs.map(([key, doc]) => (
                                <div key={key} className="p-4 rounded-lg border-2 bg-purple-50 border-purple-200">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <CheckCircle className="w-5 h-5 text-purple-600" />
                                      <div>
                                        <span className="text-slate-900">{doc.name || key}</span>
                                        {doc.uploadedAt && (
                                          <p className="text-xs text-slate-500 mt-1">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()} {new Date(doc.uploadedAt).toLocaleTimeString()}</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleViewDocument(doc.name || key)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                                      >
                                        View
                                      </button>
                                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Chat</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
            
            
          </div>

          {/* AI Evaluation Section - Improved Design */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-slate-900 font-bold text-lg">AI Compliance Evaluation</h2>
                  <p className="text-slate-600 text-sm">Automated customs clearance analysis</p>
                </div>
              </div>
              {currentShipment.aiApproval === 'approved' && (
                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  ✓ APPROVED
                </div>
              )}
            </div>

            {!allRequiredDocsUploaded && (
              <div className="p-4 bg-amber-100 border border-amber-300 rounded-lg">
                <p className="text-amber-900 text-sm font-medium">
                  ⚠️ Upload all required documents to proceed with AI evaluation
                </p>
              </div>
            )}

            {allRequiredDocsUploaded && currentShipment.aiApproval !== 'approved' && !aiProcessing && (
              <div className="space-y-4">
                <p className="text-slate-700">
                  Your documents are ready. Let our AI analyze compliance rules and regulations for your shipment.
                </p>
                <button
                  onClick={handleRequestAIEvaluation}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Zap className="w-5 h-5" />
                  Start AI Evaluation
                </button>
              </div>
            )}

            {aiProcessing && (
              <div className="p-6 bg-white rounded-lg border border-blue-200 text-center space-y-3">
                <div className="flex justify-center">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 bg-blue-200 rounded-full animate-pulse"></div>
                    <Loader className="w-12 h-12 text-blue-600 animate-spin relative" />
                  </div>
                </div>
                <p className="text-blue-900 font-bold">AI Evaluation in Progress</p>
                <p className="text-blue-700 text-sm">Analyzing documents against compliance rules...</p>
              </div>
            )}

            {currentShipment.aiApproval === 'approved' && (
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border-2 border-green-300">
                  <p className="text-green-700 font-bold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    ✓ All compliance checks passed
                  </p>
                  <p className="text-slate-600 text-sm mt-2">
                    Your shipment meets all customs regulations and is approved for broker review.
                  </p>
                </div>
                {/* ConstraintsValidationWidget removed as per UI requirements */}
              </div>
            )}
          </div>

          {/* Broker Approval Section - Only available after AI approval */}
          {currentShipment.aiApproval === 'approved' && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-600 rounded-lg">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-slate-900 font-bold text-lg">Broker Review & Approval</h2>
                    <p className="text-slate-600 text-sm">Get professional customs broker assistance</p>
                  </div>
                </div>
                {currentShipment.brokerApproval === 'approved' && (
                  <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    ✓ APPROVED
                  </div>
                )}
                {currentShipment.brokerApproval === 'pending' && (
                  <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    IN REVIEW
                  </div>
                )}
              </div>

              {canRequestBroker && !requestingBroker && (
                <div className="space-y-4">
                  <p className="text-slate-700">
                    AI evaluation passed! Submit your shipment to a professional customs broker for final review and approval.
                  </p>
                  <button
                    onClick={handleRequestBrokerApproval}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 font-bold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <UserCheck className="w-5 h-5" />
                    Request Broker Review
                  </button>
                </div>
              )}

              {requestingBroker && (
                <div className="p-6 bg-white rounded-lg border border-purple-200 text-center space-y-3">
                  <div className="flex justify-center">
                    <Loader className="w-8 h-8 text-purple-600 animate-spin" />
                  </div>
                  <p className="text-purple-900 font-bold">Sending to Broker</p>
                  <p className="text-purple-700 text-sm">Your shipment is being assigned to a customs broker...</p>
                </div>
              )}

              {currentShipment.brokerApproval === 'pending' && !requestingBroker && (
                <div className="p-4 bg-white rounded-lg border-l-4 border-blue-500">
                  <p className="text-blue-900 font-medium">📋 Under Review by Broker</p>
                  <p className="text-blue-700 text-sm mt-2">A customs broker is reviewing your documentation. You'll be notified once review is complete.</p>
                </div>
              )}

              {currentShipment.brokerApproval === 'approved' && (
                <div className="p-4 bg-green-100 rounded-lg border-2 border-green-400">
                  <p className="text-green-700 font-bold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    ✓ Broker Approved - Ready for Booking
                  </p>
                  <p className="text-green-700 text-sm mt-2">All approvals complete. You can now proceed with shipment booking.</p>
                </div>
              )}
            </div>
          )}

          {/* Token Generation Section */}
          {canGenerateToken && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-slate-900 flex items-center gap-2 mb-2">
                    <Shield className="w-6 h-6 text-green-600" />
                    Generate Shipment Token
                  </h2>
                  <p className="text-slate-600 text-sm">
                    All approvals complete! Generate your unique shipment token to proceed with booking.
                  </p>
                </div>
              </div>
              
              {currentShipment.status !== 'token-generated' ? (
                <button
                  onClick={handleGenerateToken}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-lg flex items-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Generate Token
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-green-300">
                    <p className="text-slate-600 text-sm mb-2">Your Shipment Token</p>
                    <p className="text-2xl text-green-700 font-mono tracking-wider">
                      {currentShipment.token || 'UPS-' + currentShipment.id.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => onNavigate('booking', currentShipment)}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Box className="w-5 h-5" />
                      Book & Pay
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Status Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-slate-900 mb-4">Status Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-600 text-sm">Documents</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  allRequiredDocsUploaded ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {allRequiredDocsUploaded ? 'Complete' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-600 text-sm">AI Evaluation</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  currentShipment.aiApproval === 'approved' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {currentShipment.aiApproval === 'approved' ? 'Approved' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-600 text-sm">Broker Review</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  currentShipment.brokerApproval === 'approved' ? 'bg-green-100 text-green-700' : 
                  currentShipment.brokerApproval === 'pending' ? 'bg-blue-100 text-blue-700' :
                  currentShipment.brokerApproval === 'documents-requested' ? 'bg-red-100 text-red-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {currentShipment.brokerApproval === 'approved' ? 'Approved' : 
                   currentShipment.brokerApproval === 'pending' ? 'In Review' :
                   currentShipment.brokerApproval === 'documents-requested' ? 'Docs Needed' :
                   'Not Started'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-sm">Token Status</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  currentShipment.status === 'token-generated' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {currentShipment.status === 'token-generated' ? 'Generated' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setChatOpen(true)}
                className="w-full px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-between group"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat with Broker
                </span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full px-4 py-3 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-between group"
              >
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  View All Shipments
                </span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              {currentShipment.status !== 'cancelled' && currentShipment.status !== 'token-generated' && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Cancel Shipment
                  </span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-slate-900 mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-slate-900 text-sm">Shipment Created</p>
                  <p className="text-slate-500 text-xs">{currentShipment.date}</p>
                </div>
              </div>
              {allRequiredDocsUploaded && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-slate-900 text-sm">Documents Uploaded</p>
                    <p className="text-slate-500 text-xs">All required documents</p>
                  </div>
                </div>
              )}
              {currentShipment.aiApproval === 'approved' && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-slate-900 text-sm">AI Approved</p>
                    <p className="text-slate-500 text-xs">Compliance verified</p>
                  </div>
                </div>
              )}
              {currentShipment.brokerApproval === 'approved' && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-slate-900 text-sm">Broker Approved</p>
                    <p className="text-slate-500 text-xs">Ready for token</p>
                  </div>
                </div>
              )}
              {currentShipment.status === 'token-generated' && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-slate-900 text-sm">Token Generated</p>
                    <p className="text-slate-500 text-xs">Ready to book</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      <ShipmentChatPanel
        shipmentId={currentShipment.id}
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        userRole="shipper"
        userName="ABC Exports"
      />

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900 text-lg font-semibold">{viewingDocument.name}</h3>
              <button onClick={() => setViewingDocument(null)} className="text-slate-500 hover:text-slate-700 text-2xl">✕</button>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <p className="text-slate-600">{viewingDocument.message || `Document: ${viewingDocument.name}`}</p>
              <p className="text-slate-500 text-sm mt-2">In production, the file would be displayed here (PDF viewer, image preview, etc.)</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setViewingDocument(null)} className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-slate-900 mb-2">Cancel Shipment?</h3>
                <p className="text-slate-600 text-sm">
                  Are you sure you want to cancel this shipment? This action cannot be undone.
                </p>
                <p className="text-slate-600 text-sm mt-2">
                  Shipment ID: <span className="text-slate-900">{currentShipment.id}</span>
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                No, Keep It
              </button>
              <button
                onClick={handleCancelShipment}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}