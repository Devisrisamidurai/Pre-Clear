import { useState } from 'react';
import { CheckCircle, FileText, Eye } from 'lucide-react';
import { useShipments } from '../../hooks/useShipments';

export function ApprovedShipments({ onNavigate }) {
  const { shipments } = useShipments();
  const approved = shipments.filter(s => s.brokerApproval === 'approved');

  return (
    <div style={{ background: '#FBF9F6', minHeight: '100vh', padding: 24 }}>
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Approved Shipments</h1>
        <p className="text-slate-600">All shipments you have approved</p>
      </div>

      {approved.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-slate-900 mb-2">No Approved Shipments</h3>
          <p className="text-slate-600">You haven't approved any shipments yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {approved.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-slate-900 text-xl">Shipment {s.id}</h3>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Approved
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm">Submitted: {s.date}</p>
                  </div>
                  <button
                    onClick={() => onNavigate('broker-review', { ...s, readOnly: true })}
                    className="px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    style={{ background: '#E6B800', color: '#2F1B17', border: '2px solid #2F1B17' }}
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Product</p>
                    <p className="text-slate-900">{s.productName}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Route</p>
                    <p className="text-slate-900">{s.originCountry} → {s.destCountry}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Value</p>
                    <p className="text-slate-900">{s.value}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm mb-1">HS Code</p>
                    <p className="text-slate-900">{s.hsCode}</p>
                  </div>
                </div>
              </div>

              {/* Details view moved to the broker review page via navigation */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
