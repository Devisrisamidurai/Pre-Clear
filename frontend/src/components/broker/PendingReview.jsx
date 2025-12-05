import { useShipments } from '../../hooks/useShipments';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Eye, MessageCircle } from 'lucide-react';

export function PendingReview({ onNavigate }) {
  const { shipments } = useShipments();

  const pending = shipments.filter(s => s.aiApproval === 'approved' && (s.brokerApproval === 'pending' || s.brokerApproval === 'not-started'));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Pending Review</h1>
        <p className="text-slate-600">Shipments pending broker review</p>
      </div>

      {pending.length === 0 ? (
        <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-200">
          <p className="text-slate-600">No shipments pending review right now.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Shipment ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Shipper</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>AI Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map(s => (
                <TableRow key={s.id} className="hover:bg-slate-50">
                  <TableCell>#{s.id}</TableCell>
                  <TableCell>{s.productName}</TableCell>
                  <TableCell>{s.shipperName}</TableCell>
                  <TableCell>{s.originCountry}</TableCell>
                  <TableCell>{s.aiScore ? `${s.aiScore}%` : '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onNavigate('broker-review', s)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        Review
                      </button>
                      <button className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

