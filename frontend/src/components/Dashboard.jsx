import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Globe, 
  Package,
  FileWarning,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface DashboardProps {
  userRole: string;
}

export function Dashboard({ userRole }: DashboardProps) {
  const stats = [
    {
      label: 'Pre-Clearance Tokens',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Pending Approvals',
      value: '7',
      change: '-3%',
      trend: 'down',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Flagged Shipments',
      value: '3',
      change: '+1',
      trend: 'up',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'AI Compliance Score',
      value: '94%',
      change: '+2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const riskAlerts = [
    {
      country: 'China',
      flag: '🇨🇳',
      risk: 'High',
      reason: 'New export restrictions on electronics',
      level: 'high'
    },
    {
      country: 'United Kingdom',
      flag: '🇬🇧',
      risk: 'Medium',
      reason: 'Updated customs documentation requirements',
      level: 'medium'
    },
    {
      country: 'Germany',
      flag: '🇩🇪',
      risk: 'Low',
      reason: 'Standard processing',
      level: 'low'
    }
  ];

  const nonCompliantCommodities = [
    {
      name: 'Lithium Batteries',
      hsCode: '8506.50',
      count: 5,
      issue: 'Missing MSDS documentation'
    },
    {
      name: 'Textile Products',
      hsCode: '6204.62',
      count: 3,
      issue: 'Country of origin not declared'
    },
    {
      name: 'Pharmaceuticals',
      hsCode: '3004.90',
      count: 2,
      issue: 'Import license required'
    }
  ];

  const upcomingShipments = [
    {
      id: 'SHP-2024-001',
      destination: 'United States',
      flag: '🇺🇸',
      date: '2024-12-05',
      status: 'Documents Needed',
      missing: ['Commercial Invoice', 'Certificate of Origin']
    },
    {
      id: 'SHP-2024-002',
      destination: 'Singapore',
      flag: '🇸🇬',
      date: '2024-12-06',
      status: 'Documents Needed',
      missing: ['MSDS', 'Packing List']
    },
    {
      id: 'SHP-2024-003',
      destination: 'Canada',
      flag: '🇨🇦',
      date: '2024-12-07',
      status: 'Documents Needed',
      missing: ['Bill of Lading']
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's your compliance overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-slate-600 mb-1">{stat.label}</p>
              <p className="text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Country Risk Alerts */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-slate-700" />
            <h2 className="text-slate-900">Country Risk Alerts</h2>
          </div>
          <div className="space-y-4">
            {riskAlerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <span className="text-3xl">{alert.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-slate-900">{alert.country}</p>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      alert.level === 'high' 
                        ? 'bg-red-100 text-red-700' 
                        : alert.level === 'medium'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {alert.risk} Risk
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm">{alert.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Non-Compliant Commodities */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <FileWarning className="w-5 h-5 text-slate-700" />
            <h2 className="text-slate-900">Non-Compliant Commodities</h2>
          </div>
          <div className="space-y-4">
            {nonCompliantCommodities.map((item, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-slate-900">{item.name}</p>
                    <p className="text-slate-500 text-sm">HS Code: {item.hsCode}</p>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    {item.count} cases
                  </span>
                </div>
                <div className="flex items-center gap-2 text-orange-600 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{item.issue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Shipments */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-slate-700" />
          <h2 className="text-slate-900">Upcoming Shipments Needing Documents</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-slate-700">Shipment ID</th>
                <th className="text-left py-3 px-4 text-slate-700">Destination</th>
                <th className="text-left py-3 px-4 text-slate-700">Departure Date</th>
                <th className="text-left py-3 px-4 text-slate-700">Missing Documents</th>
                <th className="text-left py-3 px-4 text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingShipments.map((shipment, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <p className="text-slate-900">{shipment.id}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{shipment.flag}</span>
                      <span className="text-slate-700">{shipment.destination}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-slate-700">{shipment.date}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {shipment.missing.map((doc, idx) => (
                        <span key={idx} className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                      {shipment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
