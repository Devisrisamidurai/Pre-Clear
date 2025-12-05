import { useState, useEffect, useRef } from 'react';
import { X, Send, Paperclip, MessageCircle } from 'lucide-react';
import { shipmentsStore } from '../store/shipmentsStore';

export function ShipmentChatPanel({ shipmentId, isOpen, onClose, userRole, userName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && shipmentId) {
      loadMessages();
      const unsubscribe = shipmentsStore.subscribe(loadMessages);
      return unsubscribe;
    }
  }, [isOpen, shipmentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = () => {
    const msgs = shipmentsStore.getMessages(shipmentId);
    setMessages(msgs);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: `msg-${Date.now()}`,
      shipmentId,
      sender: userRole,
      senderName: userName,
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: 'message'
    };

    shipmentsStore.addMessage(message);
    setNewMessage('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      const message = {
        id: `msg-${Date.now()}`,
        shipmentId,
        sender: userRole,
        senderName: userName,
        message: `📎 Uploaded document: ${file.name}`,
        timestamp: new Date().toISOString(),
        type: 'message'
      };

      shipmentsStore.addMessage(message);
      
      // Also update document in shipment store
      shipmentsStore.uploadDocument(shipmentId, file.name, 'document');
      
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 animate-in slide-in-from-right">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">Shipment Chat</h3>
            <p className="text-blue-100 text-xs">ID: {shipmentId}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 text-sm">No messages yet</p>
            <p className="text-slate-400 text-xs">Start a conversation</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.sender === userRole;
            const isSystemMessage = msg.type === 'system' || msg.type === 'document-request';

            if (isSystemMessage) {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="bg-amber-100 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg text-sm max-w-xs text-center">
                    <p>{msg.message}</p>
                    <p className="text-xs text-amber-600 mt-1">
                      {new Date(msg.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                  <div className={`rounded-lg p-3 ${
                    isOwnMessage 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-slate-200 text-slate-900'
                  }`}>
                    <p className={`text-xs mb-1 ${isOwnMessage ? 'text-blue-100' : 'text-slate-500'}`}>
                      {msg.senderName}
                    </p>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <p className={`text-xs text-slate-400 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors disabled:opacity-50"
            title="Upload document"
          >
            {isUploading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <Paperclip className="w-5 h-5" />
            )}
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {userRole === 'broker' ? 'Request missing documents or communicate with shipper' : 'Upload documents or respond to broker requests'}
        </p>
      </div>
    </div>
  );
}

