import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await readData();
  const project = data.projects.find((p) => p.id === id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const data = await readData();
  const idx = data.projects.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  data.projects[idx] = { ...data.projects[idx], ...body };
  await writeData(data);
  return NextResponse.json(data.projects[idx]);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await readData();
  data.projects = data.projects.filter((p) => p.id !== id);
  await writeData(data);
  return NextResponse.json({ success: true });
}
