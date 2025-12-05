export function RequestDocuments({ shipment, onNavigate }) {
  return (
    <div>
      <h1 className="text-slate-900 mb-2">Request Missing Documents</h1>
      <p className="text-slate-600">Send document request to shipper</p>
      <div className="mt-8 max-w-2xl bg-white rounded-xl p-8 border border-slate-200">
        <textarea
          placeholder="Specify which documents are needed..."
          className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-4"
          rows={4}
        />
        <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          Send Request
        </button>
      </div>
    </div>
  );
}

