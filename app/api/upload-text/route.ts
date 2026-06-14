export const dynamic = 'force-static';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidToken } from '@/app/api/auth/route';
import path from 'path';
import fs from 'fs/promises';

const ALLOWED_EXT = new Set(['.html', '.css', '.js', '.txt', '.json', '.md', '.xml', '.svg']);

async function requireAuth(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get('alhambra_admin')?.value || '';
  return isValidToken(token);
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { filename, content } = await req.json().catch(() => ({}));

  if (!filename || content === undefined) {
    return NextResponse.json({ error: 'filename et content requis' }, { status: 400 });
  }

  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json({ error: `Extension non autorisée. Autorisées : ${[...ALLOWED_EXT].join(', ')}` }, { status: 400 });
  }

  const safe = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
  const dir = path.join(process.cwd(), 'public', 'files');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, safe), content, 'utf-8');

  return NextResponse.json({ success: true, url: `/files/${safe}`, filename: safe });
}
