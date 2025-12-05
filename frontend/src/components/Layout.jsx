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

export function Layout({ children, userRole, currentPage, onNavigate, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { id: 'profile', label: 'Broker Profile', icon: User },
  ];

  const adminNav = [
    { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'user-management', label: 'User Management', icon: Users },
    { id: 'import-export-rules', label: 'Import/Export Rules', icon: Shield },
    { id: 'system-config', label: 'System Configuration', icon: SettingsIcon },
    { id: 'ai-monitoring', label: 'AI Rules Monitoring', icon: BarChart3 },
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

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg border border-slate-200"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-slate-900" />
            </div>
            <div>
              <h1 className="text-slate-900 text-xl">UPS Pre-Clear</h1>
              <p className="text-slate-500 text-xs">Customs Compliance</p>
            </div>
          </div>
        </div>

        {/* Role Badge */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className={`px-4 py-2 bg-${roleColor}-50 border border-${roleColor}-200 rounded-lg`}>
            <p className="text-slate-600 text-xs mb-1">Signed in as</p>
            <p className={`text-${roleColor}-700`}>{getRoleName()}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
                    isActive
                      ? `bg-${roleColor}-50 text-${roleColor}-700 border border-${roleColor}-200`
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg mb-3">
            <div className={`w-10 h-10 bg-${roleColor}-100 rounded-full flex items-center justify-center`}>
              <User className={`w-5 h-5 text-${roleColor}-600`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-900 text-sm truncate">Demo User</p>
              <p className="text-slate-500 text-xs truncate">{getRoleName()}</p>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-4 h-4 text-slate-400" />
            </button>
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

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
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

