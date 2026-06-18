import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';

export async function GET() {
  const data = await readData();
  return NextResponse.json(data.profile);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const data = await readData();
  data.profile = { ...data.profile, ...body };
  await writeData(data);
  return NextResponse.json(data.profile);
}
