import React from 'react';
import { Cpu, Layers, Database, Code, Zap } from 'lucide-react';

export const Technology: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-6">The Architecture of Truth</h2>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          VeriSight-AI utilizes a multi-modal ensemble approach, combining spectral frequency analysis, biometric verification, and generative artifact detection.
        </p>
      </div>

      {/* Tech Stack Diagram */}
      <div className="bg-forensic-800/50 rounded-2xl border border-forensic-700 p-8 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <Code className="h-64 w-64" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="text-forensic-accent font-mono text-xs mb-2">LAYER 1</div>
            <div className="font-bold text-white">Input Processing</div>
            <div className="text-xs text-slate-500 mt-2">FFmpeg • OpenCV • Librosa</div>
          </div>
          <div className="flex items-center justify-center text-slate-600">
            <Zap className="h-6 w-6 rotate-90 md:rotate-0" />
          </div>
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="text-forensic-accent font-mono text-xs mb-2">LAYER 2</div>
            <div className="font-bold text-white">Spectral Inference</div>
            <div className="text-xs text-slate-500 mt-2">EfficientNet • ViT • ResNet-50</div>
          </div>
          <div className="flex items-center justify-center text-slate-600">
            <Zap className="h-6 w-6 rotate-90 md:rotate-0" />
          </div>
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="text-forensic-accent font-mono text-xs mb-2">LAYER 3</div>
            <div className="font-bold text-white">Explainability & Legal XAI</div>
            <div className="text-xs text-slate-500 mt-2">Gemma 4 (31B / 26B) • Daubert Compliance</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
           <div className="flex items-start">
             <div className="bg-purple-900/30 p-3 rounded-lg mr-4 border border-purple-500/30">
               <Layers className="h-6 w-6 text-purple-400" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-white mb-2">Spectral Residual Analysis</h3>
               <p className="text-slate-400 text-sm leading-relaxed">
                 Beyond standard DCT, we utilize Spectral Residuals to isolate noise patterns unique to Latent Diffusion Models (SDXL, Midjourney v6). This exposes the synthetic nature of "perfect" textures by analyzing high-frequency consistencies.
               </p>
             </div>
           </div>

           <div className="flex items-start">
             <div className="bg-blue-900/30 p-3 rounded-lg mr-4 border border-blue-500/30">
               <Cpu className="h-6 w-6 text-blue-400" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-white mb-2">Vision Transformers (ViT)</h3>
               <p className="text-slate-400 text-sm leading-relaxed">
                 Unlike traditional CNNs, our Vision Transformers analyze global context, spotting inconsistencies in lighting shadows and reflections that local convolution filters often miss.
               </p>
             </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="flex items-start">
             <div className="bg-emerald-900/30 p-3 rounded-lg mr-4 border border-emerald-500/30">
               <Database className="h-6 w-6 text-emerald-400" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-white mb-2">Multimodal Audio-Visual Sync</h3>
               <p className="text-slate-400 text-sm leading-relaxed">
                 For video deepfakes, we correlate lip movements with phoneme audio data. Any temporal misalignment or unnatural mouth shaping triggers a high-confidence alert.
               </p>
             </div>
           </div>

           <div className="flex items-start">
             <div className="bg-amber-900/30 p-3 rounded-lg mr-4 border border-amber-500/30">
               <Code className="h-6 w-6 text-amber-400" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-white mb-2">Explainable AI (Gemma 4 XAI)</h3>
               <p className="text-slate-400 text-sm leading-relaxed">
                 A black box verdict is useless in court. We utilize Google's open-weight <b>Gemma 4 (gemma-4-31b-it)</b> to synthesize natural-language, courtroom-ready forensic explanations and legal admissibility assessments under FRE Rule 901 and the Daubert standard.
               </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};