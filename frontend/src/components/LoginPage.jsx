import { useState } from "react";
import { signIn } from '../api/auth';
import {
  Shield,
  User,
  Briefcase,
  Settings,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export function LoginPage({ onLogin, onNavigate }) {
  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      alert('Please select a role');
      return;
    }

    try {
      const resp = await signIn({ email, password });
      // store token
      if (resp?.token) {
        localStorage.setItem('pc_token', resp.token);
      }
      const role = resp?.role || selectedRole;
      onLogin(role);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'signin_failed';
      alert('Sign in failed: ' + msg);
    }
  };

  const roles = [
    {
      id: "shipper",
      name: "Shipper",
      icon: User,
      description: "Create shipments, upload documents, and track approvals",
    },
    {
      id: "broker",
      name: "Customs Broker",
      icon: Briefcase,
      description:
        "Review documents, approve shipments, and communicate with shippers",
    },
    {
      id: "admin",
      name: "Admin / UPS Operations",
      icon: Settings,
      description: "Manage users, monitor AI, and view system analytics",
    },
  ];

  /* Color constants (used inline for clarity)
     - Page background: cream (#FBF9F6)
     - Card / role / login backgrounds: cream (#FFF8EE)
     - Coffee brown (text, borders): #2F1B17
     - Coffee soft (muted text): #7A5B52
     - UPS yellow (buttons/accents): #E6B800
     - Muted border: #EADFD8
  */
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#FBF9F6" }}>
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow"
            style={{ background: "#E6B800" }}
          >
            <Shield className="w-10 h-10" style={{ color: "#2F1B17" }} />
          </div>

          <h1 className="text-4xl mb-3 font-semibold" style={{ color: "#2F1B17" }}>
            Welcome to UPS Pre-Clear
          </h1>
          <p className="text-lg" style={{ color: "#7A5B52" }}>
            Select your role and sign in to continue
          </p>
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
                aria-pressed={isSelected}
                className={`p-8 rounded-2xl border transition-all text-left focus:outline-none focus:ring-2`}
                style={{
                  background: "#FFF8EE", // cream card background
                  borderColor: isSelected ? "#E6B800" : "#EADFD8",
                  transform: isSelected ? "scale(1.03)" : "none",
                  boxShadow: isSelected ? "0 10px 30px rgba(46,34,32,0.06)" : "none",
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: isSelected ? "#E6B800" : "#EADFD8",
                    color: isSelected ? "#2F1B17" : "#7A5B52",
                  }}
                >
                  <Icon className="w-7 h-7" style={{ color: isSelected ? "#2F1B17" : "#7A5B52" }} />
                </div>

                <h3 className="text-xl mb-2" style={{ color: "#2F1B17" }}>
                  {role.name}
                </h3>
                <p className="text-sm" style={{ color: "#7A5B52" }}>
                  {role.description}
                </p>

                {isSelected && (
                  <div className="mt-4 flex items-center gap-2" style={{ color: "#E6B800" }}>
                    <span className="text-sm font-medium">Selected</span>
                    <ArrowRight className="w-4 h-4" style={{ color: "#E6B800" }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Login Form */}
        {selectedRole && (
          <div
            className="rounded-2xl p-8 max-w-md mx-auto shadow"
            style={{
              background: "#FFF8EE", // cream background for login section
              border: "1px solid #EADFD8",
            }}
          >
            <h2 className="text-2xl mb-6 font-semibold" style={{ color: "#2F1B17" }}>
              Sign in as {roles.find((r) => r.id === selectedRole)?.name}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2" style={{ color: "#7A5B52" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 rounded-xl focus:outline-none"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #EADFD8",
                    color: "#2F1B17",
                    boxShadow: "none",
                  }}
                />
              </div>

              <div>
                <label className="block mb-2" style={{ color: "#7A5B52" }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 rounded-xl focus:outline-none"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #EADFD8",
                    color: "#2F1B17",
                    boxShadow: "none",
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2" style={{ color: "#7A5B52" }}>
                  <input type="checkbox" />
                  <span className="text-sm">Remember me</span>
                </label>

                <button
                  type="button"
                  className="text-sm"
                  style={{ color: "#E6B800", background: "transparent", border: "none" }}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 focus:outline-none"
                style={{
                  background: "#E6B800", // yellow button
                  color: "#2F1B17", // coffee brown text
                  border: "2px solid #2F1B17", // coffee brown border
                  fontWeight: 600,
                }}
              >
                <span className="text-lg">Sign In</span>
                <ArrowRight className="w-5 h-5" style={{ color: "#2F1B17" }} />
              </button>
            </form>

            <div className="mt-6 pt-6" style={{ borderTop: "1px solid #EADFD8", textAlign: "center" }}>
              <p className="text-sm" style={{ color: "#7A5B52" }}>
                Don't have an account?{" "}
                <button
                  onClick={() => onNavigate("signup")}
                  className="font-medium"
                  style={{ color: "#E6B800", background: "transparent", border: "none" }}
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
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 mx-auto"
            style={{ color: "#7A5B52", background: "transparent", border: "none" }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: "#7A5B52" }} />
            <span style={{ color: "#7A5B52" }}>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
