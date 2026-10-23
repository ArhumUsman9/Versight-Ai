import React, { useEffect } from 'react';
import { ForensicReport, Verdict } from '../types';
import { ShieldCheck, Download, ArrowLeft, Code } from 'lucide-react';

interface ReportViewProps {
  report: ForensicReport;
  imageSrc: string;
  onBack: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, imageSrc, onBack }) => {
  
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `VeriSight_Report_${report.caseId}`;
    return () => {
      document.title = originalTitle;
    };
  }, [report.caseId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `VeriSight_Report_${report.caseId}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const DomainRow = ({ label, data }: { label: string, data: any }) => (
    <tr className="border-b border-slate-100">
      <td className="py-2 text-slate-600 font-semibold">{label}</td>
      <td className="py-2">
        <span className={`text-xs font-bold px-2 py-1 rounded ${
          data.status === 'FAIL' ? 'bg-red-100 text-red-700' : 
          data.status === 'WARN' ? 'bg-amber-100 text-amber-700' : 
          'bg-emerald-100 text-emerald-700'
        }`}>
          {data.status}
        </span>
      </td>
      <td className="py-2 text-slate-800 font-mono text-center">{data.score}%</td>
      <td className="py-2 text-slate-500 text-xs italic">{data.details}</td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20 print:bg-white print:pb-0">
      {/* Action Bar */}
      <div className="print:hidden bg-forensic-900 text-white p-4 sticky top-0 z-50 shadow-lg flex justify-between items-center no-print">
        <button onClick={onBack} className="flex items-center space-x-2 text-slate-400 hover:text-white transition">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex space-x-3">
          <button onClick={handleDownloadJSON} className="px-4 py-2 text-sm bg-forensic-800 hover:bg-forensic-700 rounded-md border border-forensic-700">
            Download JSON
          </button>
          <button onClick={handlePrint} className="px-4 py-2 text-sm bg-forensic-accent hover:bg-sky-500 rounded-md shadow-md flex items-center space-x-2 text-white">
            <Download className="h-4 w-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Area */}
      <div id="printable-report" className="max-w-[210mm] mx-auto bg-white min-h-[297mm] p-12 mt-8 shadow-xl print:shadow-none print:mt-0 print:mx-0 print:w-full print:p-0">
        
        {/* Header */}
        <div className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-end">
          <div>
            <div className="flex items-center space-x-2 text-slate-900 mb-2">
               <ShieldCheck className="h-8 w-8 text-forensic-900" />
               <h1 className="text-2xl font-bold tracking-tight">VeriSight-AI</h1>
            </div>
            <p className="text-sm text-slate-500 uppercase tracking-widest">Digital Forensics Laboratory</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-bold">FORENSIC ANALYSIS REPORT</p>
            <p className="font-mono text-slate-600">ID: {report.caseId}</p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-8 p-6 bg-slate-50 rounded-lg border border-slate-200 print:bg-transparent print:border-slate-300">
           <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Primary Verdict</p>
                <p className={`text-3xl font-bold mt-2 ${
                  report.verdict === Verdict.FAKE ? 'text-red-600' : report.verdict === Verdict.SUSPICIOUS ? 'text-amber-600' : 'text-emerald-600'
                }`}>{report.verdict}</p>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Authenticity Confidence</span>
                  <span className="font-bold">{report.authenticityScore}%</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden print:border print:border-slate-300">
                  <div className={`h-full ${
                     report.authenticityScore < 50 ? 'bg-red-600' : 'bg-emerald-600'
                  }`} style={{ width: `${report.authenticityScore}%`}}></div>
                </div>
              </div>
           </div>
        </div>

        {/* Detailed Domain Breakdown */}
        <div className="mb-8">
           <h2 className="text-sm font-bold text-slate-900 uppercase mb-4 border-b border-slate-200 pb-2">Technical Domain Analysis</h2>
           <table className="w-full text-sm">
             <thead>
               <tr className="text-left text-slate-400 text-xs uppercase">
                 <th className="pb-2 w-1/4">Vector</th>
                 <th className="pb-2 w-1/6">Status</th>
                 <th className="pb-2 w-1/6 text-center">Score</th>
                 <th className="pb-2">Forensic Detail</th>
               </tr>
             </thead>
             <tbody>
               {report.domainAnalysis && (
                 <>
                   <DomainRow label="Biological Consistency" data={report.domainAnalysis.biological} />
                   <DomainRow label="Digital Artifacts" data={report.domainAnalysis.digital} />
                   <DomainRow label="Physics & Lighting" data={report.domainAnalysis.physics} />
                 </>
               )}
             </tbody>
           </table>
        </div>

        {/* Methodology Section (NEW) */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-slate-900 uppercase mb-4 border-b border-slate-200 pb-2">Applied Methodology & Algorithms</h2>
          <div className="bg-slate-50 p-4 rounded border border-slate-200">
             <div className="grid grid-cols-2 gap-4">
                {report.appliedAlgorithms && report.appliedAlgorithms.map((algo, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-slate-700">
                     <Code className="h-3 w-3 text-slate-400" />
                     <span>{algo}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Evidence & Visuals */}
        <div className="mb-8 grid grid-cols-2 gap-8">
           <div>
             <h2 className="text-sm font-bold text-slate-900 uppercase mb-4 border-b border-slate-200 pb-2">File Metadata</h2>
             <table className="w-full text-sm">
               <tbody>
                 <tr className="border-b border-slate-100"><td className="py-1 text-slate-500">Filename</td><td className="py-1">{report.fileName}</td></tr>
                 <tr className="border-b border-slate-100"><td className="py-1 text-slate-500">Hash</td><td className="py-1 font-mono text-xs">{report.fileHash.substring(0,12)}...</td></tr>
                 <tr className="border-b border-slate-100"><td className="py-1 text-slate-500">Resolution</td><td className="py-1">{report.resolution}</td></tr>
                 <tr className="border-b border-slate-100"><td className="py-1 text-slate-500">Type</td><td className="py-1">{report.mediaType}</td></tr>
               </tbody>
             </table>
           </div>
           <div>
             <h2 className="text-sm font-bold text-slate-900 uppercase mb-4 border-b border-slate-200 pb-2">Visual Exhibit</h2>
             <div className="bg-slate-100 border border-slate-200 p-2 flex justify-center h-[140px]">
               <img src={imageSrc} className="h-full object-contain" alt="Evidence" />
             </div>
           </div>
        </div>

        {/* Detailed Findings */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-slate-900 uppercase mb-4 border-b border-slate-200 pb-2">Expert Findings</h2>
          <div className="bg-slate-50 p-4 rounded border border-slate-200 text-sm text-slate-700 leading-relaxed text-justify mb-4">
             {report.explanation}
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
             {report.findings.map((f, i) => (
               <li key={i}><span className="font-semibold text-slate-900">Observation {i+1}:</span> {f}</li>
             ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-300 break-inside-avoid">
           <div className="flex justify-between items-end text-xs text-slate-500">
             <div>
               <p className="font-bold text-slate-700 mb-1">Authorized Analyst</p>
               <p className="font-mono text-lg text-slate-900">Arhum Usman</p>
               <p className="text-[10px] mt-1">Founder & Chief Scientist</p>
             </div>
             <div className="text-right">
               <p>Generated by VeriSight-AI System v3.0 (Adversarial Engine)</p>
               <p className="font-mono mt-1">SIG: {report.fileHash.substring(0,16)}</p>
               <p className="text-emerald-600 font-bold mt-1">Chain of Custody Validated</p>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};