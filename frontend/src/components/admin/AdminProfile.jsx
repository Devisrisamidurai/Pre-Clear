import { User, Building, Mail, Phone, MapPin, Clock, Shield, Upload, Settings, FileText } from 'lucide-react';
import { useState } from 'react';

export function AdminProfile() {
  const [profile, setProfile] = useState({
    firstName: 'Sarah',
    lastName: 'Administrator',
    email: 'admin@upspreclear.com',
    phone: '+1 (555) 000-1234',
    countryCode: '+1',
    organizationName: 'UPS Pre-Clear System',
    role: 'System Administrator',
    addressLine1: '55 Glenlake Parkway NE',
    addressLine2: '',
    city: 'Atlanta',
    state: 'GA',
    pinCode: '30328',
    country: 'United States',
    timezone: 'America/New_York',
    language: 'English',
    adminLevel: 'Super Admin',
    department: 'Operations'
  });

  const [permissions, setPermissions] = useState({
    manageUsers: true,
    manageRules: true,
    viewReports: true,
    manageSystem: true,
    auditLogAccess: true,
    configureSettings: true
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (permission: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [permission]: !prev[permission] }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // In real app, would save to backend
  };

  return (
    <div>
      <h1 className=\"text-slate-900 mb-2\">Admin Profile</h1>
      <p className=\"text-slate-600 mb-8\">Manage your administrator account and system permissions</p>

      <div className=\"max-w-3xl space-y-6\">
        {/* Profile Header */}
        <div className=\"bg-white rounded-xl p-6 border border-slate-200\">
          <div className=\"flex items-center gap-6 mb-6\">
            <div className=\"relative\">
              <div className=\"w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center\">
                <User className=\"w-12 h-12 text-white\" />
              </div>
              <button className=\"absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-red-600 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors\">
                <Upload className=\"w-4 h-4 text-red-600\" />
              </button>
            </div>
            <div>
              <h2 className=\"text-slate-900 text-2xl mb-1\">{profile.firstName} {profile.lastName}</h2>
              <p className=\"text-slate-600 mb-2\">{profile.email}</p>
              <div className=\"flex gap-2\">
                <span className=\"px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm\">
                  {profile.role}
                </span>
                <span className=\"px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm\">
                  {profile.adminLevel}
                </span>
              </div>
            </div>
          </div>

          <div className=\"flex justify-end\">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className=\"px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors\"
              >
                Edit Profile
              </button>
            ) : (
              <div className=\"flex gap-3\">
                <button
                  onClick={() => setIsEditing(false)}
                  className=\"px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors\"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className=\"px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors\"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className=\"bg-white rounded-xl p-6 border border-slate-200\">
          <h3 className=\"text-slate-900 mb-4\">Personal Information</h3>
          <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
            <div>
              <label className=\"block text-slate-700 mb-2 text-sm\">First Name</label>
              <input
                type=\"text\"
                name=\"firstName\"
                value={profile.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-600\"
              />
            </div>
            <div>
              <label className=\"block text-slate-700 mb-2 text-sm\">Last Name</label>
              <input
                type=\"text\"
                name=\"lastName\"
                value={profile.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-600\"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className=\"bg-white rounded-xl p-6 border border-slate-200\">
          <div className=\"flex items-center gap-2 mb-4\">
            <Mail className=\"w-5 h-5 text-red-600\" />
            <h3 className=\"text-slate-900\">Contact Information</h3>
          </div>
          <div className=\"space-y-4\">
            <div>
              <label className=\"block text-slate-700 mb-2 text-sm\">Email Address</label>
              <input
                type=\"email\"
                name=\"email\"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
                className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-600\"
              />
            </div>
            <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">
              <div>
                <label className=\"block text-slate-700 mb-2 text-sm\">Country Code</label>
                <select
                  name=\"countryCode\"
                  value={profile.countryCode}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-600\"
                >
                  <option value=\"+1\">+1 (US/CA)</option>
                  <option value=\"+44\">+44 (UK)</option>
                  <option value=\"+49\">+49 (DE)</option>
                  <option value=\"+33\">+33 (FR)</option>
                  <option value=\"+86\">+86 (CN)</option>
                  <option value=\"+91\">+91 (IN)</option>
                  <option value=\"+971\">+971 (AE)</option>
                </select>
              </div>
              <div className=\"md:col-span-2\">
                <label className=\"block text-slate-700 mb-2 text-sm\">Mobile Number</label>
                <input
                  type=\"tel\"
                  name=\"phone\"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-600\"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Organization Details */}
        <div className=\"bg-white rounded-xl p-6 border border-slate-200\">
          <div className=\"flex items-center gap-2 mb-4\">
            <Building className=\"w-5 h-5 text-orange-600\" />
            <h3 className=\"text-slate-900\">Organization Details</h3>
          </div>
          <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
            <div>
              <label className=\"block text-slate-700 mb-2 text-sm\">Organization Name</label>
              <input
                type=\"text\"
                name=\"organizationName\"
                value={profile.organizationName}
                onChange={handleChange}
                disabled={!isEditing}
                className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-600\"
              />
            </div>
            <div>
              <label className=\"block text-slate-700 mb-2 text-sm\">Department</label>
              <select
                name=\"department\"
                value={profile.department}
                onChange={handleChange}
                disabled={!isEditing}
                className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-600\"
              >
                <option value=\"Operations\">Operations</option>
                <option value=\"IT\">IT</option>
                <option value=\"Compliance\">Compliance</option>
                <option value=\"Management\">Management</option>
              </select>
            </div>
            <div>
              <label className=\"block text-slate-700 mb-2 text-sm\">System Role</label>
              <select
                name=\"role\"
                value={profile.role}
                onChange={handleChange}
                disabled={!isEditing}
                className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-600\"
              >
                <option value=\"System Administrator\">System Administrator</option>
                <option value=\"Operations Admin\">Operations Admin</option>
                <option value=\"Compliance Admin\">Compliance Admin</option>
              </select>
            </div>
            <div>
              <label className=\"block text-slate-700 mb-2 text-sm\">Admin Level</label>
              <select
                name=\"adminLevel\"
                value={profile.adminLevel}
                onChange={handleChange}
                disabled={!isEditing}
                className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-600\"
              >
                <option value=\"Super Admin\">Super Admin</option>
                <option value=\"Admin\">Admin</option>
                <option value=\"Moderator\">Moderator</option>
              </select>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className=\"bg-white rounded-xl p-6 border border-slate-200\">
          <div className=\"flex items-center gap-2 mb-4\">
            <MapPin className=\"w-5 h-5 text-green-600\" />
            <h3 className=\"text-slate-900\">Address</h3>
          </div>
          <div className=\"space-y-4\">
            <div>
              <label className=\"block text-slate-700 mb-2 text-sm\">Address Line 1</label>
              <input
                type=\"text\"
                name=\"addressLine1\"
                value={profile.addressLine1}
                onChange={handleChange}
                disabled={!isEditing}
                className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-600\"
              />
            </div>
            <div>
              <label className=\"block text-slate-700 mb-2 text-sm\">Address Line 2 (Optional)</label>
              <input
                type=\"text\"
                name=\"addressLine2\"
                value={profile.addressLine2}
                onChange={handleChange}
                disabled={!isEditing}
                className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-600\"
              />
            </div>
            <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">
              <div>
                <label className=\"block text-slate-700 mb-2 text-sm\">City</label>
                <input
                  type=\"text\"
                  name=\"city\"
                  value={profile.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-600\"
                />
              </div>
              <div>
                <label className=\"block text-slate-700 mb-2 text-sm\">State/Province</label>
                <input
                  type=\"text\"
                  name=\"state\"
                  value={profile.state}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-600\"
                />
              </div>
              <div>
                <label className=\"block text-slate-700 mb-2 text-sm\">Pin Code</label>
                <input
                  type=\"text\"
                  name=\"pinCode\"
                  value={profile.pinCode}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-600\"
                />
              </div>
            </div>
            <div>
              <label className=\"block text-slate-700 mb-2 text-sm\">Country</label>
              <input
                type=\"text\"
                name=\"country\"
                value={profile.country}
                onChange={handleChange}
                disabled={!isEditing}
                className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-600\"
              />
            </div>
          </div>
        </div>

        {/* Regional Preferences */}
        <div className=\"bg-white rounded-xl p-6 border border-slate-200\">
          <div className=\"flex items-center gap-2 mb-4\">
            <Clock className=\"w-5 h-5 text-blue-600\" />
            <h3 className=\"text-slate-900\">Regional Preferences</h3>
          </div>
          <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
            <div>
              <label className=\"block text-slate-700 mb-2 text-sm\">Timezone</label>
              <select
                name=\"timezone\"
                value={profile.timezone}
                onChange={handleChange}
                disabled={!isEditing}
                className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-600\"
              >
                <option value=\"America/New_York\">America/New York (EST)</option>
                <option value=\"America/Chicago\">America/Chicago (CST)</option>
                <option value=\"America/Denver\">America/Denver (MST)</option>
                <option value=\"America/Los_Angeles\">America/Los Angeles (PST)</option>
                <option value=\"Europe/London\">Europe/London (GMT)</option>
                <option value=\"Europe/Paris\">Europe/Paris (CET)</option>
                <option value=\"Asia/Dubai\">Asia/Dubai (GST)</option>
                <option value=\"Asia/Kolkata\">Asia/Kolkata (IST)</option>
                <option value=\"Asia/Singapore\">Asia/Singapore (SGT)</option>
                <option value=\"Asia/Tokyo\">Asia/Tokyo (JST)</option>
              </select>
            </div>
            <div>
              <label className=\"block text-slate-700 mb-2 text-sm\">Language</label>
              <select
                name=\"language\"
                value={profile.language}
                onChange={handleChange}
                disabled={!isEditing}
                className=\"w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-50 disabled:text-slate-600\"
              >
                <option value=\"English\">English</option>
                <option value=\"Spanish\">Español</option>
                <option value=\"French\">Français</option>
                <option value=\"German\">Deutsch</option>
                <option value=\"Chinese\">中文</option>
                <option value=\"Japanese\">日本語</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Role Permissions */}
        <div className=\"bg-white rounded-xl p-6 border border-slate-200\">
          <div className=\"flex items-center gap-2 mb-4\">
            <Settings className=\"w-5 h-5 text-red-600\" />
            <h3 className=\"text-slate-900\">System Role Permissions</h3>
          </div>
          <p className=\"text-slate-600 text-sm mb-4\">Configure access levels and system capabilities</p>
          <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
            <label className=\"flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors\">
              <input
                type=\"checkbox\"
                checked={permissions.manageUsers}
                onChange={() => handlePermissionChange('manageUsers')}
                disabled={!isEditing}
                className=\"w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500 disabled:opacity-50\"
              />
              <div>
                <p className=\"text-slate-900\">Manage Users</p>
                <p className=\"text-slate-500 text-xs\">Create, edit, and delete users</p>
              </div>
            </label>

            <label className=\"flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors\">
              <input
                type=\"checkbox\"
                checked={permissions.manageRules}
                onChange={() => handlePermissionChange('manageRules')}
                disabled={!isEditing}
                className=\"w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500 disabled:opacity-50\"
              />
              <div>
                <p className=\"text-slate-900\">Manage Rules</p>
                <p className=\"text-slate-500 text-xs\">Configure import/export rules</p>
              </div>
            </label>

            <label className=\"flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors\">
              <input
                type=\"checkbox\"
                checked={permissions.viewReports}
                onChange={() => handlePermissionChange('viewReports')}
                disabled={!isEditing}
                className=\"w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500 disabled:opacity-50\"
              />
              <div>
                <p className=\"text-slate-900\">View Reports</p>
                <p className=\"text-slate-500 text-xs\">Access analytics and reports</p>
              </div>
            </label>

            <label className=\"flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors\">
              <input
                type=\"checkbox\"
                checked={permissions.manageSystem}
                onChange={() => handlePermissionChange('manageSystem')}
                disabled={!isEditing}
                className=\"w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500 disabled:opacity-50\"
              />
              <div>
                <p className=\"text-slate-900\">Manage System</p>
                <p className=\"text-slate-500 text-xs\">Configure system settings</p>
              </div>
            </label>

            <label className=\"flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors\">
              <input
                type=\"checkbox\"
                checked={permissions.auditLogAccess}
                onChange={() => handlePermissionChange('auditLogAccess')}
                disabled={!isEditing}
                className=\"w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500 disabled:opacity-50\"
              />
              <div>
                <p className=\"text-slate-900\">Audit Log Access</p>
                <p className=\"text-slate-500 text-xs\">View system audit trails</p>
              </div>
            </label>

            <label className=\"flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors\">
              <input
                type=\"checkbox\"
                checked={permissions.configureSettings}
                onChange={() => handlePermissionChange('configureSettings')}
                disabled={!isEditing}
                className=\"w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500 disabled:opacity-50\"
              />
              <div>
                <p className=\"text-slate-900\">Configure Settings</p>
                <p className=\"text-slate-500 text-xs\">Modify platform configurations</p>
              </div>
            </label>
          </div>
        </div>

        {/* Account Status */}
        <div className=\"bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6\">
          <div className=\"flex items-center gap-2 mb-2\">
            <Shield className=\"w-5 h-5 text-red-600\" />
            <h3 className=\"text-red-900\">Administrator Status</h3>
          </div>
          <p className=\"text-red-700 text-sm mb-4\">Your administrator account is active with full system access</p>
          <div className=\"grid grid-cols-3 gap-4\">
            <div className=\"bg-white rounded-lg p-3\">
              <p className=\"text-slate-600 text-xs mb-1\">Account Created</p>
              <p className=\"text-slate-900\">Jan 2024</p>
            </div>
            <div className=\"bg-white rounded-lg p-3\">
              <p className=\"text-slate-600 text-xs mb-1\">Last Login</p>
              <p className=\"text-slate-900\">Today</p>
            </div>
            <div className=\"bg-white rounded-lg p-3\">
              <p className=\"text-slate-600 text-xs mb-1\">Active Sessions</p>
              <p className=\"text-slate-900\">1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
