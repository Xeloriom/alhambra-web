import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-static';

export async function GET(req: Request) {
  try {
    const filePath = path.join(process.cwd(), 'lib', 'bookings.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    const bookings = JSON.parse(fileData);
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return NextResponse.json([], { status: 200 });
    }
    console.error('Error reading bookings file:', error);
    return NextResponse.json({ message: 'Error fetching bookings' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'ID required' }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'lib', 'bookings.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    let bookings = JSON.parse(fileData);
    
    bookings = bookings.filter((b: any) => b.id.toString() !== id);
    
    await fs.writeFile(filePath, JSON.stringify(bookings, null, 2), 'utf-8');
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting booking' }, { status: 500 });
  }
}
