import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

import { initializeDemoCase } from '@/lib/demo-init';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    let caseData = store.getCase(resolvedParams.id);
    if (!caseData && resolvedParams.id === 'demo-case-1') {
      initializeDemoCase();
      caseData = store.getCase(resolvedParams.id);
    }
    if (!caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }
    return NextResponse.json(caseData);
  } catch (error) {
    console.error('Error fetching case:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await req.json();
    const updatedCase = store.updateCase(resolvedParams.id, {
      ...body,
      updatedAt: new Date().toISOString()
    });
    if (!updatedCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }
    return NextResponse.json(updatedCase);
  } catch (error) {
    console.error('Error updating case:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
