import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'IS_LOCAL — no BLOB_READ_WRITE_TOKEN set' });
  }
  try {
    const all = await list();
    const filtered = await list({ prefix: 'portfolio-data.json' });

    let blobContent: unknown = null;
    let fetchError: string | null = null;
    if (filtered.blobs.length) {
      const res = await fetch(filtered.blobs[0].url, { cache: 'no-store' });
      if (res.ok) blobContent = await res.json();
      else fetchError = `fetch ${res.status} ${res.statusText}`;
    }

    return NextResponse.json({
      allBlobs: all.blobs.map(b => ({ pathname: b.pathname, url: b.url, size: b.size })),
      filteredBlobs: filtered.blobs.map(b => ({ pathname: b.pathname, url: b.url, size: b.size })),
      blobContent,
      fetchError,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
