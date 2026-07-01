import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await readData();
  return NextResponse.json(data.projects.sort((a, b) => a.sort_order - b.sort_order));
}

export async function POST(req: Request) {
  const body = await req.json();
  const data = await readData();
  data.projects.push(body);
  await writeData(data);
  return NextResponse.json(body, { status: 201 });
}
