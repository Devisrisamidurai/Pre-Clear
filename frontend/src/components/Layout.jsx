import { 
  LayoutDashboard, 
  PackagePlus, 
  Upload,
  Zap,
  UserCheck,
  MessageSquare,
  Shield,
  CreditCard,
  User,
  CheckCircle,
  FileText,
  Users,
  Settings as SettingsIcon,
  BarChart3,
  FileSearch,
  MapPin,
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { useState } from 'react';
import { NotificationPanel } from './NotificationPanel';

export function Layout({ children, userRole, currentPage, onNavigate, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = userRole === 'admin';

  const shipperNav = [
    { id: 'dashboard', label: 'Home Dashboard', icon: LayoutDashboard },
    { id: 'create-shipment', label: 'Create Shipment', icon: PackagePlus },
    { id: 'shipment-token-list', label: 'Shipment Tokens', icon: Shield },
    { id: 'booking', label: 'Shipment Booking', icon: MapPin },
    { id: 'payment-list', label: 'Payments', icon: CreditCard },
    { id: 'profile', label: 'Shipper Profile', icon: User },
  ];

  const brokerNav = [
    { id: 'dashboard', label: 'Broker Dashboard', icon: LayoutDashboard },
    { id: 'pending-review', label: 'Pending Review', icon: FileText },
    { id: 'approved-shipments', label: 'Approved Shipments', icon: CheckCircle },
  ];

  // Admin nav: intentionally does NOT include an "Admin Profile" item
  const adminNav = [
    { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'user-management', label: 'User Management', icon: Users },
    { id: 'import-export-rules', label: 'Import/Export Rules', icon: Shield },
    { id: 'approval-logs', label: 'Approval Logs', icon: FileSearch },
    { id: 'tracking', label: 'Shipment Tracking', icon: MapPin },
  ];

  const getNavItems = () => {
    if (userRole === 'shipper') return shipperNav;
    if (userRole === 'broker') return brokerNav;
    if (userRole === 'admin') return adminNav;
    return shipperNav;
  };

  const getRoleName = () => {
    if (userRole === 'shipper') return 'Shipper';
    if (userRole === 'broker') return 'Customs Broker';
    if (userRole === 'admin') return 'Admin / UPS Operations';
    return 'User';
  };

  const getRoleColor = () => {
    if (userRole === 'shipper') return 'blue';
    if (userRole === 'broker') return 'purple';
    if (userRole === 'admin') return 'orange';
    return 'blue';
  };

  const navItems = getNavItems();
  const roleColor = getRoleColor();

  const isFixedSidebar = isAdmin || userRole === 'broker';
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Map role -> profile route (used when clicking the user card)
  const profileRouteForRole = () => {
    if (userRole === 'admin') return 'admin-profile';
    return 'profile'; // shipper & broker use 'profile'
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg border border-slate-200"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${isFixedSidebar ? 'fixed' : 'static'} w-72 flex flex-col transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={isFixedSidebar ? { top: 0, left: 0, height: '100vh', background: '#3A2B28', borderRight: '1px solid rgba(0,0,0,0.12)' } : undefined}
      >
        {/* Logo */}
        <div className="p-6 border-b" style={isAdmin ? { borderColor: 'rgba(255,255,255,0.06)' } : undefined}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl" style={isFixedSidebar ? { color: '#FFF8EE' } : { color: '#0f172a' }}>Pre-Clear</h1>
              <p className="text-xs" style={isFixedSidebar ? { color: '#EADFD8' } : { color: '#6b7280' }}>Customs Compliance</p>
            </div>
          </div>
        </div>

        {/* Role Badge */}
        <div className="px-6 py-4" style={isFixedSidebar ? { borderBottom: '1px solid rgba(255,255,255,0.06)' } : { borderBottom: '1px solid rgba(226,232,240,1)' }}>
          <div className={`px-4 py-2 rounded-lg`} style={isFixedSidebar ? { background: '#3a2b28', border: '1px solid rgba(255,255,255,0.04)' } : undefined}>
            <p className="text-xs mb-1" style={isFixedSidebar ? { color: '#EADFD8' } : { color: '#64748b' }}>Signed in as</p>
            <p style={isFixedSidebar ? { color: '#FFF8EE' } : undefined}>{getRoleName()}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2" style={{ overflow: 'visible' }}>
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm ${isActive ? 'active' : ''}`}
                  style={isFixedSidebar ? (isActive ? { background: '#3a2b28', color: '#FFF8EE', border: '1px solid rgba(255,255,255,0.04)' } : { color: '#FFF8EE' }) : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" style={isFixedSidebar ? { color: '#FFF8EE' } : undefined} />
                  <span className="truncate" style={isFixedSidebar ? { fontSize: '0.95rem' } : undefined}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Profile - clicking card navigates to the appropriate profile page
            (admin -> 'admin-profile', broker/shipper -> 'profile') */}
        <div className="p-4 border-t border-slate-200">
          {/* For broker: show avatar + bell that toggles notifications; do not navigate to profile from sidebar */}
          <div className="w-full mb-3">
            <div
              onClick={() => { onNavigate(profileRouteForRole()); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer"
              style={isFixedSidebar ? { background: 'transparent' } : { background: 'rgba(248,250,252,1)' }}
              aria-label="Open profile"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center`} style={isFixedSidebar ? { background: '#FFF8EE' } : undefined}>
                <User className={`w-5 h-5`} style={isFixedSidebar ? { color: '#2F1B17' } : undefined} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm truncate" style={isFixedSidebar ? { color: '#FFF8EE' } : undefined}>Demo User</p>
                <p className="text-xs truncate" style={isFixedSidebar ? { color: '#EADFD8' } : undefined}>{getRoleName()}</p>
              </div>
              <div>
                {!isAdmin && (
                  <button
                    aria-label="Notifications"
                    className="p-2 rounded"
                    onClick={(e) => { e.stopPropagation(); setNotificationsOpen(open => !open); }}
                    /* NOTE: notification count removed — button only shows bell icon now */
                  >
                    <Bell className="w-4 h-4 text-slate-200" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Notifications popover for broker */}
      {notificationsOpen && userRole === 'broker' && (
        <div style={{ position: 'fixed', top: 80, left: 288, zIndex: 60 }}>
          <NotificationPanel role="broker" fullList={true} onNavigate={(page, payload) => { setNotificationsOpen(false); onNavigate(page, payload); }} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto" style={isFixedSidebar ? { marginLeft: 288 } : undefined}>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
        />
      )}
    </div>
  );
}

export default Layout;
