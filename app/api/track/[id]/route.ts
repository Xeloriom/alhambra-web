export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

// 1×1 transparent GIF (43 bytes)
const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64',
);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (id) {
    try {
      const { db } = await import('@/lib/db');
      await db.update('sent_emails', id, {
        is_opened: true,
        opened_at: new Date().toISOString(),
      });
    } catch {
      // Non-critical — still return the pixel
    }
  }

  return new NextResponse(PIXEL, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
