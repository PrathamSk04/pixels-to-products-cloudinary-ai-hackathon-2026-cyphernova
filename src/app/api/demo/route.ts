import { NextRequest, NextResponse } from 'next/server';
import { initializeDemoCase } from '@/lib/demo-init';

export async function POST(req: NextRequest) {
  try {
    const caseId = await initializeDemoCase();
    return NextResponse.json({ caseId });
  } catch (error) {
    console.error('Error initializing demo case:', error);
    return NextResponse.json({ error: 'Failed to initialize demo case' }, { status: 500 });
  }
}
