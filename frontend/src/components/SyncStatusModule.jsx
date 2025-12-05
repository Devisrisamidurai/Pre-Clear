import { CheckCircle, Clock, FileText, Upload, Shield, AlertTriangle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { shipmentsStore } from '../store/shipmentsStore';

export function SyncStatusModule({ shipmentId, role }) {
  const [shipment, setShipment] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());

  useEffect(() => {
    if (shipmentId) {
      const loadShipment = () => {
        const s = shipmentsStore.getShipmentById(shipmentId);
        if (s) {
          setShipment(s);
          setLastUpdated(new Date().toISOString());
        }
      };
      
      loadShipment();
      const unsubscribe = shipmentsStore.subscribe(loadShipment);
      return unsubscribe;
    }
  }, [shipmentId]);

  if (!shipment) {
    return (
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-slate-900 mb-4">Real-Time Sync Status</h3>
        <p className="text-slate-600 text-sm">Select a shipment to view sync status</p>
      </div>
    );
  }

  const getStatusEvents = () => {
    const events = [];

    // AI Evaluation
    if (shipment.aiApproval === 'approved') {
      events.push({
        id: 'ai-eval',
        label: 'AI evaluation completed',
        status: 'completed',
        timestamp: shipment.aiEvaluatedAt,
        icon: CheckCircle
      });
    } else if (shipment.aiApproval === 'pending') {
      events.push({
        id: 'ai-eval',
        label: 'AI evaluation in progress',
        status: 'in-progress',
        icon: Clock
      });
    } else if (shipment.aiApproval === 'rejected') {
      events.push({
        id: 'ai-eval',
        label: 'AI evaluation failed',
        status: 'action-required',
        timestamp: shipment.aiEvaluatedAt,
        icon: AlertTriangle
      });
    }

    // Broker Approval
    if (shipment.brokerApproval === 'approved') {
      events.push({
        id: 'broker-approval',
        label: 'Broker approval granted',
        status: 'completed',
        timestamp: shipment.brokerReviewedAt,
        icon: CheckCircle
      });
    } else if (shipment.brokerApproval === 'pending') {
      events.push({
        id: 'broker-approval',
        label: 'Broker approval pending',
        status: 'in-progress',
        icon: Clock
      });
    } else if (shipment.brokerApproval === 'documents-requested') {
      events.push({
        id: 'broker-docs',
        label: 'Missing documents requested',
        status: 'action-required',
        timestamp: shipment.brokerReviewedAt,
        icon: AlertTriangle
      });
    } else if (shipment.brokerApproval === 'rejected') {
      events.push({
        id: 'broker-denial',
        label: 'Broker approval denied',
        status: 'action-required',
        timestamp: shipment.brokerReviewedAt,
        icon: X
      });
    }

    // Document Upload Status
    const requestedDocs = shipment.documents.filter(d => d.requested && !d.uploaded);
    if (requestedDocs.length > 0) {
      events.push({
        id: 'docs-upload',
        label: `Shipper uploaded new documents (${requestedDocs.length} pending)`,
        status: 'action-required',
        icon: Upload
      });
    }

    // Final Approval
    if (shipment.token) {
      events.push({
        id: 'final-approval',
        label: 'Final approval granted',
        status: 'completed',
        timestamp: shipment.tokenGeneratedAt,
        icon: Shield
      });
    }

    return events;
  };

  const events = getStatusEvents();

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-50 border-green-200 text-green-700';
      case 'in-progress': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'action-required': return 'bg-red-50 border-red-200 text-red-700';
      case 'pending': return 'bg-slate-50 border-slate-200 text-slate-600';
      default: return 'bg-slate-50 border-slate-200 text-slate-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✓';
      case 'in-progress': return '⏳';
      case 'action-required': return '⚠️';
      case 'pending': return '○';
      default: return '○';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-900">Real-Time Sync Status</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-slate-600 text-sm">Live</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {events.length === 0 ? (
          <div className="text-center py-6">
            <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600 text-sm">Waiting for updates...</p>
          </div>
        ) : (
          events.map((event) => {
            const Icon = event.icon;
            return (
              <div 
                key={event.id} 
                className={`p-3 rounded-lg border ${getStatusColor(event.status)} transition-all`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm mb-1">{event.label}</p>
                    {event.timestamp && (
                      <p className="text-xs opacity-75">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <span className="text-xl flex-shrink-0">
                    {getStatusIcon(event.status)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Last updated</span>
          <span>{new Date(lastUpdated).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}

