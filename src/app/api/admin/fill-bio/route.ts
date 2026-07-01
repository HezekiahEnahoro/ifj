import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { readData } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function POST() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured.' }, { status: 500 });
  }

  const data = await readData();
  const resumeUrl = data.profile.resume_url;

  if (!resumeUrl) {
    return NextResponse.json({ error: 'No resume uploaded yet. Upload your resume first.' }, { status: 400 });
  }

  const pdfRes = await fetch(resumeUrl);
  if (!pdfRes.ok) {
    return NextResponse.json({ error: 'Could not fetch the resume file.' }, { status: 500 });
  }

  const pdfBase64 = Buffer.from(await pdfRes.arrayBuffer()).toString('base64');

  const client = new Anthropic();

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 },
          },
          {
            type: 'text',
            text: `Based on this resume, write a professional bio for a portfolio website.
Return exactly 2–3 paragraphs written in first person that cover:
1. Who this person is and their core professional identity
2. Their key skills, tools, and what they specialise in
3. What they bring to clients / their working style

Return ONLY the paragraphs, one per line, with no labels, bullet points, or extra commentary.`,
          },
        ],
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const bio = text.split('\n').map((p) => p.trim()).filter(Boolean);

  return NextResponse.json({ bio });
}
