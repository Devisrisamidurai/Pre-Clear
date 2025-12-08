import { useState, useEffect } from 'react';
import { PackagePlus, Upload, Zap, MessageCircle, UserCheck, Shield, TrendingUp, CheckCircle, ArrowRight, Activity, Users, Globe, Package, Scale, Ban, FileCheck, Settings, AlertTriangle, XCircle, Clock, Send } from 'lucide-react';
import { useShipments } from '../hooks/useShipments';

export function WorkflowDiagram() {
  const { shipments, importExportRules } = useShipments();
  const [syncStatus, setSyncStatus] = useState('synced');
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  
  // Simulate real-time sync
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus('syncing');
      setTimeout(() => setSyncStatus('synced'), 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Calculate validation stats from recent shipments
  const recentShipment = shipments[0];
  const validationStats = {
    rulesCheck: recentShipment?.aiResults?.find(r => r.category === 'rules')?.status || 'passed',
    bannedProducts: recentShipment?.aiResults?.find(r => r.category === 'product')?.status || 'passed',
    constraints: recentShipment?.aiResults?.find(r => r.category === 'constraints')?.status || 'passed',
  };
  const steps = [
    {
      icon: PackagePlus,
      title: 'Create Shipment',
      description: 'Shipper enters product details',
      role: 'shipper',
      color: 'blue'
    },
    {
      icon: Upload,
      title: 'Upload Documents',
      description: 'Shipper uploads required documents',
      role: 'shipper',
      color: 'blue'
    },
    {
      icon: Zap,
      title: 'AI Pre-Validation',
      description: 'AI validates rules, products, codes, constraints',
      role: 'system',
      color: 'purple'
    },
    {
      icon: MessageCircle,
      title: 'Request Broker Review',
      description: 'Shipper sends approval request to Broker',
      role: 'shipper',
      color: 'blue'
    },
    {
      icon: UserCheck,
      title: 'Broker Review',
      description: 'Broker reviews and approves/requests docs',
      role: 'broker',
      color: 'green'
    },
    {
      icon: MessageCircle,
      title: 'Real-time Chat',
      description: 'Two-way communication if needed',
      role: 'both',
      color: 'amber'
    },
    {
      icon: Shield,
      title: 'Token Generated',
      description: 'Pre-clear token issued after approval',
      role: 'system',
      color: 'green'
    },
    {
      icon: CheckCircle,
      title: 'Shipment Booking',
      description: 'Final booking and payment',
      role: 'shipper',
      color: 'blue'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Sync Status */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-slate-900 text-2xl mb-2">Complete Pre-Clear Workflow</h2>
            <p className="text-slate-600">
              End-to-end process with real-time sync between Shipper, Broker, and Admin
            </p>
          </div>
          
          {/* Real-time Sync Status Module */}
          <div className="bg-white rounded-xl px-6 py-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Activity className={`w-6 h-6 ${syncStatus === 'syncing' ? 'text-blue-600 animate-pulse' : 'text-green-600'}`} />
                {syncStatus === 'synced' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                )}
              </div>
              <div>
                <p className="text-slate-900 text-sm">Sync Status</p>
                <p className={`text-xs ${syncStatus === 'syncing' ? 'text-blue-600' : 'text-green-600'}`}>
                  {syncStatus === 'syncing' ? 'Syncing...' : 'All roles synchronized'}
                </p>
              </div>
            </div>
          </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const bgColor = 
            step.color === 'blue' ? 'bg-blue-100' :
            step.color === 'purple' ? 'bg-purple-100' :
            step.color === 'green' ? 'bg-green-100' :
            step.color === 'amber' ? 'bg-amber-100' : 'bg-slate-100';
          
          const iconColor = 
            step.color === 'blue' ? 'text-blue-600' :
            step.color === 'purple' ? 'text-purple-600' :
            step.color === 'green' ? 'text-green-600' :
            step.color === 'amber' ? 'text-amber-600' : 'text-slate-600';
          
          const roleLabel = 
            step.role === 'shipper' ? 'Shipper' :
            step.role === 'broker' ? 'Broker' :
            step.role === 'both' ? 'Shipper ↔ Broker' :
            'System';
          
          return (
            <div key={index} className="relative">
              <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm mb-3">{step.description}</p>
                <span className={`px-2 py-1 ${bgColor} ${iconColor} rounded text-xs`}>
                  {roleLabel}
                </span>
              </div>
              
              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-slate-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-blue-900 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Real-time Sync
            </h4>
            <p className="text-blue-700 text-sm">
              All shipment updates instantly sync across Shipper, Broker, and Admin interfaces
            </p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-purple-900 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              AI Validation
            </h4>
            <p className="text-purple-700 text-sm">
              Comprehensive AI checks against Admin-configured import/export rules
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-green-900 mb-2 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Two-way Chat
            </h4>
            <p className="text-green-700 text-sm">
              Real-time communication between Shipper and Broker throughout the process
            </p>
          </div>
        </div>
      </div>

      {/* Shipper ↔ Broker Sync Status Module */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-slate-900">Shipper ↔ Broker Synchronization</h3>
              <p className="text-slate-600 text-sm">Real-time collaboration status across roles</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full ${
            syncStatus === 'synced' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {syncStatus === 'synced' ? '✓ Synchronized' : '↻ Syncing...'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-900">Shipper Updates</span>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            </div>
            <p className="text-blue-700 text-sm mb-3">Last sync: Just now</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4" />
                <span>Documents uploaded</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4" />
                <span>Shipment details synced</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-900">Broker Updates</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <p className="text-green-700 text-sm mb-3">Last sync: Just now</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle className="w-4 h-4" />
                <span>Review status updated</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle className="w-4 h-4" />
                <span>Approval synced</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-900">Admin Updates</span>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            </div>
            <p className="text-purple-700 text-sm mb-3">Last sync: Just now</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-purple-800">
                <CheckCircle className="w-4 h-4" />
                <span>Rules updated</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-800">
                <CheckCircle className="w-4 h-4" />
                <span>Monitoring active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Chat Widget */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-slate-900">Shipper ↔ Broker Communication</h3>
              <p className="text-slate-600 text-sm">Real-time chat for collaboration</p>
            </div>
          </div>
          <button
            onClick={() => setShowChat(!showChat)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            {showChat ? 'Hide Chat' : 'Open Chat'}
          </button>
        </div>

        {showChat && (
          <div className="mt-4 border border-slate-200 rounded-lg">
            {/* Chat Messages */}
            <div className="bg-slate-50 p-4 h-64 overflow-y-auto space-y-3">
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-600 text-sm">Shipper</span>
                  <span className="text-slate-400 text-xs">2 hours ago</span>
                </div>
                <p className="text-slate-700 text-sm">Documents have been uploaded for review.</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-600 text-sm">Broker</span>
                  <span className="text-slate-400 text-xs">1 hour ago</span>
                </div>
                <p className="text-slate-700 text-sm">Reviewing your shipment. Will update status shortly.</p>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-slate-200 bg-white rounded-b-lg">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-[#E6B800] text-[#2F1B17] rounded-lg hover:bg-[#D4A700] transition-colors">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {!showChat && (
          <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-slate-900">3 active conversations</p>
                  <p className="text-slate-600 text-sm">2 unread messages from broker</p>
                </div>
              </div>
              <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center">
                2
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin Panel Section for Import/Export Rules */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-slate-900">Admin Import/Export Rules Management</h3>
              <p className="text-slate-600 text-sm">Country-wise regulations and compliance requirements</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm">
            {importExportRules.length} Active Rules
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {importExportRules.slice(0, 4).map((rule) => (
            <div key={rule.id} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-slate-900 mb-1">{rule.country} - {rule.productCategory}</h4>
                  <p className="text-slate-600 text-sm">HS Code: {rule.hsCodeRange}</p>
                </div>
                <Globe className="w-5 h-5 text-purple-600" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span className="text-slate-700">{rule.requiredDocuments.length} required docs</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Ban className="w-4 h-4 text-red-600" />
                  <span className="text-slate-700">{rule.bannedProducts.length} banned items</span>
                </div>
                {rule.maxValue && (
                  <div className="flex items-center gap-2 text-sm">
                    <Scale className="w-4 h-4 text-amber-600" />
                    <span className="text-slate-700">Max value: ${rule.maxValue}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-3 pt-3 border-t border-purple-200">
                <p className="text-xs text-purple-700">
                  Updated: {new Date(rule.lastUpdated).toLocaleDateString()} by {rule.updatedBy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Import/Export Validation Module */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-slate-900">Import/Export Compliance Validation</h3>
            <p className="text-slate-600 text-sm">Real-time validation against country-specific regulations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`rounded-lg p-4 border-2 ${
            validationStats.rulesCheck === 'passed' 
              ? 'bg-green-50 border-green-200' 
              : validationStats.rulesCheck === 'warning'
              ? 'bg-amber-50 border-amber-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <Globe className={`w-5 h-5 ${
                validationStats.rulesCheck === 'passed' ? 'text-green-600' :
                validationStats.rulesCheck === 'warning' ? 'text-amber-600' :
                'text-red-600'
              }`} />
              {validationStats.rulesCheck === 'passed' && <CheckCircle className="w-5 h-5 text-green-600" />}
              {validationStats.rulesCheck === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
              {validationStats.rulesCheck === 'failed' && <XCircle className="w-5 h-5 text-red-600" />}
            </div>
            <h4 className="text-slate-900 mb-2">Import/Export Rules</h4>
            <p className={`text-sm mb-3 ${
              validationStats.rulesCheck === 'passed' ? 'text-green-700' :
              validationStats.rulesCheck === 'warning' ? 'text-amber-700' :
              'text-red-700'
            }`}>
              {validationStats.rulesCheck === 'passed' 
                ? 'All regulations verified' 
                : validationStats.rulesCheck === 'warning'
                ? 'Some constraints exceeded'
                : 'Validation failed'}
            </p>
            <div className={`px-3 py-1 rounded-full text-xs inline-block ${
              validationStats.rulesCheck === 'passed' ? 'bg-green-100 text-green-700' :
              validationStats.rulesCheck === 'warning' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              {validationStats.rulesCheck.toUpperCase()}
            </div>
          </div>

          <div className={`rounded-lg p-4 border-2 ${
            validationStats.rulesCheck === 'passed' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <FileCheck className="w-5 h-5 text-blue-600" />
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="text-slate-900 mb-2">Documentation Check</h4>
            <p className="text-green-700 text-sm mb-3">
              All required documents verified
            </p>
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs inline-block">
              PASSED
            </div>
          </div>

          <div className={`rounded-lg p-4 border-2 ${
            validationStats.rulesCheck === 'passed' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <Package className="w-5 h-5 text-purple-600" />
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="text-slate-900 mb-2">HS Code Validation</h4>
            <p className="text-green-700 text-sm mb-3">
              HS code correctly formatted
            </p>
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs inline-block">
              PASSED
            </div>
          </div>
        </div>
      </div>

      {/* Blocked/Banned Products Validation */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Ban className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="text-slate-900">Banned/Blocked Products Detection</h3>
            <p className="text-slate-600 text-sm">Automatic screening against restricted items database</p>
          </div>
        </div>

        <div className={`rounded-lg p-6 border-2 ${
          validationStats.bannedProducts === 'passed' 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              validationStats.bannedProducts === 'passed' 
                ? 'bg-green-100' 
                : 'bg-red-100'
            }`}>
              {validationStats.bannedProducts === 'passed' ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
            </div>
            <div className="flex-1">
              <h4 className={`text-xl mb-2 ${
                validationStats.bannedProducts === 'passed' ? 'text-green-900' : 'text-red-900'
              }`}>
                {validationStats.bannedProducts === 'passed' 
                  ? 'No Banned Products Detected' 
                  : 'Restricted Product Detected'}
              </h4>
              <p className={validationStats.bannedProducts === 'passed' ? 'text-green-700' : 'text-red-700'}>
                {validationStats.bannedProducts === 'passed'
                  ? 'Product cleared against all banned items lists for destination country'
                  : 'Product matches items on the restricted/banned list'}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full ${
              validationStats.bannedProducts === 'passed' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {validationStats.bannedProducts.toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-slate-600 text-sm mb-1">Items Screened</p>
              <p className="text-slate-900 text-xl">1,247</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-slate-600 text-sm mb-1">Restricted Lists</p>
              <p className="text-slate-900 text-xl">12</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-slate-600 text-sm mb-1">Last Updated</p>
              <p className="text-slate-900 text-sm">Today, 10:30 AM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quantity, Weight, and Constraints Validation */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Scale className="w-6 h-6 text-amber-600" />
          <div>
            <h3 className="text-slate-900">Quantity, Weight & Value Constraints</h3>
            <p className="text-slate-600 text-sm">Validation of physical and commercial constraints</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Constraint Checks */}
          <div className="space-y-4">
            <div className={`rounded-lg p-4 border-2 ${
              validationStats.constraints === 'passed' 
                ? 'bg-green-50 border-green-200' 
                : validationStats.constraints === 'warning'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-900">Quantity Validation</span>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-slate-700 text-sm mb-2">Quantity: 100 units</p>
              <p className="text-green-700 text-sm">Within acceptable range</p>
            </div>

            <div className={`rounded-lg p-4 border-2 ${
              validationStats.constraints === 'passed' 
                ? 'bg-green-50 border-green-200' 
                : validationStats.constraints === 'warning'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-purple-600" />
                  <span className="text-slate-900">Weight Validation</span>
                </div>
                {validationStats.constraints === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>
              <p className="text-slate-700 text-sm mb-2">Weight: 25.5 kg</p>
              <p className={`text-sm ${
                validationStats.constraints === 'warning' ? 'text-amber-700' : 'text-green-700'
              }`}>
                {validationStats.constraints === 'warning' 
                  ? 'Close to maximum limit' 
                  : 'Within acceptable range'}
              </p>
            </div>

            <div className={`rounded-lg p-4 border-2 ${
              validationStats.constraints === 'passed' 
                ? 'bg-green-50 border-green-200' 
                : validationStats.constraints === 'warning'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-900">Value Validation</span>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-slate-700 text-sm mb-2">Declared Value: $5,000</p>
              <p className="text-green-700 text-sm">Within customs limits</p>
            </div>
          </div>

          {/* Constraint Summary */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-6 border border-slate-200">
            <h4 className="text-slate-900 mb-4">Constraint Analysis Summary</h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Value/Weight Ratio</span>
                  <span className="text-slate-900">$196/kg</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }} />
                </div>
                <p className="text-xs text-green-600 mt-1">Normal range</p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Weight Compliance</span>
                  <span className="text-slate-900">95%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '95%' }} />
                </div>
                <p className="text-xs text-amber-600 mt-1">Approaching limit</p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Quantity Compliance</span>
                  <span className="text-slate-900">100%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
                </div>
                <p className="text-xs text-green-600 mt-1">Fully compliant</p>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-slate-900">Overall Status</span>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    validationStats.constraints === 'passed' 
                      ? 'bg-green-100 text-green-700' 
                      : validationStats.constraints === 'warning'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {validationStats.constraints === 'passed' 
                      ? '✓ PASSED' 
                      : validationStats.constraints === 'warning'
                      ? '⚠ WARNING'
                      : '✗ FAILED'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

