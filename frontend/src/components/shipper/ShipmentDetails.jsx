import { useState, useEffect } from 'react';
import { 
  Package, 
  MapPin, 
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
  Weight,
  RefreshCw,
  Send,
  Trash2
} from 'lucide-react';
import { useShipments } from '../../hooks/useShipments';
import { ConstraintsValidationWidget } from '../ConstraintsValidationWidget';
import { ShipmentChatPanel } from '../ShipmentChatPanel';
import { shipmentsStore } from '../../store/shipmentsStore';
import { getCurrencyByCountry } from '../../utils/validation';

export function ShipmentDetails({ shipment, onNavigate }) {
  const { updateShipmentStatus, updateAIApproval, requestBrokerApproval, uploadDocument } = useShipments();
  const [currentShipment, setCurrentShipment] = useState(shipment);
  const [chatOpen, setChatOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  // Required documents
  const [documents, setDocuments] = useState([
    { name: 'Commercial Invoice', uploaded: true, required: true },
    { name: 'Packing List', uploaded: true, required: true },
    { name: 'Certificate of Origin', uploaded: false, required: true },
    { name: 'MSDS (if applicable)', uploaded: false, required: false },
    { name: 'Product Images', uploaded: true, required: false }
  ]);

  const handleFileUpload = (docIndex) => {
    setUploading(true);
    setTimeout(() => {
      const updatedDocs = [...documents];
      updatedDocs[docIndex].uploaded = true;
      setDocuments(updatedDocs);
      
      // Update the shipment store
      const doc = updatedDocs[docIndex];
      uploadDocument(currentShipment.id, doc.name, doc.required ? 'required' : 'optional');
      
      setUploading(false);
    }, 1500);
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

  const allRequiredDocsUploaded = documents.filter(d => d.required).every(d => d.uploaded);
  const canRequestAI = allRequiredDocsUploaded && currentShipment.aiApproval !== 'approved';
  const canRequestBroker = currentShipment.aiApproval === 'approved' && 
    (currentShipment.brokerApproval === 'not-started' || !currentShipment.brokerApproval);
  const canGenerateToken = currentShipment.brokerApproval === 'approved';

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
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
          
          {/* Shipment Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-slate-900 mb-4">Shipment Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-500 text-sm mb-1">Product</p>
                <p className="text-slate-900">{currentShipment.productName}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">HS Code</p>
                <p className="text-slate-900">{currentShipment.hsCode}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Origin</p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <p className="text-slate-900">{currentShipment.originCity}, {currentShipment.originCountry}</p>
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Destination</p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <p className="text-slate-900">{currentShipment.destCity}, {currentShipment.destCountry}</p>
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Value</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <p className="text-slate-900">{currency.symbol}{currentShipment.value} {currency.code}</p>
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Weight</p>
                <div className="flex items-center gap-2">
                  <Weight className="w-4 h-4 text-orange-600" />
                  <p className="text-slate-900">{currentShipment.weight} kg</p>
                </div>
              </div>
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
                      </div>
                    </div>
                    {!doc.uploaded && (
                      <button
                        onClick={() => handleFileUpload(index)}
                        disabled={uploading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                      >
                        {uploading ? (
                          <>
                            <Loader className="w-4 h-4 inline mr-1 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 inline mr-1" />
                            Upload
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Upload Required Documents Section - Shows after broker requests */}
            {currentShipment.brokerApproval === 'documents-requested' && allRequiredDocsUploaded && (
              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <h3 className="text-blue-900 mb-3">Documents Uploaded - Next Steps</h3>
                <p className="text-blue-800 text-sm mb-4">
                  All requested documents have been uploaded. Choose an action:
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleReRunAICheck}
                    disabled={aiProcessing}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {aiProcessing ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Run AI Check Again
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleSendBackToBroker}
                    disabled={resubmittingToBroker}
                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {resubmittingToBroker ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send to Broker
                      </>
                    )}
                  </button>
                </div>
                <p className="text-blue-700 text-xs mt-3">
                  ℹ️ Running AI Check will re-validate compliance. Sending to Broker will submit for manual review.
                </p>
              </div>
            )}
          </div>

          {/* AI Evaluation Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                AI Evaluation Status
              </h2>
              {currentShipment.aiApproval === 'approved' && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  AI Approved
                </span>
              )}
            </div>

            {!allRequiredDocsUploaded && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-orange-900 text-sm">
                  Please upload all required documents before requesting AI evaluation.
                </p>
              </div>
            )}

            {allRequiredDocsUploaded && currentShipment.aiApproval !== 'approved' && !aiProcessing && (
              <div>
                <p className="text-slate-600 mb-4">
                  Your documents are ready for AI evaluation. Click below to start the automated compliance check.
                </p>
                <button
                  onClick={handleRequestAIEvaluation}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Request AI Evaluation
                </button>
              </div>
            )}

            {aiProcessing && (
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <Loader className="w-8 h-8 text-blue-600 mx-auto mb-3 animate-spin" />
                <p className="text-blue-900 mb-1">AI Evaluation in Progress</p>
                <p className="text-blue-700 text-sm">Analyzing documents and compliance rules...</p>
              </div>
            )}

            {currentShipment.aiApproval === 'approved' && (
              <div>
                <ConstraintsValidationWidget 
                  shipment={currentShipment}
                  compact={true}
                />
              </div>
            )}
          </div>

          {/* Broker Approval Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-600" />
                Broker Review & Approval
              </h2>
              {currentShipment.brokerApproval === 'approved' && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Broker Approved
                </span>
              )}
              {currentShipment.brokerApproval === 'pending' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Under Review
                </span>
              )}
              {currentShipment.brokerApproval === 'documents-requested' && (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Docs Requested
                </span>
              )}
            </div>

            {currentShipment.aiApproval !== 'approved' && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-slate-600 text-sm">
                  AI approval required before requesting broker review.
                </p>
              </div>
            )}

            {canRequestBroker && !requestingBroker && (
              <div>
                <p className="text-slate-600 mb-4">
                  AI evaluation complete! Request a customs broker to review your shipment documentation.
                </p>
                <button
                  onClick={handleRequestBrokerApproval}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <UserCheck className="w-5 h-5" />
                  Request Broker Approval
                </button>
              </div>
            )}

            {requestingBroker && (
              <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg text-center">
                <Loader className="w-8 h-8 text-purple-600 mx-auto mb-3 animate-spin" />
                <p className="text-purple-900 mb-1">Sending to Broker</p>
                <p className="text-purple-700 text-sm">Your shipment is being assigned to a customs broker...</p>
              </div>
            )}

            {currentShipment.brokerApproval === 'pending' && !requestingBroker && (
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-blue-900 mb-2">Broker Review In Progress</p>
                    <p className="text-blue-700 text-sm mb-3">
                      A customs broker is currently reviewing your shipment documentation. You'll be notified once the review is complete.
                    </p>
                    <button
                      onClick={() => setChatOpen(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      Message the broker →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentShipment.brokerApproval === 'approved' && (
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-green-900 mb-2">Broker Approval Granted</p>
                    <p className="text-green-700 text-sm">
                      Your customs broker has approved this shipment. You can now generate your shipment token.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

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
                      Book Shipment
                    </button>
                    <button
                      onClick={() => onNavigate('payment', currentShipment)}
                      className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <DollarSign className="w-5 h-5" />
                      Make Payment
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
