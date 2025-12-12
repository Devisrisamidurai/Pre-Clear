import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { useShipments } from '../../hooks/useShipments';
import { getCurrencyByCountry, formatCurrency } from '../../utils/validation';

export function BookedPaidShipments({ onNavigate }) {
  const { shipments: allShipments } = useShipments();
  const [list, setList] = useState([]);

  useEffect(() => {
    const filtered = allShipments.filter(s =>
      s.paymentStatus === 'completed' ||
      s.status === 'payment-completed' ||
      s.status === 'ready-for-booking' ||
      !!s.bookingDate
    );
    setList(filtered);
  }, [allShipments]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-slate-900 text-2xl font-bold">Booked & Paid Shipments</h1>
        <p className="text-slate-600 mt-1">List of shipments that are booked and/or paid.</p>
      </div>

      {list.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
          <p className="text-slate-600">No booked or paid shipments found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-3 text-left">Shipment ID</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Route</th>
                  <th className="p-3 text-left">Value</th>
                  <th className="p-3 text-left">Payment</th>
                  <th className="p-3 text-left">Booking Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((s) => {
                  const currency = getCurrencyByCountry(s.shipper?.country || s.originCountry || 'US');
                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3">#{s.id}</td>
                      <td className="p-3">{s.title || s.productName || 'N/A'}</td>
                      <td className="p-3"><strong>{s.shipper?.city || s.shipper?.country || 'N/A'}</strong> → <strong>{s.consignee?.city || s.consignee?.country || 'N/A'}</strong></td>
                      <td className="p-3">{formatCurrency(s.value || 0, s.currency || currency.code)}</td>
                      <td className="p-3">{s.paymentStatus || 'N/A'}</td>
                      <td className="p-3">{s.bookingDate ? new Date(s.bookingDate).toLocaleDateString() : 'N/A'}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onNavigate('booked-shipment-details', s)}
                          className="px-3 py-1.5 bg-yellow-500 text-yellow-900 rounded-lg hover:bg-yellow-600 text-sm flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookedPaidShipments;
