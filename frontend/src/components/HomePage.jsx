import { Shield, Truck, CheckCircle, FileCheck, MessageSquare, Zap, ArrowRight } from 'lucide-react';
import { WorkflowDiagram } from './WorkflowDiagram';

export function HomePage({ onLogin, onSignup }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Shield className="w-7 h-7 text-slate-900" />
            </div>
            <div>
              <h1 className="text-white text-xl">UPS Pre-Clear</h1>
              <p className="text-yellow-400 text-xs">AI-Powered Customs Compliance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onSignup}
              className="px-6 py-2.5 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-all"
            >
              Sign Up
            </button>
            <button
              onClick={onLogin}
              className="px-6 py-2.5 bg-yellow-500 text-slate-900 rounded-lg hover:bg-yellow-400 transition-all shadow-lg"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-6">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm">AI + Broker Dual Approval System</span>
          </div>
          <h1 className="text-5xl md:text-6xl text-white mb-6">
            Streamline Your<br />
            <span className="text-yellow-400">Customs Pre-Clearance</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Get AI-powered compliance checks and expert broker approval before shipping. 
            Faster customs clearance, reduced delays, zero surprises.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onLogin}
              className="px-8 py-4 bg-yellow-500 text-slate-900 rounded-xl hover:bg-yellow-400 transition-all shadow-2xl flex items-center gap-2 group"
            >
              <span className="text-lg">Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border-2 border-white/20 text-white rounded-xl hover:bg-white/10 transition-all">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
            <p className="text-4xl text-yellow-400 mb-2">98%</p>
            <p className="text-slate-300 text-sm">AI Accuracy</p>
          </div>
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
            <p className="text-4xl text-yellow-400 mb-2">50%</p>
            <p className="text-slate-300 text-sm">Faster Clearance</p>
          </div>
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
            <p className="text-4xl text-yellow-400 mb-2">24/7</p>
            <p className="text-slate-300 text-sm">Broker Support</p>
          </div>
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
            <p className="text-4xl text-yellow-400 mb-2">10K+</p>
            <p className="text-slate-300 text-sm">Shipments Cleared</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-white mb-4">How It Works</h2>
          <p className="text-slate-300">Simple 6-step process to pre-clear your shipments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 relative">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-slate-900 text-sm">1</span>
            </div>
            <h3 className="text-white text-xl mb-2">Enter Shipment Details</h3>
            <p className="text-slate-400 text-sm">
              Shipper enters all shipment information and uploads required documents
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 relative">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-slate-900 text-sm">2</span>
            </div>
            <h3 className="text-white text-xl mb-2">AI Evaluation</h3>
            <p className="text-slate-400 text-sm">
              Click "Get AI Approval" and AI evaluates compliance instantly
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 relative">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-slate-900 text-sm">3</span>
            </div>
            <h3 className="text-white text-xl mb-2">Request Broker Review</h3>
            <p className="text-slate-400 text-sm">
              After AI approval, request expert broker verification
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 relative">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-slate-900 text-sm">4</span>
            </div>
            <h3 className="text-white text-xl mb-2">Broker Reviews</h3>
            <p className="text-slate-400 text-sm">
              Broker approves, denies, or requests missing documents via chat
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 relative">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-slate-900" />
            </div>
            <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-slate-900 text-sm">5</span>
            </div>
            <h3 className="text-white text-xl mb-2">Token Generated</h3>
            <p className="text-slate-400 text-sm">
              Dual approval generates unique shipment token for pre-clearance
            </p>
          </div>

          {/* Step 6 */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 relative">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-slate-900 text-sm">6</span>
            </div>
            <h3 className="text-white text-xl mb-2">Book & Ship</h3>
            <p className="text-slate-400 text-sm">
              Use token to book shipment, complete payment, and ship with confidence
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-white mb-4">Platform Features</h2>
          <p className="text-slate-300">Everything you need for seamless pre-clearance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
            <Zap className="w-10 h-10 text-blue-400 mb-4" />
            <h3 className="text-white mb-2">AI-Powered Analysis</h3>
            <p className="text-slate-400 text-sm">
              Instant compliance checks with 98% accuracy using advanced NLP and machine learning
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
            <CheckCircle className="w-10 h-10 text-green-400 mb-4" />
            <h3 className="text-white mb-2">Expert Broker Review</h3>
            <p className="text-slate-400 text-sm">
              Licensed customs brokers verify all documents and ensure 100% compliance
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6">
            <MessageSquare className="w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-white mb-2">Real-Time Communication</h3>
            <p className="text-slate-400 text-sm">
              Chat directly with brokers, get instant feedback, and resolve issues quickly
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
            <Shield className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="text-white mb-2">Secure Token System</h3>
            <p className="text-slate-400 text-sm">
              Unique tokens for pre-approved shipments ensure streamlined customs processing
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-6">
            <Truck className="w-10 h-10 text-red-400 mb-4" />
            <h3 className="text-white mb-2">Integrated Booking</h3>
            <p className="text-slate-400 text-sm">
              Book shipments directly with UPS using your pre-clear token
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
            <FileCheck className="w-10 h-10 text-cyan-400 mb-4" />
            <h3 className="text-white mb-2">Complete Audit Trail</h3>
            <p className="text-slate-400 text-sm">
              Full approval logs, document history, and compliance tracking for every shipment
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-12 text-center">
          <h2 className="text-4xl text-slate-900 mb-4">Ready to Get Started?</h2>
          <p className="text-slate-800 text-lg mb-8">
            Join thousands of shippers who have streamlined their customs process
          </p>
          <button
            onClick={onLogin}
            className="px-10 py-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-2xl text-lg"
          >
            Sign In to UPS Pre-Clear
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/5 backdrop-blur mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-white">UPS Pre-Clear</span>
            </div>
            <p className="text-slate-400 text-sm">© 2024 UPS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

