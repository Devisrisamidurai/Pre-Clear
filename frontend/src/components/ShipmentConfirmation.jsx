import { CheckCircle, Download, Package, MapPin, Truck } from 'lucide-react';

interface ShipmentConfirmationProps {
  bookingData: any;
  onNavigate: (page: string) => void;
}

export function ShipmentConfirmation({ bookingData, onNavigate }: ShipmentConfirmationProps) {
  const shipmentId = `SHP-${Date.now().toString().slice(-8)}`;
  const trackingNumber = `TRK-${Date.now().toString().slice(-10)}`;

  return (
    <div>
      {/* Success Header */}
      <div className="mb-8 text-center">
        <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
          <CheckCircle className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-slate-900 mb-3">Shipment Booked Successfully! 🎉</h1>
        <p className="text-slate-600">Your shipment is confirmed and will be picked up soon</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Shipment Details Card */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-blue-100 text-sm mb-2">Shipment ID</p>
              <p className="text-2xl font-mono">{shipmentId}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-2">Tracking Number</p>
              <p className="text-2xl font-mono">{trackingNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-blue-100 text-sm mb-1">Pre-Clear Token</p>
              <p className="font-mono">{bookingData?.tokenId || 'PCT-12345678'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-blue-100 text-sm mb-1">Carrier</p>
              <p>{bookingData?.carrier || 'DHL Express'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-blue-100 text-sm mb-1">Delivery Speed</p>
              <p className="capitalize">{bookingData?.deliverySpeed || 'Standard'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-blue-100 text-sm mb-1">Status</p>
              <p>✓ Confirmed</p>
            </div>
          </div>
        </div>

        {/* Booking Status */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-slate-900 mb-6">Booking Status</h2>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-slate-900 mb-1">Booked</p>
              <p className="text-slate-500 text-sm">Confirmed</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-slate-900 mb-1">Preparing</p>
              <p className="text-slate-500 text-sm">In Progress</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-700 mb-1">Picked Up</p>
              <p className="text-slate-400 text-sm">Pending</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-700 mb-1">Delivered</p>
              <p className="text-slate-400 text-sm">Pending</p>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-slate-900 mb-6">Tracking Timeline</h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 w-px bg-slate-200 mt-2"></div>
              </div>
              <div className="flex-1 pb-8">
                <p className="text-slate-900 mb-1">Booking Confirmed</p>
                <p className="text-slate-600 text-sm">Your shipment has been booked successfully</p>
                <p className="text-slate-500 text-xs mt-1">Dec 3, 2024 - 10:30 AM</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 w-px bg-slate-200 mt-2"></div>
              </div>
              <div className="flex-1 pb-8">
                <p className="text-slate-900 mb-1">Preparing for Pickup</p>
                <p className="text-slate-600 text-sm">Package is being prepared at origin</p>
                <p className="text-slate-500 text-xs mt-1">Expected: Dec 3, 2024 - 2:00 PM</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1 w-px bg-slate-200 mt-2"></div>
              </div>
              <div className="flex-1 pb-8">
                <p className="text-slate-700 mb-1">Pickup Scheduled</p>
                <p className="text-slate-500 text-sm">Carrier will pick up the package</p>
                <p className="text-slate-400 text-xs mt-1">Expected: Dec 4, 2024 - 10:00 AM</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-slate-400" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-slate-700 mb-1">Estimated Delivery</p>
                <p className="text-slate-500 text-sm">Package will be delivered</p>
                <p className="text-slate-400 text-xs mt-1">Expected: Dec 10, 2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-slate-900 mb-4">Download Documents</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
              <Download className="w-6 h-6 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-900">Shipping Labels</p>
            </button>

            <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
              <Download className="w-6 h-6 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-900">Invoice</p>
            </button>

            <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
              <Download className="w-6 h-6 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-900">Customs Documents</p>
            </button>
          </div>
        </div>

        {/* Shipment Summary */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-slate-900 mb-4">Shipment Summary</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-slate-900 mb-3">Pickup Address</h3>
              <div className="text-slate-600 text-sm space-y-1">
                <p>{bookingData?.pickupAddress || '123 Manufacturing Street'}</p>
                <p>{bookingData?.pickupCity || 'Shenzhen'}, {bookingData?.pickupPostal || '518000'}</p>
                <p>🇨🇳 China</p>
              </div>
            </div>

            <div>
              <h3 className="text-slate-900 mb-3">Delivery Address</h3>
              <div className="text-slate-600 text-sm space-y-1">
                <p>{bookingData?.destAddress || '456 Business Park'}</p>
                <p>{bookingData?.destCity || 'Mumbai'}, {bookingData?.destPostal || '400001'}</p>
                <p>🇮🇳 India</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-slate-600 text-sm mb-1">Weight</p>
                <p className="text-slate-900">{bookingData?.weight || '5'} kg</p>
              </div>
              <div>
                <p className="text-slate-600 text-sm mb-1">Dimensions</p>
                <p className="text-slate-900">
                  {bookingData?.length || '30'}×{bookingData?.width || '20'}×{bookingData?.height || '15'} cm
                </p>
              </div>
              <div>
                <p className="text-slate-600 text-sm mb-1">Amount Paid</p>
                <p className="text-slate-900">₹{bookingData?.pricing?.totalINR?.toFixed(2) || '0.00'}</p>
              </div>
              <div>
                <p className="text-slate-600 text-sm mb-1">Payment Method</p>
                <p className="text-slate-900 capitalize">UPI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            Go to Dashboard
          </button>

          <button className="px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
            Track Shipment
          </button>
        </div>

        {/* Support */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <p className="text-slate-700 mb-2">Need help with your shipment?</p>
          <p className="text-blue-600">Contact support@preclear.com or call +91 1800-123-4567</p>
        </div>
      </div>
    </div>
  );
}
