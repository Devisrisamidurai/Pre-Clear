import { Shield, Truck, CheckCircle, FileCheck, MessageSquare, Zap, ArrowRight } from 'lucide-react';
import { WorkflowDiagram } from './WorkflowDiagram';

export function HomePage({ onLogin, onSignup }) {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
      style={{ background: "#FBF9F6" }} // cream page background
    >
      {/* Header */}
      <header
        className="border-b border-white/10 bg-white/5 backdrop-blur"
        style={{ background: "#FBF9F6", borderColor: "#EADFD8" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center"
              style={{ background: "#E6B800" }}
            >
              <Shield className="w-7 h-7 text-slate-900" style={{ color: "#2F1B17" }} />
            </div>
            <div>
              <h1 className="text-white text-xl" style={{ color: "#2F1B17" }}>
                Pre-Clear
              </h1>
              <p className="text-yellow-400 text-xs" style={{ color: "#7A5B52" }}>
                AI-Powered Customs Compliance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onSignup}
              className="px-6 py-2.5 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-all"
              style={{
                borderColor: "#E6B800",
                color: "#2F1B17",
                background: "transparent",
              }}
            >
              Sign Up
            </button>
            <button
              onClick={onLogin}
              className="px-6 py-2.5 bg-yellow-500 text-slate-900 rounded-lg hover:bg-yellow-400 transition-all shadow-lg"
              style={{ background: "#E6B800", color: "#2F1B17" }}
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center" style={{ background: "transparent" }}>
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-6"
            style={{ background: "#FFF3CC", borderColor: "#E6B800" }}
          >
            <Zap className="w-4 h-4 text-yellow-400" style={{ color: "#E6B800" }} />
            <span className="text-yellow-400 text-sm" style={{ color: "#2F1B17" }}>
              AI + Broker Dual Approval System
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl text-white mb-6" style={{ color: "#2F1B17" }}>
            Streamline Your
            <br />
            <span className="text-yellow-400" style={{ color: "#E6B800" }}>
              Customs Pre-Clearance
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto" style={{ color: "#7A5B52" }}>
            Get AI-powered compliance checks and expert broker approval before shipping. 
            Faster customs clearance, reduced delays, zero surprises.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onLogin}
              className="px-8 py-4 bg-yellow-500 text-slate-900 rounded-xl hover:bg-yellow-400 transition-all shadow-2xl flex items-center gap-2 group"
              style={{ background: "#E6B800", color: "#2F1B17" }}
            >
              <span className="text-lg">Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ color: "#2F1B17" }} />
            </button>
          
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6" style={{ background: "#FFF8EE", borderColor: "#EADFD8" }}>
            <p className="text-4xl text-yellow-400 mb-2" style={{ color: "#E6B800" }}>98%</p>
            <p className="text-slate-300 text-sm" style={{ color: "#7A5B52" }}>AI Accuracy</p>
          </div>
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6" style={{ background: "#FFF8EE", borderColor: "#EADFD8" }}>
            <p className="text-4xl text-yellow-400 mb-2" style={{ color: "#E6B800" }}>50%</p>
            <p className="text-slate-300 text-sm" style={{ color: "#7A5B52" }}>Faster Clearance</p>
          </div>
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6" style={{ background: "#FFF8EE", borderColor: "#EADFD8" }}>
            <p className="text-4xl text-yellow-400 mb-2" style={{ color: "#E6B800" }}>24/7</p>
            <p className="text-slate-300 text-sm" style={{ color: "#7A5B52" }}>Broker Support</p>
          </div>
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6" style={{ background: "#FFF8EE", borderColor: "#EADFD8" }}>
            <p className="text-4xl text-yellow-400 mb-2" style={{ color: "#E6B800" }}>10K+</p>
            <p className="text-slate-300 text-sm" style={{ color: "#7A5B52" }}>Shipments Cleared</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-white mb-4" style={{ color: "#2F1B17" }}>How It Works</h2>
          <p className="text-slate-300" style={{ color: "#7A5B52" }}>Simple 6-step process to pre-clear your shipments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 relative" style={{ background: "#FFF8EE", borderColor: "#EADFD8" }}>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4" style={{ background: "#E6B800" }}>
              <FileCheck className="w-6 h-6 text-white" style={{ color: "#2F1B17" }} />
            </div>
            <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center" style={{ background: "#E6B800" }}>
              <span className="text-slate-900 text-sm" style={{ color: "#2F1B17" }}>1</span>
            </div>
            <h3 className="text-white text-xl mb-2" style={{ color: "#2F1B17" }}>Enter Shipment Details</h3>
            <p className="text-slate-400 text-sm" style={{ color: "#7A5B52" }}>
              Shipper enters all shipment information and uploads required documents
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 relative" style={{ background: "#FFF8EE", borderColor: "#EADFD8" }}>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4" style={{ background: "#E6B800" }}>
              <Zap className="w-6 h-6 text-white" style={{ color: "#2F1B17" }} />
            </div>
            <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center" style={{ background: "#E6B800" }}>
              <span className="text-slate-900 text-sm" style={{ color: "#2F1B17" }}>2</span>
            </div>
            <h3 className="text-white text-xl mb-2" style={{ color: "#2F1B17" }}>AI Evaluation</h3>
            <p className="text-slate-400 text-sm" style={{ color: "#7A5B52" }}>
              Click "Get AI Approval" and AI evaluates compliance instantly
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 relative" style={{ background: "#FFF8EE", borderColor: "#EADFD8" }}>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4" style={{ background: "#E6B800" }}>
              <CheckCircle className="w-6 h-6 text-white" style={{ color: "#2F1B17" }} />
            </div>
            <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center" style={{ background: "#E6B800" }}>
              <span className="text-slate-900 text-sm" style={{ color: "#2F1B17" }}>3</span>
            </div>
            <h3 className="text-white text-xl mb-2" style={{ color: "#2F1B17" }}>Request Broker Review</h3>
            <p className="text-slate-400 text-sm" style={{ color: "#7A5B52" }}>
              After AI approval, request expert broker verification
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 relative" style={{ background: "#FFF8EE", borderColor: "#EADFD8" }}>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4" style={{ background: "#E6B800" }}>
              <MessageSquare className="w-6 h-6 text-white" style={{ color: "#2F1B17" }} />
            </div>
            <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center" style={{ background: "#E6B800" }}>
              <span className="text-slate-900 text-sm" style={{ color: "#2F1B17" }}>4</span>
            </div>
            <h3 className="text-white text-xl mb-2" style={{ color: "#2F1B17" }}>Broker Reviews</h3>
            <p className="text-slate-400 text-sm" style={{ color: "#7A5B52" }}>
              Broker approves, denies, or requests missing documents via chat
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 relative" style={{ background: "#FFF8EE", borderColor: "#EADFD8" }}>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4" style={{ background: "#E6B800" }}>
              <Shield className="w-6 h-6 text-slate-900" style={{ color: "#2F1B17" }} />
            </div>
            <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center" style={{ background: "#E6B800" }}>
              <span className="text-slate-900 text-sm" style={{ color: "#2F1B17" }}>5</span>
            </div>
            <h3 className="text-white text-xl mb-2" style={{ color: "#2F1B17" }}>Token Generated</h3>
            <p className="text-slate-400 text-sm" style={{ color: "#7A5B52" }}>
              Dual approval generates unique shipment token for pre-clearance
            </p>
          </div>

          {/* Step 6 */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 relative" style={{ background: "#FFF8EE", borderColor: "#EADFD8" }}>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4" style={{ background: "#E6B800" }}>
              <Truck className="w-6 h-6 text-white" style={{ color: "#2F1B17" }} />
            </div>
            <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center" style={{ background: "#E6B800" }}>
              <span className="text-slate-900 text-sm" style={{ color: "#2F1B17" }}>6</span>
            </div>
            <h3 className="text-white text-xl mb-2" style={{ color: "#2F1B17" }}>Book & Ship</h3>
            <p className="text-slate-400 text-sm" style={{ color: "#7A5B52" }}>
              Use token to book shipment, complete payment, and ship with confidence
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-white mb-4" style={{ color: "#2F1B17" }}>Platform Features</h2>
          <p className="text-slate-300" style={{ color: "#7A5B52" }}>Everything you need for seamless pre-clearance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6" style={{ background: "#FFF8EE", borderColor: "#EADFD8" }}>
            <Zap className="w-10 h-10 text-blue-400 mb-4" style={{ color: "#E6B800" }} />
            <h3 className="text-white mb-2" style={{ color: "#2F1B17" }}>AI-Powered Analysis</h3>
            <p className="text-slate-400 text-sm" style={{ color: "#7A5B52" }}>
              Instant compliance checks with 98% accuracy using advanced NLP and machine learning
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6" style={{ background: "#FFF8EE", borderColor: "#EADFD8" }}>
            <CheckCircle className="w-10 h-10 text-green-400 mb-4" style={{ color: "#E6B800" }} />
            <h3 className="text-white mb-2" style={{ color: "#2F1B17" }}>Expert Broker Review</h3>
            <p className="text-slate-400 text-sm" style={{ color: "#7A5B52" }}>
              Licensed customs brokers verify all documents and ensure 100% compliance
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6" style={{ background: "#FFF8EE", borderColor: "#EADFD8" }}>
            <MessageSquare className="w-10 h-10 text-yellow-400 mb-4" style={{ color: "#E6B800" }} />
            <h3 className="text-white mb-2" style={{ color: "#2F1B17" }}>Real-Time Communication</h3>
            <p className="text-slate-400 text-sm" style={{ color: "#7A5B52" }}>
              Chat directly with brokers, get instant feedback, and resolve issues quickly
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6" style={{ background: "#FFF8EE", borderColor: "#EADFD8" }}>
            <Shield className="w-10 h-10 text-purple-400 mb-4" style={{ color: "#E6B800" }} />
            <h3 className="text-white mb-2" style={{ color: "#2F1B17" }}>Secure Token System</h3>
            <p className="text-slate-400 text-sm" style={{ color: "#7A5B52" }}>
              Unique tokens for pre-approved shipments ensure streamlined customs processing
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-6" style={{ background: "#FFF8EE", borderColor: "#EADFD8" }}>
            <Truck className="w-10 h-10 text-red-400 mb-4" style={{ color: "#E6B800" }} />
            <h3 className="text-white mb-2" style={{ color: "#2F1B17" }}>Integrated Booking</h3>
            <p className="text-slate-400 text-sm" style={{ color: "#7A5B52" }}>
              Book shipments directly with UPS using your pre-clear token
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6" style={{ background: "#FFF8EE", borderColor: "#EADFD8" }}>
            <FileCheck className="w-10 h-10 text-cyan-400 mb-4" style={{ color: "#E6B800" }} />
            <h3 className="text-white mb-2" style={{ color: "#2F1B17" }}>Complete Audit Trail</h3>
            <p className="text-slate-400 text-sm" style={{ color: "#7A5B52" }}>
              Full approval logs, document history, and compliance tracking for every shipment
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-12 text-center" style={{ background: "#E6B800" }}>
          <h2 className="text-4xl text-slate-900 mb-4" style={{ color: "#2F1B17" }}>Ready to Get Started?</h2>
          <p className="text-slate-800 text-lg mb-8" style={{ color: "#40261F" }}>
            Join thousands of shippers who have streamlined their customs process
          </p>
          <button
            onClick={onLogin}
            className="px-10 py-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-2xl text-lg"
            style={{ background: "#2F1B17", color: "#FFFFFF" }}
          >
            Sign In to Pre-Clear
          </button>
        </div>
      </section>

      {/* Footer - updated with About, Contact, Features */}
      <footer className="border-t border-white/10 bg-white/5 backdrop-blur mt-20" style={{ background: "#2F1B17", borderColor: "#4A332D" }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: "#E6B800" }}>
                  <Shield className="w-8 h-8" style={{ color: "#2F1B17" }} />
                </div>
                <div>
                  <div className="font-semibold" style={{ color: "#FFF8EE" }}>Pre-Clear</div>
                  <div className="text-sm" style={{ color: "#B9A59D" }}>AI-Powered Customs Compliance</div>
                </div>
              </div>
              <p className="text-sm" style={{ color: "#B9A59D" }}>
                Streamline customs pre-clearance with AI + broker verification.
              </p>
            </div>

            {/* About Us */}
            <div>
              <h5 className="font-semibold mb-4" style={{ color: "#FFF8EE" }}>About Us</h5>
              <p className="text-sm" style={{ color: "#B9A59D" }}>
                Pre-Clear simplifies international shipping by combining AI-driven compliance checks with expert broker review to reduce delays and ensure regulatory adherence.
              </p>
            </div>

            {/* Features */}
            <div>
              <h5 className="font-semibold mb-4" style={{ color: "#FFF8EE" }}>Features</h5>
              <ul className="space-y-3 text-sm" style={{ color: "#B9A59D" }}>
                <li>AI Compliance Evaluation</li>
                <li>Broker Review & Chat</li>
                <li>Secure Token-based Booking</li>
                <li>Complete Audit Trails</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h5 className="font-semibold mb-4" style={{ color: "#FFF8EE" }}>Contact</h5>
              <ul className="space-y-3 text-sm" style={{ color: "#B9A59D" }}>
                <li>Email: <a href="mailto:support@preclear.example" style={{ color: "#E6B800" }}>support@preclear.example</a></li>
                <li>Phone: <a href="tel:+1234567890" style={{ color: "#E6B800" }}>+1 (234) 567-890</a></li>
                <li>Office: 123 Logistics Ave, Suite 400</li>
                <li>Hours: Mon–Fri, 9am–6pm</li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-6" style={{ borderColor: "#4A332D" }}>
            <div className="flex items-center justify-between text-sm" style={{ color: "#B9A59D" }}>
              <div>© {new Date().getFullYear()} Pre-Clear. All rights reserved.</div>
              <div>
                <a href="#" style={{ color: "#FFF8EE", marginRight: 12 }}>Privacy</a>
                <a href="#" style={{ color: "#FFF8EE" }}>Terms</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
