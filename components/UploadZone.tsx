import React, { useCallback, useState } from 'react';
import { UploadCloud, FileImage, FileVideo, FileAudio, AlertCircle, Music, Video, Image as ImageIcon } from 'lucide-react';
import { MediaType } from '../types';

interface UploadZoneProps {
  onFileSelected: (file: File, type: MediaType) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<MediaType>(MediaType.IMAGE);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Auto-detect type based on mime or tab? 
      // For UX, we trust the tab but validation should happen. 
      // Here we simplify and pass the active tab type.
      onFileSelected(e.dataTransfer.files[0], activeTab);
    }
  }, [onFileSelected, activeTab]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0], activeTab);
    }
  };

  const getAcceptTypes = () => {
    switch(activeTab) {
      case MediaType.VIDEO: return "video/*";
      case MediaType.AUDIO: return "audio/*";
      default: return "image/*";
    }
  };

  const getIcon = () => {
    switch(activeTab) {
      case MediaType.VIDEO: return <FileVideo className={`h-12 w-12 ${isDragging ? 'text-forensic-accent' : 'text-slate-400'}`} />;
      case MediaType.AUDIO: return <FileAudio className={`h-12 w-12 ${isDragging ? 'text-forensic-accent' : 'text-slate-400'}`} />;
      default: return <FileImage className={`h-12 w-12 ${isDragging ? 'text-forensic-accent' : 'text-slate-400'}`} />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4">
      {/* Mode Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        {[
          { id: MediaType.IMAGE, label: 'Image Forensics', icon: ImageIcon },
          { id: MediaType.VIDEO, label: 'Deepfake Video', icon: Video },
          { id: MediaType.AUDIO, label: 'Voice Auth', icon: Music },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-t-lg border-b-2 transition-all duration-200
              ${activeTab === tab.id 
                ? 'border-forensic-accent bg-forensic-800 text-white shadow-lg' 
                : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-forensic-800/30'
              }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="font-medium text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      <div 
        className={`relative group border-2 border-dashed rounded-2xl rounded-tl-none transition-all duration-300 ease-in-out
          ${isDragging 
            ? 'border-forensic-accent bg-forensic-accent/5 scale-[1.01]' 
            : 'border-forensic-700 bg-forensic-800/50 hover:border-forensic-accent/50 hover:bg-forensic-800'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
          <div className={`p-6 rounded-full bg-forensic-900 shadow-xl mb-6 group-hover:shadow-forensic-accent/20 transition-all duration-500
            ${isDragging ? 'animate-bounce' : ''}
          `}>
            {getIcon()}
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">
            Upload {activeTab === MediaType.IMAGE ? 'Image Artifact' : activeTab === MediaType.VIDEO ? 'Video Sequence' : 'Audio Sample'}
          </h3>
          <p className="text-slate-400 mb-8 max-w-sm">
            Drag and drop suspect {activeTab.toLowerCase()} files here.
            <br/>
            <span className="text-xs text-slate-500 mt-2 block font-mono">
              Secure Chain-of-Custody Hashing Enabled
            </span>
          </p>

          <label className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-forensic-accent rounded-md shadow-md group cursor-pointer">
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-forensic-accent group-hover:translate-x-0 ease">
              <UploadCloud className="w-5 h-5" />
            </span>
            <span className="absolute flex items-center justify-center w-full h-full text-forensic-accent transition-all duration-300 transform group-hover:translate-x-full ease">Select File</span>
            <span className="relative invisible">Select File</span>
            <input type="file" className="hidden" accept={getAcceptTypes()} onChange={handleFileInput} />
          </label>
        </div>
      </div>

      {/* Pre-calibrated Quick Test Evidence */}
      <div className="mt-6 pt-5 border-t border-forensic-800/80">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3 text-center">
          Or analyze pre-calibrated forensic test evidence:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              const canvas = document.createElement('canvas');
              canvas.width = 640;
              canvas.height = 480;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                // Render synthetic visual artifact pattern
                ctx.fillStyle = '#1e1b4b';
                ctx.fillRect(0, 0, 640, 480);
                const grad = ctx.createRadialGradient(320, 240, 50, 320, 240, 220);
                grad.addColorStop(0, '#f43f5e');
                grad.addColorStop(0.5, '#8b5cf6');
                grad.addColorStop(1, '#0f172a');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(320, 240, 180, 0, Math.PI * 2);
                ctx.fill();
                // Add diffusion-like checkerboard artifact
                ctx.fillStyle = 'rgba(255,255,255,0.08)';
                for (let x = 0; x < 640; x += 16) {
                  for (let y = 0; y < 480; y += 16) {
                    if ((x / 16 + y / 16) % 2 === 0) ctx.fillRect(x, y, 16, 16);
                  }
                }
              }
              canvas.toBlob((blob) => {
                if (blob) {
                  const file = new File([blob], 'suspect_diffusion_render.jpg', { type: 'image/jpeg' });
                  onFileSelected(file, MediaType.IMAGE);
                }
              }, 'image/jpeg', 0.95);
            }}
            className="p-3 bg-forensic-800/90 hover:bg-forensic-750 border border-forensic-danger/30 hover:border-forensic-danger/60 rounded-xl text-left transition flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-500/30 flex items-center justify-center shrink-0">
              <span className="text-red-400 font-mono text-xs font-bold">AI</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-white group-hover:text-red-300 transition">Sample A: Suspect AI Diffusion</div>
              <div className="text-[10px] text-slate-400 font-mono">Diffusion lattice & latent space audit</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              const canvas = document.createElement('canvas');
              canvas.width = 640;
              canvas.height = 480;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                // Render natural organic camera scene
                ctx.fillStyle = '#064e3b';
                ctx.fillRect(0, 0, 640, 480);
                const grad = ctx.createLinearGradient(0, 0, 640, 480);
                grad.addColorStop(0, '#047857');
                grad.addColorStop(0.7, '#065f46');
                grad.addColorStop(1, '#022c22');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, 640, 480);
                // Draw organic facial contour
                ctx.fillStyle = '#fde68a';
                ctx.beginPath();
                ctx.arc(320, 240, 140, 0, Math.PI * 2);
                ctx.fill();
                // Add Poisson-Gaussian noise
                const imgData = ctx.getImageData(0, 0, 640, 480);
                for (let i = 0; i < imgData.data.length; i += 4) {
                  const noise = (Math.random() - 0.5) * 12;
                  imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + noise));
                  imgData.data[i+1] = Math.min(255, Math.max(0, imgData.data[i+1] + noise));
                  imgData.data[i+2] = Math.min(255, Math.max(0, imgData.data[i+2] + noise));
                }
                ctx.putImageData(imgData, 0, 0);
              }
              canvas.toBlob((blob) => {
                if (blob) {
                  const file = new File([blob], 'authentic_camera_sensor.jpg', { type: 'image/jpeg' });
                  onFileSelected(file, MediaType.IMAGE);
                }
              }, 'image/jpeg', 0.95);
            }}
            className="p-3 bg-forensic-800/90 hover:bg-forensic-750 border border-forensic-safe/30 hover:border-forensic-safe/60 rounded-xl text-left transition flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <span className="text-emerald-400 font-mono text-xs font-bold">RAW</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-white group-hover:text-emerald-300 transition">Sample B: Organic Sensor Capture</div>
              <div className="text-[10px] text-slate-400 font-mono">Sensor noise floor & light consistency</div>
            </div>
          </button>
        </div>
      </div>
      
      <div className="mt-5 flex justify-center items-center space-x-2 text-slate-500 text-xs">
        <AlertCircle className="h-3 w-3" />
        <span>Files are processed in sandboxed memory. No persistent storage unless authorized.</span>
      </div>
    </div>
  );
};
