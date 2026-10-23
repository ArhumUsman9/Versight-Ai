import React, { useState } from 'react';
import { UploadZone } from './UploadZone';
import { Scanner } from './Scanner';
import { ResultsDashboard } from './ResultsDashboard';
import { ReportView } from './ReportView';
import { AnalysisStatus, AnalysisRequest, ForensicReport, MediaType } from '../types';
import { runDeepfakeScan } from '../services/mockAnalysisService';

export const ForensicDashboard: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [request, setRequest] = useState<AnalysisRequest | null>(null);
  const [report, setReport] = useState<ForensicReport | null>(null);
  const [viewMode, setViewMode] = useState<'dashboard' | 'report'>('dashboard');

  const handleFileSelection = (file: File, type: MediaType) => {
    // Create preview
    const url = URL.createObjectURL(file);
    
    // For images we can also use FileReader for base64 if needed, 
    // but ObjectURL works for preview.
    // However, the mock service expects a dataURL for the Gemini API.
    // Let's keep the FileReader pattern for Images.
    
    if (type === MediaType.IMAGE) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          startAnalysis(file, e.target.result as string, type);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // For Video/Audio, just use the Object URL for preview/src 
      // and pass the file object for "processing"
      startAnalysis(file, url, type);
    }
  };

  const startAnalysis = async (file: File, previewUrl: string, type: MediaType) => {
    setRequest({
      file,
      previewUrl,
      mediaType: type
    });
    setStatus(AnalysisStatus.SCANNING);
    
    try {
      const result = await runDeepfakeScan(file, previewUrl, type);
      setReport(result);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (error) {
      console.error(error);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AnalysisStatus.IDLE);
    setRequest(null);
    setReport(null);
    setViewMode('dashboard');
  };

  if (viewMode === 'report' && report && request) {
    return (
      <ReportView 
        report={report} 
        imageSrc={request.previewUrl} 
        onBack={() => setViewMode('dashboard')} 
      />
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)]">
      {status === AnalysisStatus.IDLE && (
        <div className="animate-in fade-in duration-700">
            <UploadZone onFileSelected={handleFileSelection} />
            
            {/* Background decorative elements */}
            <div className="fixed -z-10 top-1/3 left-1/4 w-96 h-96 bg-forensic-accent/5 rounded-full blur-3xl"></div>
            <div className="fixed -z-10 bottom-1/4 right-1/4 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl"></div>
        </div>
      )}

      {status === AnalysisStatus.SCANNING && request && (
        <div className="animate-in fade-in duration-500">
            <Scanner 
              imageSrc={request.mediaType === MediaType.AUDIO ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1080' : request.previewUrl} 
              mediaType={request.mediaType}
            />
        </div>
      )}

      {status === AnalysisStatus.COMPLETE && report && request && (
        <div className="animate-in slide-in-from-bottom-4 duration-700">
          <ResultsDashboard 
            report={report} 
            imageSrc={request.mediaType === MediaType.AUDIO ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1080' : request.previewUrl}
            onViewReport={() => setViewMode('report')}
            onReset={handleReset}
          />
        </div>
      )}

      {status === AnalysisStatus.ERROR && (
        <div className="max-w-md mx-auto mt-20 p-6 bg-forensic-800 border border-forensic-danger rounded-lg text-center">
          <h3 className="text-xl text-white font-bold mb-2">Analysis Failed</h3>
          <p className="text-slate-400 mb-4">The system encountered an unexpected error processing the artifact.</p>
          <button onClick={handleReset} className="px-4 py-2 bg-forensic-700 hover:bg-forensic-600 rounded text-white">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};