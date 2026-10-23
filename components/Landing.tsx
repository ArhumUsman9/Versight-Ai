import React, { useState } from 'react';
import { ArrowRight, Shield, Fingerprint, Eye, Database } from 'lucide-react';
import { LiveApiModal } from './LiveApiModal';

interface LandingProps {
  onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [showLiveModal, setShowLiveModal] = useState(false);
  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Status Badge */}
          <div className="inline-flex items-center space-x-2 bg-forensic-800/50 border border-forensic-700 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm opacity-0 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-forensic-accent animate-pulse"></span>
            <span className="text-xs font-medium text-forensic-accent tracking-wide uppercase font-mono">System Operational v2.4</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-tight opacity-0 animate-fade-in-up animation-delay-200">
            Trust Nothing.<br/>
            <span className="bg-gradient-to-r from-forensic-accent via-purple-400 to-forensic-accent bg-clip-text text-transparent bg-300 animate-gradient-x">
              Verify Everything.
            </span>
          </h1>
          
          {/* Subtext */}
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in-up animation-delay-400">
            The enterprise standard for deepfake detection. 
            VeriSight-AI restores truth to digital media with <span className="text-slate-200 font-semibold">court-ready evidence</span> and <span className="text-slate-200 font-semibold">explainable AI</span>.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up animation-delay-500">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 bg-forensic-accent hover:bg-sky-500 text-white rounded-lg font-semibold text-lg shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-all flex items-center justify-center group"
            >
              Initialize Scan
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setShowLiveModal(true)}
              className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-forensic-800 text-slate-300 border border-forensic-700 hover:border-forensic-500 rounded-lg font-medium transition-all"
            >
              Live API Demo
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid - Staggered Fade In */}
      <div className="bg-forensic-900/50 border-t border-forensic-800 backdrop-blur-sm opacity-0 animate-fade-in animation-delay-700">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-forensic-800/30 border border-forensic-700/50 hover:border-forensic-accent/30 transition-all hover:-translate-y-1">
              <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <Fingerprint className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Pattern Recognition</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Advanced GAN fingerprinting detects invisible artifacts left by generative models like Midjourney and Stable Diffusion.
              </p>
            </div>
            
            <div className="group p-8 rounded-2xl bg-forensic-800/30 border border-forensic-700/50 hover:border-forensic-accent/30 transition-all hover:-translate-y-1">
              <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                <Eye className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Biometric Consistency</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Frame-by-frame analysis of blood flow (PPG), blinking patterns, and micro-expressions to identify synthetic renders.
              </p>
            </div>
            
            <div className="group p-8 rounded-2xl bg-forensic-800/30 border border-forensic-700/50 hover:border-forensic-accent/30 transition-all hover:-translate-y-1">
              <div className="bg-emerald-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <Shield className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Chain of Custody</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Every analysis generates a cryptographically signed report suitable for legal proceedings and compliance auditing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Backgrounds - Animated */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-forensic-accent/5 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-0 w-full h-full opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      {/* Live API Modal */}
      <LiveApiModal isOpen={showLiveModal} onClose={() => setShowLiveModal(false)} />
    </div>
  );
};
