import { useState } from 'react';
import { MessageCircle, Send, X, User } from 'lucide-react';
import { useMessages } from '../hooks/useShipments';
import { shipmentsStore } from '../store/shipmentsStore';

interface ChatPanelProps {
  shipmentId: string;
  userRole: 'shipper' | 'broker';
  userName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatPanel({ shipmentId, userRole, userName, isOpen, onClose }: ChatPanelProps) {
  const messages = useMessages(shipmentId);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    shipmentsStore.addMessage({
      id: `msg-${Date.now()}`,
      shipmentId,
      sender: userRole,
      senderName: userName,
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: 'message'
    });

    setNewMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col z-50">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-blue-600 rounded-t-xl">
        <div className="flex items-center gap-2 text-white">
          <MessageCircle className="w-5 h-5" />
          <h3>Chat - {shipmentId}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-blue-700 p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p>No messages yet</p>
            <p className="text-sm">Start a conversation</p>
          </div>
        )}
        
        {messages.map((message) => {
          const isCurrentUser = message.sender === userRole;
          const isSystem = message.type === 'system' || message.type === 'document-request';
          
          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-lg p-3 ${
                  isSystem
                    ? 'bg-amber-50 border border-amber-200'
                    : isCurrentUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <User className={`w-3 h-3 ${isCurrentUser ? 'text-blue-100' : 'text-slate-500'}`} />
                  <span className={`text-xs ${isCurrentUser ? 'text-blue-100' : 'text-slate-500'}`}>
                    {message.senderName}
                  </span>
                </div>
                <p className="text-sm">{message.message}</p>
                <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-slate-500'}`}>
                  {new Date(message.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
