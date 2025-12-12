import React from 'react';
import { ShipmentChatPanel } from '../ShipmentChatPanel';

export function ChatNotifications({ shipment, onNavigate }) {
  const shipmentId = shipment?.id;

  const handleClose = () => {
    // navigate back to dashboard when chat closed
    onNavigate && onNavigate('dashboard');
  };

  return (
    <ShipmentChatPanel
      shipmentId={shipmentId}
      isOpen={true}
      onClose={handleClose}
      userRole="shipper"
      userName={shipment?.shipperName || 'Shipper'}
    />
  );
}

export default ChatNotifications;
