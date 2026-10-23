import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateVerdict, generateTimelineData, sanitizeAnalysisResult } from './forensicLogic';
import { Verdict } from '../types';

test('calculateVerdict correctly categorizes authenticity scores', () => {
  assert.equal(calculateVerdict(95), Verdict.REAL);
  assert.equal(calculateVerdict(90), Verdict.REAL);
  assert.equal(calculateVerdict(89), Verdict.SUSPICIOUS);
  assert.equal(calculateVerdict(70), Verdict.SUSPICIOUS);
  assert.equal(calculateVerdict(69), Verdict.FAKE);
  assert.equal(calculateVerdict(1), Verdict.FAKE);
  assert.equal(calculateVerdict(0), Verdict.INCONCLUSIVE);
});

test('generateTimelineData clamps between 0 and 100 and flags scores < 50', () => {
  const data = generateTimelineData(40, 5, () => 0.5); // variance 0 -> score 40
  assert.equal(data.length, 5);
  assert.equal(data[0].score, 40);
  assert.equal(data[0].flag, true);

  const highData = generateTimelineData(95, 3, () => 0.9); // variance +4 -> 99
  assert.equal(highData[0].score, 99);
  assert.equal(highData[0].flag, false);
});

test('sanitizeAnalysisResult handles empty or missing properties safely', () => {
  const result = sanitizeAnalysisResult({});
  assert.equal(result.verdict, 'Inconclusive — Further Analysis Required');
  assert.equal(result.authenticityScore, 0);
  assert.equal(result.domainAnalysis.biological.status, 'FAIL');
  assert.ok(result.findings.length > 0);
});
