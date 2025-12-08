import { useState } from 'react';
import { 
  User, 
  Building2, 
  Globe, 
  FileText, 
  DollarSign, 
  Bell,
  Shield,
  Save
} from 'lucide-react';

interface SettingsProps {
  userRole: string;
}

export function Settings({ userRole }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    fullName: 'John Smith',
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    company: 'Global Trade Solutions Inc.',
    role: userRole
  });

  const [hsPreferences, setHsPreferences] = useState({
    autoSuggest: true,
    confidenceThreshold: 90,
    manualReview: false
  });

  const [currencySettings, setCurrencySettings] = useState({
    defaultCurrency: 'USD',
    autoConvert: true,
    displayBoth: true
  });

  const [documentTemplates, setDocumentTemplates] = useState([
    { id: 1, name: 'Commercial Invoice Template', type: 'Invoice', active: true },
    { id: 2, name: 'Certificate of Origin (China)', type: 'COO', active: true },
    { id: 3, name: 'Packing List Standard', type: 'Packing List', active: true },
    { id: 4, name: 'MSDS Template v2', type: 'MSDS', active: false }
  ]);

  const [countryRules, setCountryRules] = useState([
    { country: 'United States', flag: '🇺🇸', enabled: true, autoCheck: true },
    { country: 'United Kingdom', flag: '🇬🇧', enabled: true, autoCheck: true },
    { country: 'European Union', flag: '🇪🇺', enabled: true, autoCheck: false },
    { country: 'China', flag: '🇨🇳', enabled: true, autoCheck: true },
    { country: 'Japan', flag: '🇯🇵', enabled: false, autoCheck: false }
  ]);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    complianceUpdates: true,
    shipmentStatus: true,
    documentReminders: true,
    riskAlerts: true
  });

  const tabs = [
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'hs-codes', label: 'HS Code Preferences', icon: FileText },
    { id: 'documents', label: 'Document Templates', icon: FileText },
    { id: 'countries', label: 'Country Rules', icon: Globe },
    { id: 'currency', label: 'Currency Settings', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            {/* User Profile */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-slate-900 mb-6">User Profile</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-slate-300 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-slate-600" />
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Change Photo
                    </button>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2">Company</label>
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2">Role</label>
                    <input
                      type="text"
                      value={profileData.role}
                      disabled
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* HS Code Preferences */}
            {activeTab === 'hs-codes' && (
              <div>
                <h2 className="text-slate-900 mb-6">HS Code Preferences</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-slate-900 mb-1">Auto-Suggest HS Codes</p>
                      <p className="text-slate-600 text-sm">AI will automatically suggest HS codes based on product descriptions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hsPreferences.autoSuggest}
                        onChange={(e) => setHsPreferences({...hsPreferences, autoSuggest: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2">Confidence Threshold (%)</label>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={hsPreferences.confidenceThreshold}
                      onChange={(e) => setHsPreferences({...hsPreferences, confidenceThreshold: parseInt(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-slate-600 mt-1">
                      <span>50%</span>
                      <span className="text-blue-600">{hsPreferences.confidenceThreshold}%</span>
                      <span>100%</span>
                    </div>
                    <p className="text-slate-600 text-sm mt-2">
                      HS codes below this threshold will require manual review
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-slate-900 mb-1">Always Require Manual Review</p>
                      <p className="text-slate-600 text-sm">Manually verify all HS code suggestions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hsPreferences.manualReview}
                        onChange={(e) => setHsPreferences({...hsPreferences, manualReview: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Document Templates */}
            {activeTab === 'documents' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-slate-900">Document Templates</h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Add Template
                  </button>
                </div>
                <div className="space-y-3">
                  {documentTemplates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-600" />
                        <div>
                          <p className="text-slate-900">{template.name}</p>
                          <p className="text-slate-500 text-sm">{template.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          template.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {template.active ? 'Active' : 'Inactive'}
                        </span>
                        <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Country Rules */}
            {activeTab === 'countries' && (
              <div>
                <h2 className="text-slate-900 mb-6">Country-Specific Rules</h2>
                <div className="space-y-3">
                  {countryRules.map((rule, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{rule.flag}</span>
                        <span className="text-slate-900">{rule.country}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={rule.autoCheck}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <span className="text-slate-600 text-sm">Auto-check rules</span>
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rule.enabled}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Currency Settings */}
            {activeTab === 'currency' && (
              <div>
                <h2 className="text-slate-900 mb-6">Currency Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-700 mb-2">Default Currency</label>
                    <select
                      value={currencySettings.defaultCurrency}
                      onChange={(e) => setCurrencySettings({...currencySettings, defaultCurrency: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CNY">CNY - Chinese Yuan</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-slate-900 mb-1">Auto-Convert Prices</p>
                      <p className="text-slate-600 text-sm">Automatically convert to destination country currency</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currencySettings.autoConvert}
                        onChange={(e) => setCurrencySettings({...currencySettings, autoConvert: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-slate-900 mb-1">Display Both Currencies</p>
                      <p className="text-slate-600 text-sm">Show original and converted amounts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currencySettings.displayBoth}
                        onChange={(e) => setCurrencySettings({...currencySettings, displayBoth: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-slate-900 mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-slate-900 mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-slate-900 mb-6">Security Settings</h2>
                <div className="space-y-4">
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h3 className="text-slate-900 mb-2">Change Password</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Update Password
                    </button>
                  </div>

                  <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-slate-900">Two-Factor Authentication</h3>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Enabled</span>
                    </div>
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                      Manage 2FA
                    </button>
                  </div>

                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h3 className="text-slate-900 mb-2">Active Sessions</h3>
                    <p className="text-slate-600 text-sm mb-3">2 active sessions</p>
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                      View All Sessions
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
