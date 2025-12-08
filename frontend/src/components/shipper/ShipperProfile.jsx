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

  // color tokens
  const WHITE = '#FFFFFF';
  const CREAM = '#FBF9F6';
  const YELLOW = '#E6B800';
  const DARK = '#2F1B17';
  const SOFT = '#7A5B52';
  const MUTED_BORDER = 'rgba(47,27,23,0.08)';

  return (
    <div style={{ background: WHITE, minHeight: '100vh', padding: 24 }}>
      <div style={{ maxWidth: 1024, margin: '0 auto', color: DARK }}>
        <h1 style={{ color: DARK, marginBottom: 8 }}>Profile Settings</h1>
        <p style={{ color: SOFT, marginBottom: 24 }}>Manage your account information and preferences</p>

        <div style={{ display: 'grid', gap: 24 }}>
          {/* Profile Header */}
          <div
            style={{
              background: CREAM,
              borderRadius: 12,
              padding: 24,
              border: `1px solid ${MUTED_BORDER}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: '50%',
                    background: YELLOW,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <User style={{ width: 44, height: 44, color: DARK }} />
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: 22, color: DARK }}>
                  {profile.firstName} {profile.lastName}
                </h2>
                <p style={{ margin: '6px 0', color: SOFT }}>{profile.email}</p>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '6px 10px',
                    borderRadius: 999,
                    background: 'rgba(47,27,23,0.06)',
                    color: DARK,
                    fontSize: 13,
                  }}
                >
                  {profile.companyRole}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '10px 14px',
                    background: YELLOW,
                    color: DARK,
                    borderRadius: 8,
                    border: `2px solid ${DARK}`,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Edit Profile
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{
                      padding: '10px 14px',
                      background: WHITE,
                      color: DARK,
                      borderRadius: 8,
                      border: `2px solid ${MUTED_BORDER}`,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      padding: '10px 14px',
                      background: YELLOW,
                      color: DARK,
                      borderRadius: 8,
                      border: `2px solid ${DARK}`,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div
            style={{
              background: CREAM,
              borderRadius: 12,
              padding: 24,
              border: `1px solid ${MUTED_BORDER}`,
            }}
          >
            <h3 style={{ color: DARK, marginBottom: 12 }}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', color: SOFT, marginBottom: 8, fontSize: 13 }}>
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 8,
                    border: `1px solid ${MUTED_BORDER}`,
                    background: WHITE,
                    color: DARK
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: SOFT, marginBottom: 8, fontSize: 13 }}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 8,
                    border: `1px solid ${MUTED_BORDER}`,
                    background: WHITE,
                    color: DARK
                  }}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div
            style={{
              background: CREAM,
              borderRadius: 12,
              padding: 24,
              border: `1px solid ${MUTED_BORDER}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Mail style={{ width: 18, height: 18, color: DARK }} />
              <h3 style={{ color: DARK, margin: 0 }}>Contact Information</h3>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <label style={{ display: 'block', color: SOFT, marginBottom: 8, fontSize: 13 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 8,
                    background: WHITE,
                    color: DARK,
                    border: `1px solid ${MUTED_BORDER}`
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: SOFT, marginBottom: 8, fontSize: 13 }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 8,
                    background: WHITE,
                    color: DARK,
                    border: `1px solid ${MUTED_BORDER}`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div
            style={{
              background: CREAM,
              borderRadius: 12,
              padding: 24,
              border: `1px solid ${MUTED_BORDER}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Building style={{ width: 18, height: 18, color: DARK }} />
              <h3 style={{ color: DARK, margin: 0 }}>Company Details</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', color: SOFT, marginBottom: 8, fontSize: 13 }}>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={profile.companyName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 8,
                    background: WHITE,
                    color: DARK,
                    border: `1px solid ${MUTED_BORDER}`
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: SOFT, marginBottom: 8, fontSize: 13 }}>Role</label>
                <input
                  type="text"
                  name="companyRole"
                  value={profile.companyRole}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 8,
                    background: WHITE,
                    color: DARK,
                    border: `1px solid ${MUTED_BORDER}`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div
            style={{
              background: CREAM,
              borderRadius: 12,
              padding: 24,
              border: `1px solid ${MUTED_BORDER}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <MapPin style={{ width: 18, height: 18, color: DARK }} />
              <h3 style={{ color: DARK, margin: 0 }}>Address</h3>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <label style={{ display: 'block', color: SOFT, marginBottom: 8, fontSize: 13 }}>Address Line 1</label>
                <input
                  type="text"
                  name="addressLine1"
                  value={profile.addressLine1}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 8,
                    background: WHITE,
                    color: DARK,
                    border: `1px solid ${MUTED_BORDER}`
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: SOFT, marginBottom: 8, fontSize: 13 }}>Address Line 2 (Optional)</label>
                <input
                  type="text"
                  name="addressLine2"
                  value={profile.addressLine2}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 8,
                    background: WHITE,
                    color: DARK,
                    border: `1px solid ${MUTED_BORDER}`
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', color: SOFT, marginBottom: 8, fontSize: 13 }}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={profile.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: 12,
                      borderRadius: 8,
                      background: WHITE,
                      color: DARK,
                      border: `1px solid ${MUTED_BORDER}`
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: SOFT, marginBottom: 8, fontSize: 13 }}>State/Province</label>
                  <input
                    type="text"
                    name="state"
                    value={profile.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: 12,
                      borderRadius: 8,
                      background: WHITE,
                      color: DARK,
                      border: `1px solid ${MUTED_BORDER}`
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: SOFT, marginBottom: 8, fontSize: 13 }}>Pin Code</label>
                  <input
                    type="text"
                    name="pinCode"
                    value={profile.pinCode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: 12,
                      borderRadius: 8,
                      background: WHITE,
                      color: DARK,
                      border: `1px solid ${MUTED_BORDER}`
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: SOFT, marginBottom: 8, fontSize: 13 }}>Country</label>
                <input
                  type="text"
                  name="country"
                  value={profile.country}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 8,
                    background: WHITE,
                    color: DARK,
                    border: `1px solid ${MUTED_BORDER}`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Regional Preferences */}
          <div
            style={{
              background: CREAM,
              borderRadius: 12,
              padding: 24,
              border: `1px solid ${MUTED_BORDER}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Clock style={{ width: 18, height: 18, color: DARK }} />
              <h3 style={{ color: DARK, margin: 0 }}>Regional Preferences</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', color: SOFT, marginBottom: 8, fontSize: 13 }}>Timezone</label>
                <select
                  name="timezone"
                  value={profile.timezone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 8,
                    background: WHITE,
                    color: DARK,
                    border: `1px solid ${MUTED_BORDER}`
                  }}
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
                <label style={{ display: 'block', color: SOFT, marginBottom: 8, fontSize: 13 }}>Language</label>
                <select
                  name="language"
                  value={profile.language}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 8,
                    background: WHITE,
                    color: DARK,
                    border: `1px solid ${MUTED_BORDER}`
                  }}
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
          <div
            style={{
              background: '#FFF3CC',
              borderRadius: 12,
              padding: 24,
              border: `1px solid ${MUTED_BORDER}`,
            }}
          >
            <h3 style={{ color: DARK, marginBottom: 8 }}>Account Status</h3>
            <p style={{ color: SOFT, marginBottom: 12, fontSize: 13 }}>Your account is active and verified</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: WHITE, borderRadius: 8, padding: 12 }}>
                <p style={{ color: SOFT, fontSize: 12, margin: 0 }}>Member Since</p>
                <p style={{ color: DARK, margin: '6px 0 0 0', fontWeight: 600 }}>January 2024</p>
              </div>
              <div style={{ background: WHITE, borderRadius: 8, padding: 12 }}>
                <p style={{ color: SOFT, fontSize: 12, margin: 0 }}>Total Shipments</p>
                <p style={{ color: DARK, margin: '6px 0 0 0', fontWeight: 600 }}>4 Shipments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
