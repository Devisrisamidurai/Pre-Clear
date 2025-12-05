import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatPanel } from './ChatPanel';

interface FloatingChatButtonProps {
  userRole: 'shipper' | 'broker';
  shipmentId?: string;
  userName: string;
}

export function FloatingChatButton({ userRole, shipmentId, userName }: FloatingChatButtonProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Only show if there's an active shipment
  if (!shipmentId) return null;

  return (
    <>
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-40"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
          2
        </span>
      </button>

      <ChatPanel
        shipmentId={shipmentId}
        userRole={userRole}
        userName={userName}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
}
