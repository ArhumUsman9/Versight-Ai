
export enum AnalysisStatus {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export enum Verdict {
  REAL = 'Likely Authentic (High Confidence)',
  SUSPICIOUS = 'Suspicious / Manipulated',
  FAKE = 'Likely AI-Generated (High Confidence)',
  INCONCLUSIVE = 'Inconclusive — Further Analysis Required'
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO'
}

export type PageView = 'home' | 'dashboard' | 'technology' | 'vision';

export interface AnomalyPoint {
  timestamp: number; // Frame index or seconds
  score: number; // 0-100 authenticity score
  flag: boolean;
}

export interface DomainAnalysis {
  score: number; // 0-100
  status: 'PASS' | 'FAIL' | 'WARN';
  details: string;
}

export interface ForensicReport {
  caseId: string;
  timestamp: string;
  fileName: string;
  fileSize: string;
  fileHash: string; // SHA-256
  mediaType: MediaType;
  resolution?: string;
  duration?: string;
  verdict: Verdict;
  authenticityScore: number; // 0-100 (Weighted Average)
  
  // New Granular Metrics
  domainAnalysis: {
    biological: DomainAnalysis; // rPPG, blinking, eyes
    digital: DomainAnalysis;    // Artifacts, ghosting
    physics: DomainAnalysis;    // Lighting, shadows
  };

  appliedAlgorithms: string[]; // List of specific algorithms used

  confidence: number;
  explanation: string; // From Gemini
  timelineData: AnomalyPoint[];
  findings: string[];
  analystNotes?: string;
}

export interface AnalysisRequest {
  file: File;
  previewUrl: string; // Image data URL or Video/Audio Object URL
  mediaType: MediaType;
}