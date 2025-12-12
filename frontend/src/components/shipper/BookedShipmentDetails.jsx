import { useState } from 'react';
import { Download, CheckCircle, DollarSign, Package, FileText, TrendingUp, ArrowLeft, Box } from 'lucide-react';
import { getCurrencyByCountry, formatCurrency } from '../../utils/validation';

// Customs clearance configuration by destination country
const CLEARANCE_CONFIG = {
  'IN': { base: 50, threshold: 10000, formalFee: 2000, extraLineItemFee: 100, specialCommodityFee: 1500 },
  'US': { base: 0, threshold: 800, formalFee: 35, extraLineItemFee: 5, specialCommodityFee: 25 },
  'GB': { base: 20, threshold: 150, formalFee: 40, extraLineItemFee: 5, specialCommodityFee: 30 },
  'FR': { base: 20, threshold: 150, formalFee: 40, extraLineItemFee: 5, specialCommodityFee: 30 },
  'DE': { base: 20, threshold: 150, formalFee: 40, extraLineItemFee: 5, specialCommodityFee: 30 },
  'IT': { base: 20, threshold: 150, formalFee: 40, extraLineItemFee: 5, specialCommodityFee: 30 },
  'ES': { base: 20, threshold: 150, formalFee: 40, extraLineItemFee: 5, specialCommodityFee: 30 },
  'NL': { base: 20, threshold: 150, formalFee: 40, extraLineItemFee: 5, specialCommodityFee: 30 },
  'BE': { base: 20, threshold: 150, formalFee: 40, extraLineItemFee: 5, specialCommodityFee: 30 },
  'default': { base: 30, threshold: 100, formalFee: 50, extraLineItemFee: 5, specialCommodityFee: 30 }
};

// Pickup charge configuration by origin country
const PICKUP_CONFIG = {
  'IN': 250,
  'US': 35,
  'GB': 25,
  'FR': 28,
  'DE': 30,
  'IT': 27,
  'ES': 26,
  'NL': 32,
  'BE': 29,
  'CN': 40,
  'JP': 50,
  'SG': 45,
  'AU': 55,
  'CA': 40,
  'MX': 38,
  'BR': 42,
  'default': 50
};

// Helper function to calculate customs clearance
const calculateClearance = (destCountry, customsValue, lineItemCount, isSpecialCommodity) => {
  const country = destCountry?.toUpperCase() || '';
  const config = CLEARANCE_CONFIG[country] || CLEARANCE_CONFIG['default'];
  
  let clearance = config.base;
  
  // Add formal clearance fee if customs value exceeds threshold
  if (customsValue > config.threshold) {
    clearance += config.formalFee;
  }
  
  // Add extra line item fee if line items > 5
  if (lineItemCount > 5) {
    clearance += (lineItemCount - 5) * config.extraLineItemFee;
  }
  
  // Add special commodity surcharge if applicable
  if (isSpecialCommodity) {
    clearance += config.specialCommodityFee;
  }
  
  return Math.round(clearance);
};

// Helper function to calculate pickup charge
const calculatePickupCharge = (originCountry) => {
  const country = originCountry?.toUpperCase() || '';
  return PICKUP_CONFIG[country] || PICKUP_CONFIG['default'];
};

export function BookedShipmentDetails({ shipment, onNavigate }) {
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);
  const [expandedDocument, setExpandedDocument] = useState(null);

  const currency = getCurrencyByCountry(shipment?.shipper?.country || 'US');

  // Helper function to format time to 12-hour format with AM/PM
  const formatTimeWithAmPm = (timeString) => {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Pricing calculations
  const shipmentValue = parseFloat(shipment?.value || '0');
  const weight = parseFloat(shipment?.weight || '0');
  const customsValue = parseFloat(shipment?.customsValue || shipmentValue || '0');
  const pricing = shipment?.pricing || {};
  const originCountry = shipment?.shipper?.country || shipment?.originCountry || 'US';
  const destCountry = shipment?.consignee?.country || shipment?.destCountry || 'US';

  // Count line items from packages
  const lineItemCount = shipment?.packages?.reduce((acc, pkg) => acc + (pkg.products?.length || 0), 0) || 0;
  const isSpecialCommodity = shipment?.packages?.some(pkg => pkg.products?.some(p => p.reasonForExport === 'Special')) || false;

  // Service level multipliers
  const serviceLevelMultiplier = {
    'Standard': 1.0,
    'Express': 1.5,
    'Economy': 0.8,
    'Freight': 0.7,
  };

  // Calculate pricing using same formula as ShipmentForm
  const basePrice = parseFloat(pricing.basePrice || (customsValue * 0.05) || 0);
  const serviceCharge = parseFloat(pricing.serviceCharge || (basePrice * (serviceLevelMultiplier[shipment?.serviceLevel] || 1.0)) || 0);
  const calculatedCustomsClearance = calculateClearance(destCountry, customsValue, lineItemCount, isSpecialCommodity);
  const customsClearance = parseFloat(pricing.customsClearance || calculatedCustomsClearance);
  const calculatedPickupCharge = shipment?.pickupType === 'Scheduled Pickup' ? calculatePickupCharge(originCountry) : 0;
  const pickupCharge = parseFloat(pricing.pickupCharge || calculatedPickupCharge);
  const subtotal = parseFloat(pricing.subtotal || (basePrice + serviceCharge + customsClearance + pickupCharge) || 0);
  const tax = parseFloat(pricing.tax || subtotal * 0.18 || 0);
  const total = parseFloat(pricing.total || subtotal + tax || 0);

  const handleDownloadReceipt = () => {
    setDownloadingReceipt(true);
    setTimeout(() => {
      // Simulate download
      const receiptContent = `
PRE-CLEAR SHIPMENT RECEIPT
==========================
Shipment ID: ${shipment?.id}
Token: ${shipment?.token}
Date: ${new Date().toLocaleDateString()}

SHIPMENT DETAILS
===============
Title: ${shipment?.title || 'N/A'}
Route: ${shipment?.shipper?.city || 'N/A'}, ${shipment?.shipper?.country || ''} → ${shipment?.consignee?.city || 'N/A'}, ${shipment?.consignee?.country || ''}
Weight: ${shipment?.weight} kg
Declared Value: ${formatCurrency(shipmentValue, shipment?.currency || currency.code)}
Mode: ${shipment?.mode || 'N/A'}
Shipment Type: ${shipment?.shipmentType || 'N/A'}

PRICING BREAKDOWN
================
Base Price: ${formatCurrency(basePrice, shipment?.currency || currency.code)}
Service Charge: ${formatCurrency(serviceCharge, shipment?.currency || currency.code)}
Customs Clearance: ${formatCurrency(customsClearance, shipment?.currency || currency.code)}
${shipment?.pickupType === 'Scheduled Pickup' ? `Pickup Charge: ${formatCurrency(pickupCharge, shipment?.currency || currency.code)}\n` : ''}
Subtotal: ${formatCurrency(subtotal, shipment?.currency || currency.code)}
Tax (18%): ${formatCurrency(tax, shipment?.currency || currency.code)}
TOTAL: ${formatCurrency(total, shipment?.currency || currency.code)}

APPROVAL STATUS
===============
AI Approval: ${shipment?.aiApproval || 'N/A'}
Broker Approval: ${shipment?.brokerApproval || 'N/A'}
Payment Status: ${shipment?.paymentStatus || 'Completed'}

Generated by Pre-Clear System
`;
      
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(receiptContent));
      element.setAttribute('download', `Receipt-${shipment?.id}.txt`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setDownloadingReceipt(false);
    }, 1000);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => onNavigate('booked-paid')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="text-slate-900">Booked Shipment Details</h1>
          </div>
          <p className="text-slate-600 ml-11">Complete details and receipt for your booked shipment</p>
        </div>
        <button
          onClick={handleDownloadReceipt}
          disabled={downloadingReceipt}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {downloadingReceipt ? 'Downloading...' : 'Download Receipt'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-green-900 text-xl font-bold">Ready to Ship</h2>
                <p className="text-green-700 mt-1">Your shipment has been approved and is ready for booking</p>
                <div className="mt-3 space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-800">AI Approved: {shipment?.aiApproval === 'approved' ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-800">Broker Approved: {shipment?.brokerApproval === 'approved' ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-800">Payment: {shipment?.paymentStatus === 'completed' ? 'Completed' : 'Pending'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipment Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-slate-900 font-semibold mb-4">Shipment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-500 text-sm mb-1">Shipment ID</p>
                <p className="text-slate-900 font-mono">{shipment?.id}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Token</p>
                <p className="text-slate-900 font-mono text-sm">{shipment?.token}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Title</p>
                <p className="text-slate-900">{shipment?.title || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Mode</p>
                <p className="text-slate-900">{shipment?.mode || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Route</p>
                <p className="text-slate-900">{shipment?.shipper?.city || 'N/A'}, {shipment?.shipper?.country || ''} → {shipment?.consignee?.city || 'N/A'}, {shipment?.consignee?.country || ''}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Shipment Type</p>
                <p className="text-slate-900">{shipment?.shipmentType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Weight</p>
                <p className="text-slate-900">{shipment?.weight} kg</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Declared Value</p>
                <p className="text-slate-900">{formatCurrency(shipmentValue, shipment?.currency || currency.code)}</p>
              </div>
            </div>
          </div>

          {/* Shipper & Consignee */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-slate-900 font-semibold mb-4">Shipper</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-slate-500">Company</p>
                  <p className="text-slate-900">{shipment?.shipper?.company || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Contact</p>
                  <p className="text-slate-900">{shipment?.shipper?.contactName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Email</p>
                  <p className="text-slate-900">{shipment?.shipper?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Phone</p>
                  <p className="text-slate-900">{shipment?.shipper?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500">City</p>
                  <p className="text-slate-900">{shipment?.shipper?.city}, {shipment?.shipper?.country || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-slate-900 font-semibold mb-4">Consignee</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-slate-500">Company</p>
                  <p className="text-slate-900">{shipment?.consignee?.company || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Contact</p>
                  <p className="text-slate-900">{shipment?.consignee?.contactName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Email</p>
                  <p className="text-slate-900">{shipment?.consignee?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Phone</p>
                  <p className="text-slate-900">{shipment?.consignee?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500">City</p>
                  <p className="text-slate-900">{shipment?.consignee?.city}, {shipment?.consignee?.country || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Packages & Products Section */}
          {shipment?.packages && shipment.packages.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-slate-900 font-semibold mb-4 flex items-center gap-2">
                <Box className="w-5 h-5" />
                Packages & Products
              </h3>
              <div className="space-y-4">
                {shipment.packages.map((pkg, pkgIdx) => (
                  <div key={pkgIdx} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <h4 className="text-slate-900 font-medium mb-3">Package {pkgIdx + 1}</h4>
                    <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-200 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Type</p>
                        <p className="text-slate-900">{pkg.type || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Dimensions</p>
                        <p className="text-slate-900">{pkg.length} x {pkg.width} x {pkg.height} {pkg.dimUnit || 'cm'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Weight</p>
                        <p className="text-slate-900">{pkg.weight} {pkg.weightUnit || 'kg'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Stackable</p>
                        <p className="text-slate-900">{pkg.stackable ? 'Yes' : 'No'}</p>
                      </div>
                    </div>

                    {/* Products in Package */}
                    {pkg.products && pkg.products.length > 0 && (
                      <div>
                        <h5 className="text-slate-900 font-medium text-sm mb-3">Products</h5>
                        <div className="space-y-3">
                          {pkg.products.map((product, prodIdx) => (
                            <div key={prodIdx} className="bg-white p-3 rounded border border-slate-200 text-sm">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <p className="text-slate-500 text-xs mb-1">Name</p>
                                  <p className="text-slate-900">{product.name || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500 text-xs mb-1">HS Code</p>
                                  <p className="text-slate-900">{product.hsCode || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500 text-xs mb-1">Category</p>
                                  <p className="text-slate-900">{product.category || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500 text-xs mb-1">UOM</p>
                                  <p className="text-slate-900">{product.uom || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500 text-xs mb-1">Quantity</p>
                                  <p className="text-slate-900">{product.qty || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500 text-xs mb-1">Unit Price</p>
                                  <p className="text-slate-900">{product.unitPrice || 'N/A'}</p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-slate-500 text-xs mb-1">Total Value</p>
                                  <p className="text-slate-900">{formatCurrency(product.totalValue || 0, shipment?.currency || currency.code)}</p>
                                </div>
                                {product.description && (
                                  <div className="col-span-2">
                                    <p className="text-slate-500 text-xs mb-1">Description</p>
                                    <p className="text-slate-900">{product.description}</p>
                                  </div>
                                )}
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
          )}

          {/* Documents Section */}
          {shipment?.uploadedDocuments && Object.keys(shipment.uploadedDocuments).length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-slate-900 font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Uploaded Documents
              </h3>
              <div className="space-y-3">
                {Object.entries(shipment.uploadedDocuments).map(([key, doc]) => (
                  <div key={key} className="border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedDocument(expandedDocument === key ? null : key)}
                      className="w-full p-4 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <div className="text-left">
                          <p className="text-slate-900 font-medium">{doc.name || key}</p>
                          {doc.uploadedAt && (
                            <p className="text-slate-500 text-xs">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-slate-200 text-slate-700 text-xs rounded font-medium">
                          {doc.source === 'form' ? 'Form' : 'Chat'}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); setExpandedDocument(expandedDocument === key ? null : key); }}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          View
                        </button>
                        <span className="text-slate-400">{expandedDocument === key ? '−' : '+'}</span>
                      </div>
                    </button>
                    
                    {/* Document Preview */}
                    {expandedDocument === key && (
                      <div className="p-4 bg-white border-t border-slate-200">
                        {doc.content ? (
                          <div className="bg-slate-50 p-4 rounded-lg max-h-64 overflow-y-auto text-sm text-slate-700 whitespace-pre-wrap font-mono">
                            {doc.content}
                          </div>
                        ) : doc.url ? (
                          <div className="bg-slate-50 p-4 rounded-lg">
                            {doc.url.startsWith('data:image') ? (
                              <img 
                                src={doc.url} 
                                alt={doc.name || 'Document'} 
                                className="max-w-full max-h-96 rounded"
                              />
                            ) : (
                              <a 
                                href={doc.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline flex items-center gap-2"
                              >
                                <Download className="w-4 h-4" />
                                View Document
                              </a>
                            )}
                          </div>
                        ) : (
                          <p className="text-slate-500 italic">No preview available</p>
                        )}
                        <button
                          onClick={() => setExpandedDocument(null)}
                          className="mt-4 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Pricing & Receipt */}
        <div className="space-y-6">
          {/* Receipt Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-slate-600" />
              <h3 className="text-slate-900 font-semibold">Pricing Summary</h3>
            </div>

            <div className="space-y-2 text-sm mb-4 pb-4 border-b border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-600">Customs Value</span>
                <span className="text-slate-900">{formatCurrency(shipmentValue, shipment?.currency || currency.code)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Base Price</span>
                <span className="text-slate-900">{formatCurrency(basePrice, shipment?.currency || currency.code)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Service Charge</span>
                <span className="text-slate-900">{formatCurrency(serviceCharge, shipment?.currency || currency.code)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Estimated Clearance</span>
                <span className="text-slate-900">{formatCurrency(customsClearance, shipment?.currency || currency.code)}</span>
              </div>

              {shipment?.pickupType === 'Scheduled Pickup' && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Pickup Charge</span>
                  <span className="text-slate-900">{formatCurrency(pickupCharge, shipment?.currency || currency.code)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="text-slate-900">{formatCurrency(subtotal, shipment?.currency || currency.code)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Tax (18%)</span>
                <span className="text-slate-900">{formatCurrency(tax, shipment?.currency || currency.code)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-lg font-bold mb-6 pb-6 border-b border-slate-200">
              <span className="text-slate-900">Total</span>
              <span className="text-green-600">{formatCurrency(total, shipment?.currency || currency.code)}</span>
            </div>

            <div className="space-y-2 text-xs text-slate-500">
              <p>✓ Payment Completed</p>
              <p>✓ Ready to Ship</p>
              <p className="text-xs text-green-600">All approvals obtained</p>
            </div>
          </div>

          {/* Booking Info */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h4 className="text-blue-900 font-semibold mb-3">Booking Information</h4>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-blue-600">Booking Date</p>
                <p className="text-blue-900">{shipment?.bookingDate ? new Date(shipment.bookingDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-blue-600">AI Score</p>
                <p className="text-blue-900">{shipment?.aiScore || 'N/A'}%</p>
              </div>
              <div>
                <p className="text-blue-600">Currency</p>
                <p className="text-blue-900">{shipment?.currency || currency.code}</p>
              </div>
            </div>
          </div>

          {/* Pickup Information */}
          {shipment?.pickupType && (
            <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
              <h4 className="text-purple-900 font-semibold mb-3">Pickup Information</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-purple-600">Pickup Type</p>
                  <p className="text-purple-900">{shipment.pickupType || 'N/A'}</p>
                </div>
                {shipment.pickupType === 'Scheduled Pickup' && (
                  <>
                    <div>
                      <p className="text-purple-600">Location</p>
                      <p className="text-purple-900">{shipment.pickupLocation || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-purple-600">Pickup Date</p>
                      <p className="text-purple-900">{shipment.pickupDate ? new Date(shipment.pickupDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-purple-600">Time Window</p>
                      <p className="text-purple-900">{formatTimeWithAmPm(shipment.pickupTimeEarliest)} — {formatTimeWithAmPm(shipment.pickupTimeLatest)}</p>
                    </div>
                  </>
                )}
                {shipment.pickupType === 'Drop-off' && (
                  <div>
                    <p className="text-purple-600">Estimated Drop-off Date</p>
                    <p className="text-purple-900">{shipment.estimatedDropoffDate ? new Date(shipment.estimatedDropoffDate).toLocaleDateString() : 'N/A'}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookedShipmentDetails;
