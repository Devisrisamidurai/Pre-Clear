import { useState, useEffect, useRef } from 'react';
import { X, Send, Paperclip, MessageCircle } from 'lucide-react';
import { shipmentsStore } from '../store/shipmentsStore';

const COLORS = {
  cream: '#FBF9F6',
  coffee: '#4A2C2A',
  coffeeLight: '#7A5B52',
  coffeeBorder: '#4A2C2A20'
};

export function ShipmentChatPanel({ shipmentId, isOpen, onClose, userRole, userName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [chatViewingFile, setChatViewingFile] = useState(null);
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = () => {
    setMessages(shipmentsStore.getMessages(shipmentId));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setIsUploading(true);

    // Simulate upload
    setTimeout(() => {
      const msg = {
        id: `msg-${Date.now()}`,
        shipmentId,
        sender: userRole,
        senderName: userName,
        message: '',
        fileName: file.name,
        fileType: file.type,
        timestamp: new Date().toISOString(),
        type: 'file'
      };

      // Add chat message
      shipmentsStore.addMessage(msg);

      // Also persist uploaded document metadata on the shipment (for details view)
      const shipment = shipmentsStore.getShipmentById(shipmentId) || {};
      shipment.uploadedDocuments = shipment.uploadedDocuments || {};
      // Use filename as key (demo). In real app use stable id or storage key.
      const key = file.name.replace(/\s+/g, '_');
      shipment.uploadedDocuments[key] = {
        uploaded: true,
        name: file.name,
        uploadedAt: new Date().toISOString(),
        fileType: file.type
      };
      shipmentsStore.saveShipment(shipment);

      setIsUploading(false);
      // clear input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 900);
  };

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
    <div
      className="fixed inset-y-0 right-0 w-full md:w-96 shadow-2xl z-50 flex flex-col border-l animate-in slide-in-from-right"
      style={{ background: COLORS.cream, borderColor: COLORS.coffee }}
    >

      {/* Header */}
      <div className="p-4 flex items-center justify-between" style={{ background: COLORS.coffee }}>
        <div className="flex items-center gap-3 text-white">
          <MessageCircle className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">Shipment Chat</h3>
            <p className="text-xs opacity-80">ID: {shipmentId}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => {
          const own = msg.sender === userRole;

          return (
            <div key={msg.id} className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-xs">
                <div
                  className="rounded-lg p-3"
                  style={{
                    background: own ? COLORS.coffee : '#fff',
                    color: own ? '#fff' : COLORS.coffee,
                    border: own ? 'none' : `1px solid ${COLORS.coffeeBorder}`
                  }}
                >
                  <p className="text-xs opacity-70 mb-1">{msg.senderName}</p>
                  {msg.type === 'file' ? (
                    <div>
                      <button
                        onClick={() => setChatViewingFile(msg)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {msg.fileName}
                      </button>
                      <p className="text-xs text-slate-400 mt-1">File uploaded</p>
                    </div>
                  ) : (
                    <p className="text-sm">{msg.message}</p>
                  )}
                </div>
                <p className="text-xs mt-1 text-right" style={{ color: COLORS.coffeeLight }}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t" style={{ borderColor: COLORS.coffee }}>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 flex items-center justify-center rounded-lg"
            style={{ background: COLORS.cream, color: COLORS.coffee }}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg border focus:outline-none"
            style={{ borderColor: COLORS.coffeeBorder }}
          />

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-white"
            style={{ background: COLORS.coffeeLight }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* Chat file viewer modal */}
      {chatViewingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900">{chatViewingFile.fileName}</h3>
              <button onClick={() => setChatViewingFile(null)} className="text-slate-500">Close</button>
            </div>
            <p className="text-slate-600 text-sm mb-4">Preview not available in demo. You can download the file below.</p>
            <div className="flex justify-end">
              <a href="#" onClick={(e) => { e.preventDefault(); alert(`Downloading ${chatViewingFile.fileName} for shipment ${chatViewingFile.shipmentId || shipmentId}`); }} className="px-4 py-2 rounded-lg" style={{ background: '#2563EB', color: '#ffffff', border: '2px solid #1E40AF' }}>Download</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
