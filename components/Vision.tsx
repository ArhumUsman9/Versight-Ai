import React from 'react';
import { Target, Users, Globe } from 'lucide-react';

export const Vision: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-6">Our Vision & Mission</h2>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          In an era where seeing is no longer believing, VeriSight-AI stands as the definitive barrier between truth and deception.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Target className="mr-3 text-forensic-accent" />
            The Mission
          </h3>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              Digital misinformation is the cyber-threat of the decade. Deepfakes threaten democratic processes, corporate reputation, and individual privacy.
            </p>
            <p>
              Our mission is to democratize forensic-grade verification. We are building the "SSL for visual media"—a trust layer that instantly validates the authenticity of the content you consume.
            </p>
          </div>
        </div>
        <div className="bg-forensic-800 p-8 rounded-2xl border border-forensic-700 shadow-xl">
          <blockquote className="text-lg italic text-slate-300 mb-6">
            "We don't just detect pixels; we detect intent. Our goal is to make the cost of generating deception higher than the value it creates."
          </blockquote>
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-slate-600"></div>
            <div>
              <div className="text-white font-bold">Arhum Usman</div>
              <div className="text-forensic-accent text-sm">Founder & Chief Scientist</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-forensic-700 pt-16">
        <h3 className="text-2xl font-bold text-white mb-10 text-center">Who We Serve</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-forensic-800/50 p-6 rounded-xl border border-forensic-700/50">
            <Globe className="h-8 w-8 text-blue-400 mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">Media & Journalism</h4>
            <p className="text-slate-400 text-sm">Validating source material before publication to prevent misinformation spread.</p>
          </div>
          <div className="bg-forensic-800/50 p-6 rounded-xl border border-forensic-700/50">
            <Users className="h-8 w-8 text-purple-400 mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">Legal & Judiciary</h4>
            <p className="text-slate-400 text-sm">Providing admissible forensic reports to verify evidence in court proceedings.</p>
          </div>
          <div className="bg-forensic-800/50 p-6 rounded-xl border border-forensic-700/50">
            <Target className="h-8 w-8 text-emerald-400 mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">National Security</h4>
            <p className="text-slate-400 text-sm">Protecting public figures and infrastructure from state-sponsored disinformation attacks.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
