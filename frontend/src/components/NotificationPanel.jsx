import { Bell, Package, CheckCircle, XCircle, FileText, MessageCircle, Settings, X } from 'lucide-react';
import { useNotifications } from '../hooks/useShipments';
import { shipmentsStore } from '../store/shipmentsStore';
import { useEffect, useState } from 'react';

export function NotificationPanel({ role, onNavigate }) {
  const { notifications } = useNotifications(role);
  const [viewedNotifications, setViewedNotifications] = useState(() => {
    // Load from localStorage on mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`viewed-notifications-${role}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });
  const [closedNotifications, setClosedNotifications] = useState(() => {
    // Load from localStorage on mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`closed-notifications-${role}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });

  // Persist viewedNotifications to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`viewed-notifications-${role}`, JSON.stringify([...viewedNotifications]));
    }
  }, [viewedNotifications, role]);

  // Persist closedNotifications to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`closed-notifications-${role}`, JSON.stringify([...closedNotifications]));
    }
  }, [closedNotifications, role]);

  // Auto-dismiss viewed notifications after 3 seconds
  useEffect(() => {
    const timers = [];
    
    notifications.forEach((notification) => {
      if (!notification.read && !viewedNotifications.has(notification.id) && !closedNotifications.has(notification.id)) {
        const timer = setTimeout(() => {
          setViewedNotifications(prev => new Set([...prev, notification.id]));
          shipmentsStore.markNotificationAsRead(notification.id);
        }, 3000);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications, viewedNotifications, closedNotifications]);

  const handleNotificationClick = (notification) => {
    // Mark as viewed immediately on click
    setViewedNotifications(prev => new Set([...prev, notification.id]));
    shipmentsStore.markNotificationAsRead(notification.id);
    
    if (role === 'broker' && notification.type === 'broker-approval-request') {
      const shipment = shipmentsStore.getShipmentById(notification.shipmentId);
      onNavigate('broker-review', shipment);
    } else if (role === 'shipper' && notification.type === 'documents-requested') {
      const shipment = shipmentsStore.getShipmentById(notification.shipmentId);
      onNavigate('shipment-details', shipment);
    } else if (notification.shipmentId) {
      const shipment = shipmentsStore.getShipmentById(notification.shipmentId);
      onNavigate('shipment-details', shipment);
    }
  };

  const handleCloseNotification = (notificationId, e) => {
    e.stopPropagation();
    setClosedNotifications(prev => new Set([...prev, notificationId]));
    shipmentsStore.markNotificationAsRead(notificationId);
  };

  // Filter out viewed and closed notifications
  const activeNotifications = notifications.filter(n => 
    !viewedNotifications.has(n.id) && !closedNotifications.has(n.id)
  );
  const unreadCount = activeNotifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'broker-approval-request':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'shipment-created':
        return <Package className="w-5 h-5 text-green-600" />;
      case 'ai-completed':
        return <CheckCircle className="w-5 h-5 text-purple-600" />;
      case 'broker-approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'broker-denied':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'documents-requested':
        return <FileText className="w-5 h-5 text-amber-600" />;
      case 'chat-message':
        return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'admin-update':
        return <Settings className="w-5 h-5 text-slate-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  if (activeNotifications.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-slate-900" />
        <h2 className="text-slate-900">Recent Notifications</h2>
        {unreadCount > 0 && (
          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {activeNotifications.slice(0, 5).map((notification) => (
          <button
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={`w-full p-3 rounded-lg border ${
              notification.read
                ? 'border-slate-200 bg-white'
                : 'border-blue-200 bg-blue-50'
            } hover:shadow-md transition-all text-left`}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-slate-900 text-sm">{notification.title}</p>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                  )}
                </div>
                <p className="text-slate-600 text-xs mb-1">{notification.message}</p>
                <p className="text-slate-500 text-xs">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              </div>
              <button
                onClick={(e) => handleCloseNotification(notification.id, e)}
                className="text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

