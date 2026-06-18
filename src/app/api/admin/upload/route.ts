import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

const IS_LOCAL = !process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const folder = (formData.get('folder') as string) || 'images';

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  if (IS_LOCAL) {
    const dir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, fileName), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `/uploads/${fileName}` });
  }

  const blob = await put(`${folder}/${fileName}`, file, { access: 'public' });
  return NextResponse.json({ url: blob.url });
}
