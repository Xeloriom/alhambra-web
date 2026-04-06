import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-static';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fname, lname, email, service, message, website_url } = body;

    // Honeypot check
    if (website_url) {
      return NextResponse.json({ message: 'Bot detected' }, { status: 400 });
    }

    // Path to the bookings storage
    const filePath = path.join(process.cwd(), 'lib', 'bookings.json');

    try {
      // Read current bookings
      const fileData = await fs.readFile(filePath, 'utf-8');
      const bookings = JSON.parse(fileData);

      // Add new booking with timestamp
      const newBooking = {
        ...body,
        id: Date.now(),
        date: new Date().toISOString()
      };

      bookings.push(newBooking);

      // Write back to file
      await fs.writeFile(filePath, JSON.stringify(bookings, null, 2), 'utf-8');
    } catch (fsError) {
      console.error('Error saving booking to file:', fsError);
      // Even if file saving fails, we continue (maybe log it)
    }

    console.log('Nouveau message reçu et enregistré:', body);

    return NextResponse.json({ message: 'Email envoyé avec succès' }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Erreur lors de l\'envoi' }, { status: 500 });
  }
}
