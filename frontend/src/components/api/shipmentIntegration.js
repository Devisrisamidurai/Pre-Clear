/**
 * API Integration Examples for ShipmentForm
 * These are sample implementations showing how to connect the form to your backend
 */

// ============================================================================
// 1. FORM SUBMISSION - Save Shipment to Backend
// ============================================================================

// In ShipmentForm.jsx, update the handleSubmit function:

const handleSubmit = async () => {
  if (!validateForm()) {
    alert('Please fill in all required fields');
    return;
  }

  try {
    // Show loading state
    setLoading(true);

    const updatedShipment = {
      ...formData,
      updatedAt: new Date().toISOString(),
      lastModifiedBy: 'shipper-1'
    };

    // Save to local store (offline support)
    shipmentsStore.saveShipment(updatedShipment);

    // ========== API CALL ==========
    let response;
    
    if (formData.id) {
      // UPDATE existing shipment
      response = await fetch(`/api/shipments/${formData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedShipment)
      });
    } else {
      // CREATE new shipment
      response = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedShipment)
      });
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Update local store with API response (includes generated ID, timestamps)
    shipmentsStore.saveShipment(result.data);

    // Show success message
    toast.success(formData.id ? 'Shipment updated successfully' : 'Shipment created successfully');

    // Navigate based on status
    if (formData.status === 'token-generated') {
      onNavigate('booking', result.data);
    } else {
      // Trigger AI compliance check
      await triggerAICheck(result.data.id);
      onNavigate('ai-evaluation', result.data);
    }

  } catch (error) {
    console.error('Error submitting form:', error);
    toast.error(error.message || 'Failed to save shipment');
  } finally {
    setLoading(false);
  }
};

// ============================================================================
// 2. AI COMPLIANCE CHECK
// ============================================================================

const triggerAICheck = async (shipmentId) => {
  try {
    const response = await fetch(`/api/shipments/${shipmentId}/ai-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        shipmentId: shipmentId,
        // Optional: pass specific items to check
        checkType: 'full' // or 'quick'
      })
    });

    if (!response.ok) throw new Error('AI check failed');

    const result = await response.json();

    // Update shipment with AI results
    const shipment = shipmentsStore.getShipmentById(shipmentId);
    shipment.aiComplianceScore = result.aiComplianceScore;
    shipment.aiComplianceStatus = result.aiComplianceStatus; // 'cleared', 'flagged', 'denied'
    shipment.aiValidationNotes = result.aiValidationNotes;
    shipment.missingDocuments = result.missingDocuments || [];
    shipment.suggestedHsCode = result.suggestedHsCode;
    shipment.estimatedDutyTax = result.estimatedDutyTax;
    shipment.riskLevel = result.riskLevel; // 'low', 'medium', 'high', 'critical'
    shipment.status = result.aiComplianceStatus === 'cleared' ? 'ai-approved' : 'flagged';

    shipmentsStore.saveShipment(shipment);

    return result;
  } catch (error) {
    console.error('AI check error:', error);
    toast.error('AI compliance check failed');
    throw error;
  }
};

// ============================================================================
// 3. REQUEST BROKER APPROVAL
// ============================================================================

const requestBrokerApproval = async (shipmentId, notes = '') => {
  try {
    const response = await fetch(`/api/shipments/${shipmentId}/request-broker`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        shipmentId,
        notes,
        requestedAt: new Date().toISOString()
      })
    });

    if (!response.ok) throw new Error('Failed to request broker approval');

    const result = await response.json();

    const shipment = shipmentsStore.getShipmentById(shipmentId);
    shipment.status = 'awaiting-broker';
    shipment.brokerReviewStatus = 'pending';

    shipmentsStore.saveShipment(shipment);

    toast.success('Broker approval requested');
    return result;
  } catch (error) {
    console.error('Error requesting broker approval:', error);
    toast.error(error.message);
    throw error;
  }
};

// ============================================================================
// 4. BROKER REVIEW & APPROVAL/REJECTION
// ============================================================================

// Broker approves shipment
const brokerApprove = async (shipmentId, brokerNotes = '') => {
  try {
    const response = await fetch(`/api/shipments/${shipmentId}/broker-approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${brokerToken}`
      },
      body: JSON.stringify({
        shipmentId,
        brokerNotes,
        approvedAt: new Date().toISOString()
      })
    });

    if (!response.ok) throw new Error('Failed to approve shipment');

    const result = await response.json();

    const shipment = shipmentsStore.getShipmentById(shipmentId);
    shipment.brokerReviewStatus = 'approved';
    shipment.brokerComments = brokerNotes;
    shipment.brokerReviewedAt = new Date().toISOString();
    shipment.token = result.token; // Generated by backend
    shipment.tokenGeneratedAt = result.tokenGeneratedAt;
    shipment.status = 'token-generated';

    shipmentsStore.saveShipment(shipment);

    toast.success('Shipment approved! Token generated.');
    return result;
  } catch (error) {
    console.error('Error approving shipment:', error);
    toast.error(error.message);
    throw error;
  }
};

// Broker requests additional documents
const brokerRequestDocuments = async (shipmentId, requestedDocs, reason) => {
  try {
    const response = await fetch(`/api/shipments/${shipmentId}/request-documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${brokerToken}`
      },
      body: JSON.stringify({
        shipmentId,
        requestedDocuments: requestedDocs, // Array of doc names
        reason,
        requestedAt: new Date().toISOString()
      })
    });

    if (!response.ok) throw new Error('Failed to request documents');

    const result = await response.json();

    const shipment = shipmentsStore.getShipmentById(shipmentId);
    shipment.brokerReviewStatus = 'documents-requested';
    shipment.brokerRequestedDocs = requestedDocs;
    shipment.brokerComments = reason;
    shipment.status = 'document-requested';

    shipmentsStore.saveShipment(shipment);

    toast.success('Document request sent to shipper');
    return result;
  } catch (error) {
    console.error('Error requesting documents:', error);
    toast.error(error.message);
    throw error;
  }
};

// ============================================================================
// 5. SHIPMENT BOOKING
// ============================================================================

const bookShipment = async (shipmentId, bookingData) => {
  try {
    const response = await fetch(`/api/shipments/${shipmentId}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        shipmentId,
        carrier: bookingData.carrier,
        deliverySpeed: bookingData.deliverySpeed,
        pricing: bookingData.pricing,
        bookedAt: new Date().toISOString()
      })
    });

    if (!response.ok) throw new Error('Failed to book shipment');

    const result = await response.json();

    const shipment = shipmentsStore.getShipmentById(shipmentId);
    shipment.bookingStatus = 'booked';
    shipment.status = 'booked';
    shipment.carrier = bookingData.carrier;
    shipment.trackingNumber = result.trackingNumber;
    shipment.estimatedDelivery = result.estimatedDelivery;

    shipmentsStore.saveShipment(shipment);

    toast.success('Shipment booked successfully!');
    onNavigate('payment', shipment);
    return result;
  } catch (error) {
    console.error('Error booking shipment:', error);
    toast.error(error.message);
    throw error;
  }
};

// ============================================================================
// 6. PAYMENT PROCESSING
// ============================================================================

const processPayment = async (shipmentId, paymentData) => {
  try {
    const response = await fetch(`/api/shipments/${shipmentId}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        shipmentId,
        amount: paymentData.amount,
        method: paymentData.method, // 'credit-card', 'bank-transfer', etc.
        reference: paymentData.reference,
        paidAt: new Date().toISOString()
      })
    });

    if (!response.ok) throw new Error('Payment processing failed');

    const result = await response.json();

    const shipment = shipmentsStore.getShipmentById(shipmentId);
    shipment.paymentStatus = 'paid';
    shipment.paymentMethod = paymentData.method;
    shipment.status = 'payment-completed';

    shipmentsStore.saveShipment(shipment);

    toast.success('Payment successful! Shipment ready to ship.');
    onNavigate('shipment-token', shipment);
    return result;
  } catch (error) {
    console.error('Payment error:', error);
    toast.error(error.message);
    throw error;
  }
};

// ============================================================================
// 7. DOCUMENT UPLOAD
// ============================================================================

const uploadDocument = async (shipmentId, file, docType) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);
    formData.append('shipmentId', shipmentId);

    const response = await fetch(`/api/shipments/${shipmentId}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type - browser will set it with boundary
      },
      body: formData
    });

    if (!response.ok) throw new Error('Document upload failed');

    const result = await response.json();

    const shipment = shipmentsStore.getShipmentById(shipmentId);
    // Update document status
    const docIndex = shipment.documents.findIndex(d => d.type === docType);
    if (docIndex >= 0) {
      shipment.documents[docIndex].uploaded = true;
      shipment.documents[docIndex].uploadedAt = new Date().toISOString();
      shipment.documents[docIndex].fileUrl = result.fileUrl;
    }

    shipmentsStore.saveShipment(shipment);

    toast.success(`${docType} uploaded successfully`);
    return result;
  } catch (error) {
    console.error('Document upload error:', error);
    toast.error(error.message);
    throw error;
  }
};

// ============================================================================
// 8. FETCH SHIPMENT (for editing)
// ============================================================================

const fetchShipment = async (shipmentId) => {
  try {
    const response = await fetch(`/api/shipments/${shipmentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch shipment');

    const result = await response.json();
    
    // Update local store
    shipmentsStore.saveShipment(result.data);
    
    return result.data;
  } catch (error) {
    console.error('Error fetching shipment:', error);
    // Fall back to local store
    return shipmentsStore.getShipmentById(shipmentId);
  }
};

// ============================================================================
// 9. HELPER: ERROR HANDLING & RETRY
// ============================================================================

const retryOperation = async (operation, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
};

// ============================================================================
// 10. EXPORT FOR USE IN COMPONENTS
// ============================================================================

export {
  handleSubmit,
  triggerAICheck,
  requestBrokerApproval,
  brokerApprove,
  brokerRequestDocuments,
  bookShipment,
  processPayment,
  uploadDocument,
  fetchShipment,
  retryOperation
};

// ============================================================================
// USAGE IN COMPONENTS
// ============================================================================

/*
In ShipmentForm.jsx:
import { handleSubmit as submitForm } from './apiIntegration';

In broker review component:
import { brokerApprove, brokerRequestDocuments } from './apiIntegration';

In payment component:
import { processPayment } from './apiIntegration';

In document upload:
import { uploadDocument } from './apiIntegration';
*/

// ============================================================================
// ENVIRONMENT SETUP
// ============================================================================

/*
Create .env file with:

VITE_API_BASE_URL=http://localhost:5000
VITE_API_VERSION=v1
VITE_APP_NAME=Pre-Clear

Usage in components:
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const apiUrl = `${baseUrl}/api/shipments`;
*/
