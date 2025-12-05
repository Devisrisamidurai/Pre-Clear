import { useState } from 'react';
import { Shield, User, Briefcase, Settings, ArrowRight, ArrowLeft } from 'lucide-react';

export function LoginPage({ onLogin, onNavigate }) {
  const [selectedRole, setSelectedRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole) {
      onLogin(selectedRole);
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
          <h1 className="text-4xl text-white mb-3">Welcome to UPS Pre-Clear</h1>
          <p className="text-slate-300 text-lg">Select your role and sign in to continue</p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
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

        {/* Login Form */}
        {selectedRole && (
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8 max-w-md mx-auto">
            <h2 className="text-white text-2xl mb-6">
              Sign in as {roles.find(r => r.id === selectedRole)?.name}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-slate-300">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Remember me</span>
                </label>
                <button type="button" className="text-yellow-400 text-sm hover:underline">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-yellow-500 text-slate-900 rounded-xl hover:bg-yellow-400 transition-all shadow-xl flex items-center justify-center gap-2 group"
              >
                <span className="text-lg">Sign In</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-slate-400 text-sm">
                Don't have an account?{' '}
                <button 
                  onClick={() => onNavigate('signup')}
                  className="text-yellow-400 hover:underline"
                >
                  Sign Up
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

