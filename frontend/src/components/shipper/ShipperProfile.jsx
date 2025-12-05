import { User, Building, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';

export function ShipperProfile() {
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Shipper',
    email: 'shipper@demo.com',
    phone: '+1 (555) 123-4567',
    companyName: 'Global Trade Inc',
    companyRole: 'Shipper',
    addressLine1: '123 Export Street',
    addressLine2: 'Suite 400',
    city: 'New York',
    state: 'NY',
    pinCode: '10001',
    country: 'United States',
    timezone: 'America/New_York',
    language: 'English'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // In real app, would save to backend
  };

  return (
    <div>
      <h1 className="text-slate-900 mb-2">Profile Settings</h1>
      <p className="text-slate-600 mb-8">Manage your account information and preferences</p>

      <div className="max-w-3xl space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-slate-900 text-2xl mb-1">{profile.firstName} {profile.lastName}</h2>
              <p className="text-slate-600 mb-2">{profile.email}</p>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {profile.companyRole}
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-slate-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-2 text-sm">First Name</label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-blue-600" />
            <h3 className="text-slate-900">Contact Information</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600"
              />
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Building className="w-5 h-5 text-purple-600" />
            <h3 className="text-slate-900">Company Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={profile.companyName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Role</label>
              <select
                name="companyRole"
                value={profile.companyRole}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600"
              >
                <option value="Shipper">Shipper</option>
                <option value="Broker">Broker</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-green-600" />
            <h3 className="text-slate-900">Address</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Address Line 1</label>
              <input
                type="text"
                name="addressLine1"
                value={profile.addressLine1}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Address Line 2 (Optional)</label>
              <input
                type="text"
                name="addressLine2"
                value={profile.addressLine2}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 mb-2 text-sm">City</label>
                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-2 text-sm">State/Province</label>
                <input
                  type="text"
                  name="state"
                  value={profile.state}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-2 text-sm">Pin Code</label>
                <input
                  type="text"
                  name="pinCode"
                  value={profile.pinCode}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Country</label>
              <input
                type="text"
                name="country"
                value={profile.country}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600"
              />
            </div>
          </div>
        </div>

        {/* Regional Preferences */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-orange-600" />
            <h3 className="text-slate-900">Regional Preferences</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Timezone</label>
              <select
                name="timezone"
                value={profile.timezone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600"
              >
                <option value="America/New_York">America/New York (EST)</option>
                <option value="America/Chicago">America/Chicago (CST)</option>
                <option value="America/Denver">America/Denver (MST)</option>
                <option value="America/Los_Angeles">America/Los Angeles (PST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Europe/Paris">Europe/Paris (CET)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Language</label>
              <select
                name="language"
                value={profile.language}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-600"
              >
                <option value="English">English</option>
                <option value="Spanish">Español</option>
                <option value="French">Français</option>
                <option value="German">Deutsch</option>
                <option value="Chinese">中文</option>
                <option value="Japanese">日本語</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
          <h3 className="text-green-900 mb-2">Account Status</h3>
          <p className="text-green-700 text-sm mb-4">Your account is active and verified</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-3">
              <p className="text-slate-600 text-xs mb-1">Member Since</p>
              <p className="text-slate-900">January 2024</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-slate-600 text-xs mb-1">Total Shipments</p>
              <p className="text-slate-900">4 Shipments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

