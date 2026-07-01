import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await readData();
  return NextResponse.json(data.experience.sort((a, b) => a.sort_order - b.sort_order));
}

export async function POST(req: Request) {
  const body = await req.json();
  const newItem = { id: crypto.randomUUID(), ...body };
  const data = await readData();
  data.experience.push(newItem);
  await writeData(data);
  return NextResponse.json(newItem, { status: 201 });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...updates } = body;
  const data = await readData();
  const idx = data.experience.findIndex((e) => e.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  data.experience[idx] = { ...data.experience[idx], ...updates };
  await writeData(data);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const data = await readData();
  data.experience = data.experience.filter((e) => e.id !== id);
  await writeData(data);
  return NextResponse.json({ success: true });
}
