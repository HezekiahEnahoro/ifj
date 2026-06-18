import { ImageResponse } from 'next/og';
import { readData } from '@/lib/data';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export const revalidate = 0;

export default async function Icon() {
  const { profile } = await readData();

  const initials = profile.name
    ? profile.name
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'P';

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: 'linear-gradient(135deg, #00d9ff, #a855f7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          color: '#050812',
          fontSize: initials.length === 1 ? 18 : 14,
          fontWeight: 800,
          letterSpacing: '-0.5px',
          fontFamily: 'sans-serif',
        }}
      >
        {initials}
      </div>
    ),
    { ...size }
  );
}
