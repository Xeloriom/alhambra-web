import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// const ADMIN_PASSWORD = "AlhambraAdmin2024!"; // Temporarily removed for easier testing

export async function GET(req: Request) {
  // const url = new URL(req.url);
  // const password = url.searchParams.get('password');

  // if (password !== ADMIN_PASSWORD) {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const filePath = path.join(process.cwd(), 'lib', 'bookings.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    const bookings = JSON.parse(fileData);
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    // If file doesn't exist yet, return an empty array instead of 500
    if ((error as any).code === 'ENOENT') {
      return NextResponse.json([], { status: 200 });
    }
    console.error('Error reading bookings file:', error);
    return NextResponse.json({ message: 'Error fetching bookings' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  // const url = new URL(req.url);
  // const password = url.searchParams.get('password');
  // const id = url.searchParams.get('id');

  // if (password !== ADMIN_PASSWORD) {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  // }

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
