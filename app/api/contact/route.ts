import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fname, lname, email, service, message, website_url } = body;

    // Honeypot check
    if (website_url) {
      return NextResponse.json({ message: 'Bot detected' }, { status: 400 });
    }

    // Ici vous pouvez intégrer Resend ou Nodemailer
    // Exemple avec Resend (nécessite une clé API):
    /*
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Alhambra Web <onboarding@resend.dev>',
        to: ['votre-email@exemple.com'],
        subject: `Nouveau Projet: ${service}`,
        html: `<p><strong>Nom:</strong> ${fname} ${lname}</p><p><strong>Email:</strong> ${email}</p><p><strong>Projet:</strong> ${message}</p>`,
      }),
    });
    */

    console.log('Nouveau message reçu:', body);

    return NextResponse.json({ message: 'Email envoyé avec succès' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erreur lors de l\'envoi' }, { status: 500 });
  }
}
