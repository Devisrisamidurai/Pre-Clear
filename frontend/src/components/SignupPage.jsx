import { useState } from 'react';
import { Shield, User, Briefcase, Settings, ArrowRight, ArrowLeft } from 'lucide-react';

export function SignupPage({ onNavigate }) {
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};

    if (!selectedRole) {
      newErrors.role = 'Please select a role';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Registration stub
    alert('Account created successfully! Please sign in.');
    onNavigate('login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const roles = [
    {
      id: 'shipper',
      name: 'Shipper',
      icon: User,
      description: 'Create shipments, upload documents, and track approvals'
    },
    {
      id: 'broker',
      name: 'Customs Broker',
      icon: Briefcase,
      description: 'Review documents, approve shipments, and communicate with shippers'
    },
    {
      id: 'admin',
      name: 'Admin / UPS Operations',
      icon: Settings,
      description: 'Manage users, monitor AI, and view system analytics'
    }
  ];

  /* Color tokens used:
     - page cream: #FBF9F6
     - cream card: #FFF8EE
     - ups yellow: #E6B800
     - coffee brown: #2F1B17
     - coffee soft: #7A5B52
     - muted border: #EADFD8
  */

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: '#FBF9F6' }}
    >
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow"
            style={{ background: '#E6B800' }}
          >
            <Shield className="w-10 h-10" style={{ color: '#2F1B17' }} />
          </div>

          <h1 className="text-4xl text-center mb-3 font-semibold" style={{ color: '#2F1B17' }}>
            Create Your Account
          </h1>
          <p className="text-center" style={{ color: '#7A5B52', fontSize: 16 }}>
            Select your role and sign up to get started
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <button
                key={role.id}
                onClick={() => {
                  setSelectedRole(role.id);
                  setErrors(prev => ({ ...prev, role: '' }));
                }}
                aria-pressed={isSelected}
                className="p-6 rounded-2xl text-left transition-transform focus:outline-none"
                style={{
                  background: '#FFF8EE', // cream background for card
                  border: `1px solid ${isSelected ? '#E6B800' : '#EADFD8'}`,
                  transform: isSelected ? 'scale(1.02)' : 'none',
                  boxShadow: isSelected ? '0 12px 30px rgba(46,34,32,0.06)' : 'none'
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: isSelected ? '#E6B800' : '#EADFD8' }}
                >
                  <Icon className="w-7 h-7" style={{ color: isSelected ? '#2F1B17' : '#7A5B52' }} />
                </div>

                <h3 style={{ color: '#2F1B17', fontSize: 18, marginBottom: 6 }}>{role.name}</h3>
                <p style={{ color: '#7A5B52', fontSize: 14 }}>{role.description}</p>

                {isSelected && (
                  <div className="mt-4 flex items-center gap-2" style={{ color: '#E6B800' }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>Selected</span>
                    <ArrowRight className="w-4 h-4" style={{ color: '#E6B800' }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {errors.role && (
          <p className="text-sm" style={{ color: '#D9534F', textAlign: 'center', marginBottom: 12 }}>
            {errors.role}
          </p>
        )}

        {/* Signup Form (cream card) */}
        {selectedRole && (
          <div
            className="rounded-2xl p-8 max-w-2xl mx-auto shadow"
            style={{ background: '#FFF8EE', border: `1px solid #EADFD8` }}
          >
            <h2 style={{ color: '#2F1B17', fontSize: 20, marginBottom: 12 }}>
              Sign up as {roles.find(r => r.id === selectedRole)?.name}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2" style={{ color: '#7A5B52' }}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className="w-full px-4 py-3 rounded-xl"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #EADFD8',
                      color: '#2F1B17'
                    }}
                    required
                  />
                  {errors.firstName && <p className="text-sm" style={{ color: '#D9534F', marginTop: 6 }}>{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block mb-2" style={{ color: '#7A5B52' }}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className="w-full px-4 py-3 rounded-xl"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #EADFD8',
                      color: '#2F1B17'
                    }}
                    required
                  />
                  {errors.lastName && <p className="text-sm" style={{ color: '#D9534F', marginTop: 6 }}>{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#7A5B52' }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #EADFD8',
                    color: '#2F1B17'
                  }}
                  required
                />
                {errors.email && <p className="text-sm" style={{ color: '#D9534F', marginTop: 6 }}>{errors.email}</p>}
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#7A5B52' }}>Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                  className="w-full px-4 py-3 rounded-xl"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #EADFD8',
                    color: '#2F1B17'
                  }}
                  required
                />
                {errors.company && <p className="text-sm" style={{ color: '#D9534F', marginTop: 6 }}>{errors.company}</p>}
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#7A5B52' }}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 rounded-xl"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #EADFD8',
                    color: '#2F1B17'
                  }}
                />
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#7A5B52' }}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password (min. 8 characters)"
                  className="w-full px-4 py-3 rounded-xl"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #EADFD8',
                    color: '#2F1B17'
                  }}
                  required
                />
                {errors.password && <p className="text-sm" style={{ color: '#D9534F', marginTop: 6 }}>{errors.password}</p>}
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#7A5B52' }}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 rounded-xl"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #EADFD8',
                    color: '#2F1B17'
                  }}
                  required
                />
                {errors.confirmPassword && <p className="text-sm" style={{ color: '#D9534F', marginTop: 6 }}>{errors.confirmPassword}</p>}
              </div>

              <div className="flex items-center gap-2" style={{ color: '#7A5B52' }}>
                <input type="checkbox" required />
                <span className="text-sm">I agree to the Terms of Service and Privacy Policy</span>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 rounded-xl flex items-center justify-center gap-2"
                style={{
                  background: '#E6B800',
                  color: '#2F1B17',
                  border: '2px solid #2F1B17',
                  fontWeight: 600
                }}
              >
                <span style={{ fontSize: 16 }}>Create Account</span>
                <ArrowRight className="w-5 h-5" style={{ color: '#2F1B17' }} />
              </button>
            </form>

            <div className="mt-6 pt-6" style={{ borderTop: '1px solid #EADFD8', textAlign: 'center' }}>
              <p style={{ color: '#7A5B52', fontSize: 14 }}>
                Already have an account?{' '}
                <button
                  onClick={() => onNavigate('login')}
                  style={{ color: '#E6B800', background: 'transparent', border: 'none', fontWeight: 600 }}
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 mx-auto"
            style={{ color: '#7A5B52', background: 'transparent', border: 'none' }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: '#7A5B52' }} />
            <span style={{ color: '#7A5B52' }}>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
