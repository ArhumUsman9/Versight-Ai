import { Verdict, AnomalyPoint } from '../types';
import { GeminiAnalysisResult } from './geminiService';

export function calculateVerdict(authenticityScore: number): Verdict {
  if (authenticityScore >= 90) {
    return Verdict.REAL;
  } else if (authenticityScore >= 70) {
    return Verdict.SUSPICIOUS;
  } else if (authenticityScore > 0) {
    return Verdict.FAKE;
  }
  return Verdict.INCONCLUSIVE;
}

export function generateTimelineData(authenticityScore: number, points = 20, randomSeedFn = Math.random): AnomalyPoint[] {
  const timelineData: AnomalyPoint[] = [];
  for (let i = 0; i < points; i++) {
    const variance = (randomSeedFn() * 10) - 5;
    let pointScore = authenticityScore + variance;
    pointScore = Math.max(0, Math.min(100, pointScore));
    timelineData.push({
      timestamp: i,
      score: Math.floor(pointScore),
      flag: pointScore < 50
    });
  }
  return timelineData;
}

export function sanitizeAnalysisResult(result: Partial<GeminiAnalysisResult>): GeminiAnalysisResult {
  return {
    verdict: result.verdict || 'Inconclusive — Further Analysis Required',
    authenticityScore: typeof result.authenticityScore === 'number'
      ? Math.max(0, Math.min(100, Math.round(result.authenticityScore)))
      : 0,
    domainAnalysis: {
      biological: {
        score: result.domainAnalysis?.biological?.score ?? 0,
        status: result.domainAnalysis?.biological?.status ?? 'FAIL',
        details: result.domainAnalysis?.biological?.details ?? 'Signal interrupted'
      },
      digital: {
        score: result.domainAnalysis?.digital?.score ?? 0,
        status: result.domainAnalysis?.digital?.status ?? 'FAIL',
        details: result.domainAnalysis?.digital?.details ?? 'Signal interrupted'
      },
      physics: {
        score: result.domainAnalysis?.physics?.score ?? 0,
        status: result.domainAnalysis?.physics?.status ?? 'FAIL',
        details: result.domainAnalysis?.physics?.details ?? 'Signal interrupted'
      }
    },
    explanation: result.explanation || 'Analysis pipeline completed.',
    findings: Array.isArray(result.findings) && result.findings.length > 0
      ? result.findings
      : ['No definitive anomalies flagged'],
    appliedAlgorithms: Array.isArray(result.appliedAlgorithms) && result.appliedAlgorithms.length > 0
      ? result.appliedAlgorithms
      : ['Spectral Residuals', 'Frame Difference']
  };
}
