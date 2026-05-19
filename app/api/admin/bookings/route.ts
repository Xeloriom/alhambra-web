export const dynamic = 'force-static';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidToken } from '@/app/api/auth/route';
import fs from 'fs/promises';
import path from 'path';

async function requireAuth(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get('alhambra_admin')?.value || '';
  return isValidToken(token);
}

export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const filePath = path.join(process.cwd(), 'lib', 'bookings.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(fileData), { status: 200 });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json([], { status: 200 });
    }
    console.error('Error reading bookings file:', error);
    return NextResponse.json({ message: 'Error fetching bookings' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'ID required' }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'lib', 'bookings.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    const bookings = JSON.parse(fileData).filter(
      (b: { id: string | number }) => b.id.toString() !== id
    );
    await fs.writeFile(filePath, JSON.stringify(bookings, null, 2), 'utf-8');
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ message: 'Error deleting booking' }, { status: 500 });
  }
}
