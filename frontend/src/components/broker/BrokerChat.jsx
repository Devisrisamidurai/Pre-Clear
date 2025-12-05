import { MessageSquare } from 'lucide-react';

export function BrokerChat({ onNavigate }) {
  return (
    <div>
      <h1 className="text-slate-900 mb-2">Communication Center</h1>
      <p className="text-slate-600">Chat with shippers about their shipments</p>
      <div className="mt-8 bg-white rounded-xl p-8 border border-slate-200 text-center">
        <MessageSquare className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <p className="text-slate-700">Chat interface with shippers</p>
      </div>
    </div>
  );
}

