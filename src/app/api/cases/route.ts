import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { Case } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const cases = store.getCases();
    return NextResponse.json(cases);
  } catch (error) {
    console.error('Error fetching cases:', error);
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, type, description } = body;

    if (!name || !type) {
      return NextResponse.json({ error: 'Name and type are required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const newCase: Case = {
      id: crypto.randomUUID(),
      name,
      type,
      description: description || '',
      status: 'created',
      createdAt: now,
      updatedAt: now,
      mediaCount: 0,
      usefulCount: 0,
      duplicateCount: 0,
      lowQualityCount: 0,
      evidenceGroupCount: 0,
      findingCount: 0,
    };

    store.createCase(newCase);
    return NextResponse.json(newCase, { status: 201 });
  } catch (error) {
    console.error('Error creating case:', error);
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 });
  }
}
