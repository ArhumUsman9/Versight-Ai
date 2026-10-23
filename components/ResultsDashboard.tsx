import React, { useEffect, useState } from 'react';
import { ForensicReport, Verdict, MediaType } from '../types';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine
} from 'recharts';
import { FileText, AlertTriangle, CheckCircle, Layers, Cpu, ScanFace, Activity, Eye, Zap, Fingerprint } from 'lucide-react';

interface ResultsDashboardProps {
  report: ForensicReport;
  imageSrc: string;
  onViewReport: () => void;
  onReset: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ report, imageSrc, onViewReport, onReset }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const isFake = report.verdict === Verdict.FAKE;
  const isSuspicious = report.verdict === Verdict.SUSPICIOUS;
  const isInconclusive = report.verdict === Verdict.INCONCLUSIVE;
  
  const verdictColor = isFake ? 'text-forensic-danger' : (isSuspicious || isInconclusive) ? 'text-forensic-warn' : 'text-forensic-safe';
  const verdictBg = isFake ? 'bg-forensic-danger/10 border-forensic-danger/20' : (isSuspicious || isInconclusive) ? 'bg-forensic-warn/10 border-forensic-warn/20' : 'bg-forensic-safe/10 border-forensic-safe/20';
  
  const VerdictIcon = () => {
    if (isFake) return <AlertTriangle className="text-forensic-danger animate-pulse" />;
    if (isSuspicious || isInconclusive) return <Fingerprint className="text-forensic-warn" />;
    return <CheckCircle className="text-forensic-safe" />;
  };

  useEffect(() => {
    let start = 0;
    const end = report.authenticityScore;
    const duration = 1500;
    const incrementTime = 20;
    const step = end / (duration / incrementTime);

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplayScore(end);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [report.authenticityScore]);

  const getHeatmapStyle = () => {
    if (isFake) {
      return {
        background: `radial-gradient(circle at 40% 30%, rgba(239, 68, 68, 0.6) 0%, transparent 25%), radial-gradient(circle at 70% 60%, rgba(239, 68, 68, 0.5) 0%, transparent 30%)`,
      };
    } else if (isSuspicious) {
      return {
        background: `radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.4) 0%, transparent 40%)`,
      };
    } else {
      return {
        background: `radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 60%)`,
      };
    }
  };

  const DomainCard = ({ title, icon: Icon, data }: { title: string, icon: any, data: any }) => (
    <div className="bg-forensic-900/50 p-4 rounded-lg border border-forensic-700">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2 text-slate-300">
          <Icon className="h-4 w-4 text-forensic-accent" />
          <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
        </div>
        <span className={`text-xs font-mono px-2 py-0.5 rounded ${
          data.status === 'FAIL' ? 'bg-red-500/20 text-red-400' : 
          data.status === 'WARN' ? 'bg-amber-500/20 text-amber-400' : 
          'bg-emerald-500/20 text-emerald-400'
        }`}>
          {data.status}
        </span>
      </div>
      <div className="flex items-end space-x-2 mb-2">
        <span className="text-2xl font-bold text-white">{data.score}%</span>
        <span className="text-xs text-slate-500 mb-1">integrity</span>
      </div>
      <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mb-3">
        <div 
          className={`h-full transition-all duration-1000 ${
            data.score < 50 ? 'bg-forensic-danger' : data.score < 80 ? 'bg-forensic-warn' : 'bg-forensic-safe'
          }`}
          style={{ width: `${data.score}%` }}
        />
      </div>
      <p className="text-[10px] text-slate-400 leading-tight">
        {data.details}
      </p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Forensic Dashboard</h2>
          <div className="flex items-center space-x-4 text-sm font-mono mt-1">
             <span className="text-slate-400">CASE: <span className="text-forensic-accent">{report.caseId}</span></span>
             <span className="text-slate-600">|</span>
             <span className="text-slate-400">HASH: <span className="text-slate-200">{report.fileHash.substring(0,8)}...</span></span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button onClick={onReset} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition">
            New Scan
          </button>
          <button onClick={onViewReport} className="flex items-center space-x-2 px-4 py-2 bg-forensic-accent hover:bg-sky-400 text-white rounded-md shadow-lg shadow-sky-500/20 transition-all hover:scale-105">
            <FileText className="h-4 w-4" />
            <span>Official Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visuals (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Main Verdict */}
          <div className={`p-6 rounded-xl border ${verdictBg} backdrop-blur-sm relative overflow-hidden`}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Fingerprint className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Final Classification</span>
                <VerdictIcon />
              </div>
              <h3 className={`text-2xl font-bold mb-6 ${verdictColor} tracking-tight`}>
                {report.verdict}
              </h3>
              
              <div className="flex items-center justify-between text-sm text-slate-400 mb-1">
                 <span>Global Authenticity</span>
                 <span className="text-white font-mono">{displayScore}/100</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${isFake ? 'bg-forensic-danger' : (isSuspicious || isInconclusive) ? 'bg-forensic-warn' : 'bg-forensic-safe'} transition-all duration-1000 ease-out`} 
                  style={{ width: `${displayScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Image Viewer */}
          <div className="bg-forensic-800 rounded-xl border border-forensic-700 overflow-hidden shadow-lg flex flex-col">
            <div className="p-3 border-b border-forensic-700 bg-forensic-900 flex justify-between items-center z-10">
              <span className="text-xs font-mono text-slate-400">ANALYSIS_VIEWPORT</span>
              <button 
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium transition-all
                  ${showHeatmap ? 'bg-forensic-accent text-white' : 'bg-forensic-800 border border-forensic-700 text-slate-400'}
                `}
              >
                <Layers className="h-3 w-3" />
                <span>Heatmap</span>
              </button>
            </div>
            <div className="relative bg-black flex items-center justify-center min-h-[300px]">
              <img src={imageSrc} alt="Analyzed" className="max-w-full max-h-[400px] object-contain relative z-0" />
              <div 
                className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-500 mix-blend-color-dodge ${showHeatmap ? 'opacity-100' : 'opacity-0'}`}
                style={getHeatmapStyle()}
              ></div>
              {showHeatmap && <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:8px_8px] opacity-10"></div>}
            </div>
          </div>
        </div>

        {/* Right Column: Deep Data (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Domain Analysis Matrix */}
          <div className="bg-forensic-800 rounded-xl border border-forensic-700 p-6">
             <h4 className="text-sm font-bold text-white mb-4 flex items-center uppercase tracking-wider">
               <Activity className="h-4 w-4 mr-2 text-forensic-accent" />
               Domain Integrity Matrix
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <DomainCard 
                 title="Biological" 
                 icon={Eye} 
                 data={report.domainAnalysis?.biological || {score:0, status:'FAIL', details:'N/A'}} 
               />
               <DomainCard 
                 title="Digital Artifacts" 
                 icon={Cpu} 
                 data={report.domainAnalysis?.digital || {score:0, status:'FAIL', details:'N/A'}} 
               />
               <DomainCard 
                 title="Physics & Light" 
                 icon={Zap} 
                 data={report.domainAnalysis?.physics || {score:0, status:'FAIL', details:'N/A'}} 
               />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline Chart */}
            <div className="bg-forensic-800 rounded-xl border border-forensic-700 p-6 shadow-lg">
              <h4 className="text-sm font-bold text-white mb-4 flex items-center uppercase tracking-wider">
                <ScanFace className="h-4 w-4 mr-2 text-forensic-accent" />
                Temporal Consistency
              </h4>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={report.timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isFake ? '#ef4444' : '#0ea5e9'} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={isFake ? '#ef4444' : '#0ea5e9'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="timestamp" stroke="#64748b" tick={{fontSize: 10}} />
                    <YAxis stroke="#64748b" domain={[0, 100]} tick={{fontSize: 10}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#e2e8f0', fontSize: '12px' }}
                      itemStyle={{ color: isFake ? '#ef4444' : '#0ea5e9' }}
                    />
                    <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="3 3" />
                    <Area type="monotone" dataKey="score" stroke={isFake ? '#ef4444' : '#0ea5e9'} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Narrative */}
            <div className="bg-forensic-800 rounded-xl border border-forensic-700 p-6 shadow-lg">
               <h4 className="text-sm font-bold text-white mb-4 flex items-center uppercase tracking-wider">
                  <FileText className="h-4 w-4 mr-2 text-forensic-accent" />
                  Forensic Narrative
               </h4>
               <p className="text-slate-300 text-sm leading-relaxed mb-4 h-[120px] overflow-y-auto pr-2 scrollbar-thin">
                 {report.explanation}
               </p>
               <div className="border-t border-forensic-700 pt-3">
                 <div className="text-xs text-slate-500 font-mono flex justify-between">
                   <span>Confidence: {report.confidence}%</span>
                   <span>Model: VS-Ensemble-v4</span>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};