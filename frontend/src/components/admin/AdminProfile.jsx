import { User, Shield, Mail, Phone, Building, Settings, Upload, Clock, MapPin } from 'lucide-react';
import { useState } from 'react';

export function AdminProfile() {
  const [profile, setProfile] = useState({
    firstName: 'Alex',
    lastName: 'Admin',
    email: 'admin@demo.com',
    phone: '+1 (555) 000-0000',
    organizationName: 'UPS Pre-Clear',
    role: 'System Administrator',
    timezone: 'America/New_York',
    language: 'English'
  });

  const [permissions, setPermissions] = useState({
    manageUsers: true,
    manageRules: true,
    viewReports: true,
    manageSystem: true
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (key) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => setIsEditing(false);

  return (
    <div style={{ background: '#FBF9F6', minHeight: '100vh', padding: 24 }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <h1 style={{ marginBottom: 8 }}>Admin Profile</h1>
        <p style={{ color: '#7A5B52', marginBottom: 20 }}>Manage administrative account settings and system permissions.</p>

        <div style={{ display: 'grid', gap: 20 }}>
          <section style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#E6B800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User style={{ color: '#2F1B17', width: 36, height: 36 }} />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0 }}>{profile.firstName} {profile.lastName}</h2>
                <p style={{ margin: '6px 0', color: '#7A5B52' }}>{profile.email}</p>
              </div>
              <div>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} style={{ padding: '8px 12px', background: '#E6B800', color: '#2F1B17', borderRadius: 8, border: '2px solid #2F1B17', cursor: 'pointer' }}>Edit</button>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setIsEditing(false)} style={{ padding: '8px 12px', background: 'transparent', color: '#2F1B17', borderRadius: 8, border: '2px solid #EADFD8' }}>Cancel</button>
                    <button onClick={handleSave} style={{ padding: '8px 12px', background: '#E6B800', color: '#2F1B17', borderRadius: 8, border: '2px solid #2F1B17' }}>Save</button>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)' }}>
              <h3>Contact</h3>
              <label style={{ display: 'block', marginTop: 8, fontSize: 13 }}>Email</label>
              <input name="email" value={profile.email} onChange={handleChange} disabled={!isEditing} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
              <label style={{ display: 'block', marginTop: 8, fontSize: 13 }}>Phone</label>
              <input name="phone" value={profile.phone} onChange={handleChange} disabled={!isEditing} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
            </div>

            <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)' }}>
              <h3>Organization</h3>
              <label style={{ display: 'block', marginTop: 8, fontSize: 13 }}>Organization</label>
              <input name="organizationName" value={profile.organizationName} onChange={handleChange} disabled={!isEditing} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
              <label style={{ display: 'block', marginTop: 8, fontSize: 13 }}>Role</label>
              <input name="role" value={profile.role} onChange={handleChange} disabled={!isEditing} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
