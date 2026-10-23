import React, { useEffect, useState, useRef } from 'react';
import { Scan, Terminal, Activity } from 'lucide-react';
import { MediaType } from '../types';

interface ScannerProps {
  imageSrc: string;
  mediaType: MediaType;
}

export const Scanner: React.FC<ScannerProps> = ({ imageSrc, mediaType }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);
  
  const logSequence = [
    "> INITIALIZING_FORENSIC_KERNEL_V5...",
    "> LOADING_SPECTRAL_RESIDUAL_WEIGHTS... [OK]",
    "> EXTRACTING_HIGH_DENSITY_KEYFRAMES (n=10)...",
    "> EXECUTING_FOURIER_TRANSFORM_ANALYSIS...",
    "> DETECTING_DIFFUSION_NOISE_PATTERNS (SDXL/MJv6)...",
    "> ANALYZING_LATENT_SPACE_ARTIFACTS...",
    "> TRACKING_TEMPORAL_IDENTITY_DRIFT...",
    "> MEASURING_SKIN_REFLECTANCE_CONSISTENCY...",
    "> AUDITING_COMPRESSION_BLOCK_ARTIFACTS...",
    "> CALCULATING_PHYSICS_VIOLATION_INDEX...",
    "> CROSS_REFERENCING_KNOWN_GAN_FINGERPRINTS...",
    "> FINALIZING_ADVERSARIAL_VERDICT..."
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < logSequence.length) {
        setLogs(prev => [...prev, logSequence[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 400); // Speed of logs

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 flex flex-col items-center">
      <div className="relative w-full max-w-2xl aspect-video rounded-lg overflow-hidden border border-forensic-accent/30 shadow-2xl bg-black flex">
        
        {/* Left: Media Preview */}
        <div className="w-1/2 relative border-r border-forensic-700">
            {mediaType === MediaType.VIDEO ? (
            <video 
                src={imageSrc} 
                className="w-full h-full object-cover opacity-60" 
                autoPlay 
                muted 
                loop 
                playsInline
            />
            ) : (
            <img 
                src={imageSrc} 
                alt="Analyzing" 
                className="w-full h-full object-cover opacity-50" 
            />
            )}
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-forensic-accent/10 to-transparent w-full h-full animate-[scan_1.5s_ease-in-out_infinite] border-b border-forensic-accent shadow-[0_0_15px_rgba(14,165,233,0.4)]"></div>
             {/* Face Box Overlay */}
             <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-forensic-accent/50 rounded animate-pulse">
                <div className="absolute -top-3 -left-1 text-[8px] bg-forensic-accent text-black px-1">TRACKING_ID_01</div>
             </div>
             {/* Micro grid overlay */}
             <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:8px_8px] opacity-20 pointer-events-none mix-blend-overlay"></div>
        </div>

        {/* Right: Terminal Log */}
        <div className="w-1/2 bg-forensic-950 p-4 font-mono text-xs flex flex-col">
            <div className="flex items-center space-x-2 text-forensic-accent mb-2 border-b border-forensic-800 pb-2">
                <Terminal className="h-3 w-3" />
                <span>KERNEL_LOG</span>
            </div>
            <div className="flex-grow overflow-hidden relative">
                <div className="space-y-1 text-slate-300">
                    {logs.map((log, i) => (
                        <div key={i} className="animate-fade-in-up text-forensic-accent/90">{log}</div>
                    ))}
                    <div ref={logsEndRef} />
                </div>
            </div>
             <div className="mt-2 text-forensic-warn flex items-center justify-between">
                <span className="animate-pulse font-bold tracking-widest">DEEP_SCAN</span>
                <Activity className="h-3 w-3 animate-spin-slow" />
             </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="flex items-center justify-center space-x-2 text-forensic-accent">
          <Scan className="h-5 w-5 animate-spin-slow" />
          <span className="text-lg font-mono font-medium tracking-wider">
            SPECTRAL_RESIDUAL_ANALYSIS
          </span>
        </div>
        <p className="text-slate-500 text-xs mt-2">Correlating frequency domain artifacts across 10 high-density keyframes.</p>
      </div>
    </div>
  );
};