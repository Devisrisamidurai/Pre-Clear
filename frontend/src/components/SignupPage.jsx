import { useState } from 'react';
import { Shield, User, Briefcase, Settings, ArrowRight, ArrowLeft } from 'lucide-react';
import { signUp } from '../api/auth';

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
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
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
    
    // Call backend signup API
    setServerError(null);
    setIsSubmitting(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        company: formData.company,
        phone: formData.phone,
        role: selectedRole,
        tosAccepted: formData.tosAccepted || false
      };

      const res = await signUp(payload);
      // Backend returns created location and body with id/email when successful
      alert('Account created successfully! Please sign in.');
      setIsSubmitting(false);
      onNavigate('login');
    } catch (err) {
      setIsSubmitting(false);
      // axios error handling
      const code = err?.response?.data?.error;
      if (code) {
        // map known server error codes to friendly messages
        const map = {
          email_required: 'Email is required.',
          invalid_email_format: 'Email must contain @ and .com',
          password_required: 'Password is required.',
          password_too_short: 'Password must be at least 8 characters.',
          password_needs_digit: 'Password must include at least one number.',
          password_needs_symbol: 'Password must include at least one special character.',
          email_taken: 'Email is already registered.',
          server_error: 'Server error. Please try again later.'
        };
        setServerError(map[code] || code);
      } else {
        setServerError('Server error. Please try again later.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const roles = [
    {
      id: 'shipper',
      name: 'Shipper',
      icon: User,
      description: 'Create shipments, upload documents, and track approvals',
      color: 'blue'
    },
    {
      id: 'broker',
      name: 'Customs Broker',
      icon: Briefcase,
      description: 'Review documents, approve shipments, and communicate with shippers',
      color: 'purple'
    },
    {
      id: 'admin',
      name: 'Admin / UPS Operations',
      icon: Settings,
      description: 'Manage users, monitor AI, and view system analytics',
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Shield className="w-10 h-10 text-slate-900" />
          </div>
          <h1 className="text-4xl text-white mb-3">Create Your Account</h1>
          <p className="text-slate-300 text-lg">Select your role and sign up to get started</p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                className={`p-8 rounded-2xl border-2 transition-all text-left ${
                  isSelected
                    ? `border-${role.color}-500 bg-${role.color}-500/10 shadow-2xl scale-105`
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                  isSelected ? `bg-${role.color}-500` : 'bg-white/10'
                }`}>
                  <Icon className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-slate-300'}`} />
                </div>
                <h3 className="text-white text-xl mb-2">{role.name}</h3>
                <p className="text-slate-400 text-sm">{role.description}</p>
                
                {isSelected && (
                  <div className="mt-4 flex items-center gap-2 text-yellow-400">
                    <span className="text-sm">Selected</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {errors.role && (
          <p className="text-red-400 text-sm text-center mb-4">{errors.role}</p>
        )}

        {/* Signup Form */}
        {selectedRole && (
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-white text-2xl mb-6">
              Sign up as {roles.find(r => r.id === selectedRole)?.name}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
                {errors.company && (
                  <p className="text-red-400 text-sm mt-1">{errors.company}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Phone Number (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password (min. 8 characters)"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  name="tosAccepted"
                  checked={formData.tosAccepted || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, tosAccepted: e.target.checked }))}
                  className="rounded"
                  required
                />
                <span className="text-sm">I agree to the Terms of Service and Privacy Policy</span>
              </div>

              {serverError && (
                <p className="text-red-400 text-sm mt-2">{serverError}</p>
              )}

              <button
                type="submit"
                className="w-full px-6 py-4 bg-yellow-500 text-slate-900 rounded-xl hover:bg-yellow-400 transition-all shadow-xl flex items-center justify-center gap-2 group"
              >
                <span className="text-lg">Create Account</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-slate-400 text-sm">
                Already have an account?{' '}
                <button 
                  onClick={() => onNavigate('login')}
                  className="text-yellow-400 hover:underline"
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
            className="text-slate-400 hover:text-white transition-all flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}

