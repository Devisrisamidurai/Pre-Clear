export function AIEvaluationStatus({ shipment, onNavigate }) {
  return (
    <div>
      <h1 className="text-slate-900 mb-2">AI Evaluation Status</h1>
      <p className="text-slate-600">AI evaluation status for shipment {shipment?.id || 'N/A'}</p>
    </div>
  );
}

