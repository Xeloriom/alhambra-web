import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Force dynamic mode so it doesn't break the static export build
export const dynamic = 'force-dynamic';

const LOCALES_PATH = path.join(process.cwd(), 'locales/fr.json');

export async function GET() {
  try {
    const data = await fs.readFile(LOCALES_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Fichier introuvable' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password, data } = body;

    if (password !== 'AlhambraAdmin2024!') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    await fs.writeFile(LOCALES_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}
