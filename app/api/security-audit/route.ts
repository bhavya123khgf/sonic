import { NextResponse } from 'next/server';
import { getSecurityCheckAudit } from '@/lib/security';

export async function GET() {
  const auditResults = getSecurityCheckAudit();
  const passedCount = auditResults.filter((c) => c.status === 'passed').length;

  return NextResponse.json({
    title: '20 Essential Website Security Checks Audit',
    timestamp: new Date().toISOString(),
    score: `${passedCount} / ${auditResults.length} Passed`,
    percentage: Math.round((passedCount / auditResults.length) * 100),
    checks: auditResults,
  });
}
