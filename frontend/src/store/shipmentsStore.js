// Centralized shipment data store for real-time synchronization between roles
// This simulates a real-time database that all users can access

// Mock initial data
const mockShipments = [
  {
    id: 'SHP-001',
    title: 'Electronic Components Shipment',
    productName: 'Electronic Components',
    productDescription: 'Industrial electronic integrated circuits',
    hsCode: '8541.10.00',
    quantity: '100',
    weight: '25.5',
    value: '5000',
    currency: 'USD',
    pickupType: 'Scheduled Pickup',
    pickupLocation: 'Factory Gate A',
    pickupDate: '2024-12-05',
    pickupTimeEarliest: '09:00',
    pickupTimeLatest: '12:00',
    mode: 'Air',
    shipmentType: 'International',
    customsValue: 5000,
    serviceLevel: 'Express',
    paymentStatus: 'completed',
    pricing: {
      basePrice: 127.5,
      serviceCharge: 75,
      customsClearance: 250,
      pickupCharge: 50,
      insurance: 25,
      subtotal: 527.5,
      tax: 52.75,
      total: 580.25,
      preClearFee: 35
    },
    status: 'token-generated',
    aiApproval: 'approved',
    aiScore: 94,
    aiEvaluatedAt: '2024-12-02T10:30:00Z',
    brokerApproval: 'approved',
    brokerReviewedAt: '2024-12-02T14:30:00Z',
    token: 'UPS-PCT-87654321',
    tokenGeneratedAt: '2024-12-02T14:35:00Z',
    bookingDate: '2024-12-02T14:35:00Z',
    shipper: {
      company: 'ABC Exports Inc',
      contactName: 'John Smith',
      phone: '+86-21-1234-5678',
      email: 'john@abc-exports.com',
      address1: '123 Manufacturing St',
      address2: 'Building A',
      city: 'Shanghai',
      state: 'Shanghai',
      postalCode: '200000',
      country: 'CN'
    },
    consignee: {
      company: 'XYZ Imports LLC',
      contactName: 'Sarah Johnson',
      phone: '+1-212-555-0001',
      email: 'sarah@xyz-imports.com',
      address1: '456 Import Ave',
      address2: 'Suite 500',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US'
    },
    documents: [
      { name: 'Commercial Invoice', type: 'invoice', uploaded: true, uploadedAt: '2024-12-02T09:00:00Z' },
      { name: 'Packing List', type: 'packing-list', uploaded: true, uploadedAt: '2024-12-02T09:05:00Z' },
      { name: 'Certificate of Origin', type: 'certificate', uploaded: true, uploadedAt: '2024-12-02T09:10:00Z' },
    ],
    uploadedDocuments: {
      commercialInvoice: { name: 'Commercial Invoice', uploadedAt: '2024-12-02T09:00:00Z', source: 'form', content: 'Commercial Invoice - Electronic Components\nTotal: $5000' },
      packingList: { name: 'Packing List', uploadedAt: '2024-12-02T09:05:00Z', source: 'form', content: 'Packing List - 1 box, 100 pcs' },
      certificateOfOrigin: { name: 'Certificate of Origin', uploadedAt: '2024-12-02T09:10:00Z', source: 'form', content: 'Certificate of Origin - China' }
    },
    packages: [
      {
        id: 'PKG-001-1',
        type: 'Box',
        length: 30,
        width: 25,
        height: 20,
        dimUnit: 'cm',
        weight: 25.5,
        weightUnit: 'kg',
        stackable: true,
        products: [
          {
            id: 'PROD-001-1-1',
            name: 'Circuit Boards',
            description: 'Industrial electronic integrated circuits',
            category: 'Electronics',
            hsCode: '8541.10.00',
            uom: 'pieces',
            qty: 100,
            unitPrice: 50,
            totalValue: 5000,
            originCountry: 'CN',
            reasonForExport: 'Commercial Trade'
          }
        ]
      }
    ],
    createdAt: '2024-12-02T08:00:00Z',
    updatedAt: '2024-12-02T14:35:00Z',
    shipperId: 'shipper-1',
    shipperName: 'ABC Exports'
  },
  {
    id: 'SHP-002',
    title: 'Textile Goods Shipment',
    productName: 'Textile Goods',
    productDescription: 'Cotton fabric rolls for apparel manufacturing',
    hsCode: '5208.31.00',
    quantity: '500',
    weight: '150',
    value: '12000',
    currency: 'EUR',
    pickupType: 'Drop-off',
    estimatedDropoffDate: '2024-12-10',
    mode: 'Sea',
    shipmentType: 'International',
    customsValue: 12000,
    serviceLevel: 'Standard',
    paymentStatus: 'pending',
    pricing: {
      basePrice: 750,
      serviceCharge: 120,
      customsClearance: 600,
      pickupCharge: 60,
      insurance: 80,
      subtotal: 1610,
      tax: 161,
      total: 1771,
      preClearFee: 35
    },
    status: 'awaiting-broker',
    aiApproval: 'approved',
    aiScore: 96,
    aiEvaluatedAt: '2024-12-03T08:00:00Z',
    brokerApproval: 'pending',
    shipper: {
      company: 'ABC Exports Inc',
      contactName: 'John Smith',
      phone: '+86-21-1234-5678',
      email: 'john@abc-exports.com',
      address1: '123 Manufacturing St',
      address2: 'Building A',
      city: 'Shanghai',
      state: 'Shanghai',
      postalCode: '200000',
      country: 'IN'
    },
    consignee: {
      company: 'Fashion Imports USA',
      contactName: 'Mike Davis',
      phone: '+1-213-555-0002',
      email: 'mike@fashionimports.com',
      address1: '321 Fashion Blvd',
      address2: 'Warehouse 2',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'US'
    },
    documents: [
      { name: 'Commercial Invoice', type: 'invoice', uploaded: true, uploadedAt: '2024-12-03T07:00:00Z' },
      { name: 'Packing List', type: 'packing-list', uploaded: true, uploadedAt: '2024-12-03T07:05:00Z' },
      { name: 'Certificate of Origin', type: 'certificate', uploaded: true, uploadedAt: '2024-12-03T07:10:00Z' },
    ],
    uploadedDocuments: {
      commercialInvoice: { name: 'Commercial Invoice', uploadedAt: '2024-12-03T07:00:00Z', source: 'form', content: 'Commercial Invoice - Textile Goods\nTotal: $12000' },
      packingList: { name: 'Packing List', uploadedAt: '2024-12-03T07:05:00Z', source: 'form', content: 'Packing List - 10 pallets' },
      certificateOfOrigin: { name: 'Certificate of Origin', uploadedAt: '2024-12-03T07:10:00Z', source: 'form', content: 'Certificate of Origin - India' }
    },
    packages: [
      {
        id: 'PKG-002-1',
        type: 'Pallet',
        length: 120,
        width: 100,
        height: 150,
        dimUnit: 'cm',
        weight: 150,
        weightUnit: 'kg',
        stackable: true,
        products: [
          {
            id: 'PROD-002-1-1',
            name: 'Cotton Fabric',
            description: 'Cotton fabric rolls for apparel manufacturing',
            category: 'Textiles',
            hsCode: '5208.31.00',
            uom: 'meters',
            qty: 500,
            unitPrice: 24,
            totalValue: 12000,
            originCountry: 'IN',
            reasonForExport: 'Commercial Trade'
          }
        ]
      }
    ],
    createdAt: '2024-12-03T06:00:00Z',
    updatedAt: '2024-12-03T08:00:00Z',
    shipperId: 'shipper-1',
    shipperName: 'ABC Exports'
  },
  {
    id: 'SHP-003',
    title: 'Medical Devices Shipment',
    productName: 'Medical Devices',
    productDescription: 'Diagnostic medical equipment',
    hsCode: '9018.19.00',
    quantity: '20',
    weight: '45',
    value: '25000',
    currency: 'USD',
    pickupType: 'Scheduled Pickup',
    pickupLocation: 'MedTech Dock',
    pickupDate: '2024-12-06',
    pickupTimeEarliest: '08:00',
    pickupTimeLatest: '11:00',
    mode: 'Air',
    shipmentType: 'International',
    customsValue: 25000,
    serviceLevel: 'Express',
    paymentStatus: 'completed',
    pricing: {
      basePrice: 225,
      serviceCharge: 150,
      customsClearance: 1250,
      pickupCharge: 45,
      insurance: 100,
      subtotal: 1770,
      tax: 177,
      total: 1947,
      preClearFee: 35
    },
    status: 'documents-uploaded',
    aiApproval: 'not-started',
    aiScore: 0,
    brokerApproval: 'not-started',
    shipper: {
      company: 'ABC Exports Inc',
      contactName: 'John Smith',
      phone: '+81-3-1234-5678',
      email: 'john@abc-exports.com',
      address1: '555 MedTech Tower',
      address2: 'Floor 10',
      city: 'Tokyo',
      state: 'Tokyo',
      postalCode: '100-0001',
      country: 'JP'
    },
    consignee: {
      company: 'Boston Medical Center',
      contactName: 'Dr. Emily White',
      phone: '+1-617-555-0003',
      email: 'emily@bostonmedical.com',
      address1: '789 Hospital Drive',
      address2: 'Medical Building',
      city: 'Boston',
      state: 'MA',
      postalCode: '02115',
      country: 'US'
    },
    documents: [
      { name: 'Commercial Invoice', type: 'invoice', uploaded: true, uploadedAt: '2024-12-03T10:00:00Z' },
      { name: 'Packing List', type: 'packing-list', uploaded: true, uploadedAt: '2024-12-03T10:05:00Z' },
      { name: 'Certificate of Origin', type: 'certificate', uploaded: true, uploadedAt: '2024-12-03T10:10:00Z' },
    ],
    packages: [
      {
        id: 'PKG-003-1',
        type: 'Crate',
        length: 50,
        width: 40,
        height: 35,
        dimUnit: 'cm',
        weight: 45,
        weightUnit: 'kg',
        stackable: false,
        products: [
          {
            id: 'PROD-003-1-1',
            name: 'Diagnostic Equipment',
            description: 'Diagnostic medical equipment',
            category: 'Medical',
            hsCode: '9018.19.00',
            uom: 'units',
            qty: 20,
            unitPrice: 1250,
            totalValue: 25000,
            originCountry: 'JP',
            reasonForExport: 'Commercial Trade'
          }
        ]
      }
    ],
    createdAt: '2024-12-03T09:00:00Z',
    updatedAt: '2024-12-03T10:10:00Z',
    shipperId: 'shipper-1',
    shipperName: 'ABC Exports'
  },
  {
    id: 'SHP-004',
    title: 'Industrial Machinery Shipment',
    productName: 'Industrial Machinery',
    productDescription: 'CNC milling machines',
    hsCode: '8459.10.00',
    quantity: '5',
    weight: '2500',
    value: '150000',
    currency: 'USD',
    pickupType: 'Drop-off',
    estimatedDropoffDate: '2024-12-12',
    mode: 'Sea',
    shipmentType: 'International',
    customsValue: 150000,
    serviceLevel: 'Freight',
    paymentStatus: 'completed',
    pricing: {
      basePrice: 12500,
      serviceCharge: 2000,
      customsClearance: 7500,
      pickupCharge: 350,
      insurance: 500,
      subtotal: 22850,
      tax: 2285,
      total: 25135,
      preClearFee: 35
    },
    status: 'document-requested',
    aiApproval: 'approved',
    aiScore: 88,
    aiEvaluatedAt: '2024-12-02T11:00:00Z',
    brokerApproval: 'documents-requested',
    brokerReviewedAt: '2024-12-02T15:00:00Z',
    brokerNotes: 'Please provide updated safety certificates and detailed technical specifications.',
    shipper: {
      company: 'ABC Exports Inc',
      contactName: 'John Smith',
      phone: '+86-755-1234-5678',
      email: 'john@abc-exports.com',
      address1: '123 Industrial Park',
      address2: 'Building D',
      city: 'Shenzhen',
      state: 'Guangdong',
      postalCode: '518000',
      country: 'CN'
    },
    consignee: {
      company: 'Detroit Manufacturing Co',
      contactName: 'Robert Wilson',
      phone: '+1-313-555-0004',
      email: 'robert@detroitmfg.com',
      address1: '456 Manufacturing Way',
      address2: 'Industrial Zone',
      city: 'Detroit',
      state: 'MI',
      postalCode: '48201',
      country: 'US'
    },
    documents: [
      { name: 'Commercial Invoice', type: 'invoice', uploaded: true, uploadedAt: '2024-12-02T10:00:00Z' },
      { name: 'Packing List', type: 'packing-list', uploaded: true, uploadedAt: '2024-12-02T10:05:00Z' },
      { name: 'Certificate of Origin', type: 'certificate', uploaded: true, uploadedAt: '2024-12-02T10:10:00Z' },
      { name: 'Safety Certificate', type: 'certificate', uploaded: false, requested: true, requestedAt: '2024-12-02T15:00:00Z' },
      { name: 'Technical Specifications', type: 'specification', uploaded: false, requested: true, requestedAt: '2024-12-02T15:00:00Z' },
    ],
    packages: [
      {
        id: 'PKG-004-1',
        type: 'Crate',
        length: 300,
        width: 200,
        height: 250,
        dimUnit: 'cm',
        weight: 2500,
        weightUnit: 'kg',
        stackable: false,
        products: [
          {
            id: 'PROD-004-1-1',
            name: 'CNC Milling Machines',
            description: 'CNC milling machines for industrial manufacturing',
            category: 'Machinery',
            hsCode: '8459.10.00',
            uom: 'units',
            qty: 5,
            unitPrice: 30000,
            totalValue: 150000,
            originCountry: 'CN',
            reasonForExport: 'Commercial Trade'
          }
        ]
      }
    ],
    createdAt: '2024-12-02T09:00:00Z',
    updatedAt: '2024-12-02T15:00:00Z',
    shipperId: 'shipper-1',
    shipperName: 'ABC Exports'
  }
];

const mockMessages = [
  {
    id: 'msg-1',
    shipmentId: 'SHP-004',
    sender: 'broker',
    senderName: 'John Broker',
    message: 'Please provide Safety Certificate and Technical Specifications for the CNC machines.',
    timestamp: '2024-12-02T15:00:00Z',
    type: 'document-request'
  },
  {
    id: 'msg-2',
    shipmentId: 'SHP-004',
    sender: 'shipper',
    senderName: 'ABC Exports',
    message: 'We will upload the requested documents within 24 hours.',
    timestamp: '2024-12-02T15:30:00Z',
    type: 'message'
  }
];

const mockNotifications = [
  {
    id: 'notif-1',
    type: 'broker-approval-request',
    title: 'New Approval Request',
    message: 'SHP-002: Textile Goods - Awaiting your review',
    shipmentId: 'SHP-002',
    timestamp: '2024-12-03T08:05:00Z',
    read: false,
    recipientRole: 'broker'
  },
  {
    id: 'notif-2',
    type: 'documents-requested',
    title: 'Documents Requested',
    message: 'SHP-004: Additional documents needed',
    shipmentId: 'SHP-004',
    timestamp: '2024-12-02T15:00:00Z',
    read: false,
    recipientRole: 'shipper'
  }
];

const mockImportExportRules = [
  {
    id: 'rule-1',
    country: 'United States',
    countryCode: 'US',
    productCategory: 'Electronics',
    hsCodeRange: '8541-8548',
    restrictions: ['Require FCC certification', 'Lead content restrictions (RoHS)', 'Energy Star compliance'],
    requiredDocuments: ['Commercial Invoice', 'Packing List', 'FCC Declaration', 'Certificate of Origin'],
    bannedProducts: ['Counterfeit chips', 'Military-grade semiconductors without license'],
    maxValue: 2500,
    additionalNotes: 'Electronic products valued over $2500 require additional FDA review if medical-related.',
    lastUpdated: '2024-11-15T10:00:00Z',
    updatedBy: 'Admin'
  },
  {
    id: 'rule-2',
    country: 'United States',
    countryCode: 'US',
    productCategory: 'Textiles',
    hsCodeRange: '5208-5212',
    restrictions: ['Country of origin labeling required', 'Fiber content declaration', 'No child labor certification'],
    requiredDocuments: ['Commercial Invoice', 'Packing List', 'Certificate of Origin', 'Textile Declaration'],
    bannedProducts: ['Products from sanctioned regions', 'Goods made with forced labor'],
    maxValue: 250,
    additionalNotes: 'Textile shipments over $250 require additional CBP declaration.',
    lastUpdated: '2024-11-20T14:30:00Z',
    updatedBy: 'Admin'
  },
  {
    id: 'rule-3',
    country: 'United States',
    countryCode: 'US',
    productCategory: 'Medical Devices',
    hsCodeRange: '9018-9022',
    restrictions: ['FDA approval required', 'ISO 13485 certification', 'Biocompatibility testing'],
    requiredDocuments: ['Commercial Invoice', 'Packing List', 'FDA Registration', 'ISO Certificate', 'Safety Data Sheet'],
    bannedProducts: ['Unapproved medical devices', 'Counterfeit pharmaceuticals'],
    additionalNotes: 'All medical devices must have FDA establishment registration and device listing.',
    lastUpdated: '2024-11-25T09:00:00Z',
    updatedBy: 'Admin'
  },
  {
    id: 'rule-4',
    country: 'United States',
    countryCode: 'US',
    productCategory: 'Machinery',
    hsCodeRange: '8459-8466',
    restrictions: ['OSHA compliance required', 'Safety certification', 'Export license for dual-use items'],
    requiredDocuments: ['Commercial Invoice', 'Packing List', 'Safety Certificate', 'Technical Specifications', 'Certificate of Origin'],
    bannedProducts: ['Dual-use items without export license', 'Products violating EPA regulations'],
    maxWeight: 5000,
    additionalNotes: 'Heavy machinery over 5000kg requires special handling permits.',
    lastUpdated: '2024-12-01T11:00:00Z',
    updatedBy: 'Admin'
  }
];

// Factory used by app to create a new shipment for forms
export const createDefaultShipment = () => ({
  id: `SHP-${Date.now()}`,
  productName: '',
  productDescription: '',
  hsCode: '',
  quantity: '',
  weight: '',
  value: 0,
  currency: 'USD',
  originCountry: 'US',
  originCity: '',
  originAddress: '',
  destCountry: '',
  destCity: '',
  destAddress: '',
  status: 'draft',
  aiApproval: 'not-started',
  aiScore: 0,
  brokerApproval: 'not-started',
  documents: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  shipperId: '',
  shipperName: ''
});
// In-memory store (simulates a real-time database)
class ShipmentsStore {
  constructor() {
    this.shipments = [...mockShipments];
    this.messages = [...mockMessages];
    this.notifications = [...mockNotifications];
    this.importExportRules = [...mockImportExportRules];
    this.listeners = new Set();
  }

  // Subscribe to changes
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners
  notify() {
    this.listeners.forEach(callback => callback());
  }

  // Get all shipments
  getAllShipments() {
    return [...this.shipments];
  }

  // Get shipment by ID
  getShipmentById(id) {
    return this.shipments.find(s => s.id === id);
  }

  // Get shipments by status
  getShipmentsByStatus(status) {
    return this.shipments.filter(s => s.status === status);
  }

  // Get shipments awaiting broker review (AI approved, broker pending)
  getShipmentsAwaitingBroker() {
    return this.shipments.filter(
      s => s.aiApproval === 'approved' && 
           (s.brokerApproval === 'pending' || s.brokerApproval === 'not-started')
    );
  }

  // Get shipments with document requests
  getShipmentsWithDocumentRequests() {
    return this.shipments.filter(s => s.status === 'document-requested');
  }

  // Create or update shipment
  saveShipment(shipment) {
    const index = this.shipments.findIndex(s => s.id === shipment.id);
    shipment.updatedAt = new Date().toISOString();
    
    const isNewShipment = index < 0;
    
    if (index >= 0) {
      this.shipments[index] = shipment;
    } else {
      this.shipments.push(shipment);
    }
    
    // Add notification for broker when new shipment is created
    if (isNewShipment) {
      this.addNotification({
        id: `notif-${Date.now()}-${Math.random()}`,
        type: 'shipment-created',
        title: 'New Shipment Created',
        message: `${shipment.id}: ${shipment.productName} - ${shipment.originCountry} → ${shipment.destCountry}`,
        shipmentId: shipment.id,
        timestamp: new Date().toISOString(),
        read: false,
        recipientRole: 'broker'
      });
    }
    
    this.notify();
  }

  // Update shipment status
  updateShipmentStatus(id, status) {
    const shipment = this.getShipmentById(id);
    if (shipment) {
      shipment.status = status;
      shipment.updatedAt = new Date().toISOString();
      this.saveShipment(shipment);
    }
  }

  // Update AI approval
  updateAIApproval(id, approval, aiResults, score) {
    const shipment = this.getShipmentById(id);
    if (shipment) {
      shipment.aiApproval = approval;
      shipment.aiScore = score;
      shipment.aiResults = aiResults;
      shipment.aiEvaluatedAt = new Date().toISOString();
      
      if (approval === 'approved') {
        shipment.status = 'ai-approved';
      } else {
        shipment.status = 'denied';
      }
      
      this.saveShipment(shipment);
    }
  }

  // Request broker approval
  requestBrokerApproval(id) {
    const shipment = this.getShipmentById(id);
    if (shipment && shipment.aiApproval === 'approved') {
      shipment.brokerApproval = 'pending';
      shipment.status = 'awaiting-broker';
      this.saveShipment(shipment);
      
      // Add notification for broker
      this.addNotification({
        id: `notif-${Date.now()}-${Math.random()}`,
        type: 'broker-approval-request',
        title: 'New Broker Approval Request',
        message: `${shipment.id}: ${shipment.productName} - Ready for review`,
        shipmentId: shipment.id,
        timestamp: new Date().toISOString(),
        read: false,
        recipientRole: 'broker'
      });
    }
  }

  // Broker approves shipment
  brokerApprove(id, notes) {
    const shipment = this.getShipmentById(id);
    if (shipment) {
      shipment.brokerApproval = 'approved';
      shipment.brokerReviewedAt = new Date().toISOString();
      shipment.brokerNotes = notes;
      
      // Generate token
      const token = `UPS-PCT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      shipment.token = token;
      shipment.tokenGeneratedAt = new Date().toISOString();
      shipment.status = 'token-generated';
      
      this.saveShipment(shipment);
      
      // Add notification for shipper
      this.addNotification({
        id: `notif-${Date.now()}-${Math.random()}`,
        type: 'broker-approved',
        title: 'Broker Approved Your Shipment',
        message: `${shipment.id}: Token generated - ${token}`,
        shipmentId: id,
        timestamp: new Date().toISOString(),
        read: false,
        recipientRole: 'shipper'
      });
    }
  }

  // Broker denies shipment
  brokerDeny(id, reason) {
    const shipment = this.getShipmentById(id);
    if (shipment) {
      shipment.brokerApproval = 'rejected';
      shipment.brokerReviewedAt = new Date().toISOString();
      shipment.brokerNotes = reason;
      shipment.status = 'denied';
      
      this.saveShipment(shipment);
      
      // Add system message
      this.addMessage({
        id: `msg-${Date.now()}`,
        shipmentId: id,
        sender: 'broker',
        senderName: 'Customs Broker',
        message: `Shipment denied: ${reason}`,
        timestamp: new Date().toISOString(),
        type: 'system'
      });
    }
  }

  // Broker requests documents
  brokerRequestDocuments(id, requestedDocs, message) {
    const shipment = this.getShipmentById(id);
    if (shipment) {
      shipment.brokerApproval = 'documents-requested';
      shipment.brokerReviewedAt = new Date().toISOString();
      shipment.brokerNotes = message;
      shipment.status = 'document-requested';
      
      // Mark documents as requested
      const now = new Date().toISOString();
      requestedDocs.forEach(doc => {
        const existingDoc = shipment.documents.find(d => d.name === doc.name);
        if (existingDoc) {
          existingDoc.requested = true;
          existingDoc.requestedAt = now;
        } else {
          shipment.documents.push({
            name: doc.name,
            type: doc.type,
            uploaded: false,
            requested: true,
            requestedAt: now
          });
        }
      });
      
      this.saveShipment(shipment);
      
      // Add chat message
      this.addMessage({
        id: `msg-${Date.now()}`,
        shipmentId: id,
        sender: 'broker',
        senderName: 'Customs Broker',
        message: `Documents requested: ${requestedDocs.map(d => d.name).join(', ')}. ${message}`,
        timestamp: now,
        type: 'document-request'
      });
    }
  }

  // Upload document
  uploadDocument(shipmentId, docName, docType) {
    const shipment = this.getShipmentById(shipmentId);
    if (shipment) {
      const doc = shipment.documents.find(d => d.name === docName);
      if (doc) {
        doc.uploaded = true;
        doc.uploadedAt = new Date().toISOString();
      } else {
        shipment.documents.push({
          name: docName,
          type: docType,
          uploaded: true,
          uploadedAt: new Date().toISOString()
        });
      }
      
      // Check if all requested documents are uploaded
      const allRequestedUploaded = shipment.documents
        .filter(d => d.requested)
        .every(d => d.uploaded);
      
      // If all requested documents are uploaded and status is document-requested,
      // don't automatically change status - let shipper choose to re-run AI or send to broker
      if (allRequestedUploaded && shipment.status === 'document-requested') {
        // Keep status as document-requested, update broker approval to allow resubmission
        shipment.brokerApproval = 'documents-requested';
        
        // Add notification for shipper
        this.addNotification({
          id: `notif-${Date.now()}-${Math.random()}`,
          type: 'documents-requested',
          title: 'Documents Uploaded',
          message: `All requested documents uploaded for shipment ${shipment.id}. You can now re-run AI check or send to broker.`,
          shipmentId: shipment.id,
          timestamp: new Date().toISOString(),
          read: false,
          recipientRole: 'shipper'
        });
      }
      
      this.saveShipment(shipment);
    }
  }

  // Book shipment
  bookShipment(id, bookingDate, estimatedDelivery, amount) {
    const shipment = this.getShipmentById(id);
    if (shipment && shipment.token) {
      shipment.bookingDate = bookingDate;
      shipment.estimatedDelivery = estimatedDelivery;
      shipment.paymentAmount = amount;
      shipment.paymentStatus = 'pending';
      shipment.status = 'ready-for-booking';
      
      this.saveShipment(shipment);
    }
  }

  // Complete payment
  completePayment(id) {
    const shipment = this.getShipmentById(id);
    if (shipment) {
      const now = new Date().toISOString();
      shipment.paymentStatus = 'completed';
      shipment.paymentDate = now;
      shipment.bookingDate = now;
      shipment.status = 'payment-completed';
      
      this.saveShipment(shipment);
    }
  }

  // Chat messages
  getMessages(shipmentId) {
    if (shipmentId) {
      return this.messages.filter(m => m.shipmentId === shipmentId);
    }
    return [...this.messages];
  }

  addMessage(message) {
    this.messages.push(message);
    this.notify();
  }

  // Get unread message count for shipper
  getUnreadMessageCount(shipperId) {
    // Simulate unread messages - in real app would track read status
    return this.messages.filter(m => m.sender === 'broker').length;
  }

  // Notifications
  getNotifications(role) {
    return this.notifications.filter(n => n.recipientRole === role);
  }

  addNotification(notification) {
    this.notifications.push(notification);
    this.notify();
  }

  markNotificationAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notify();
    }
  }

  // Import/Export Rules
  getImportExportRules() {
    return [...this.importExportRules];
  }

  addImportExportRule(rule) {
    this.importExportRules.push(rule);
    this.notify();
  }

  updateImportExportRule(id, updatedRule) {
    const index = this.importExportRules.findIndex(r => r.id === id);
    if (index >= 0) {
      this.importExportRules[index] = updatedRule;
      this.notify();
    }
  }

  deleteImportExportRule(id) {
    const index = this.importExportRules.findIndex(r => r.id === id);
    if (index >= 0) {
      this.importExportRules.splice(index, 1);
      this.notify();
    }
  }
}

// Export singleton instance
export const shipmentsStore = new ShipmentsStore();


