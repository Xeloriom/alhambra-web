// app/api/contact/route.ts
// Gère tous les flux du hero : projet, call, carrière, salut

import { NextResponse } from 'next/server';

export const maxDuration = 30;

// ── Types ──────────────────────────────────────────────────────────

interface ContactPayload {
  type: 'project' | 'call' | 'career' | 'hi';
  answers?: Record<string, string | string[]>;
  contact?: { name: string; email: string; phone?: string; message?: string };
  // Call spécifique
  date?: string;
  time?: string;
  duration?: string;
  message?: string;
  // Hi spécifique (fields à plat)
  name?: string;
  email?: string;
  phone?: string;
}

// ── Formateur de message ──────────────────────────────────────────

function formatMessage(payload: ContactPayload): { subject: string; html: string; text: string } {
  const typeLabels: Record<string, string> = {
    project: '🚀 Nouveau Projet',
    call:    '📞 Réservation Call',
    career:  '✨ Candidature',
    hi:      '👋 Message Général',
  };

  const subject = `[Sohub] ${typeLabels[payload.type] || 'Contact'} — ${
      payload.contact?.name || payload.name || 'Anonyme'
  }`;

  let bodyLines: string[] = [];

  if (payload.type === 'project' && payload.answers) {
    const a = payload.answers;
    bodyLines = [
      `<b>Services :</b> ${Array.isArray(a.services) ? a.services.join(', ') : a.services || '—'}`,
      `<b>Objectif :</b> ${a.goal || '—'}`,
      `<b>Audience :</b> ${a.audience || '—'}`,
      `<b>Délai :</b> ${a.timeline || '—'}`,
      `<b>Budget :</b> ${a.budget || '—'}`,
      `<b>Détails :</b> ${a.extra || '—'}`,
      `<br/><b>Contact :</b> ${payload.contact?.name} — ${payload.contact?.email} — ${payload.contact?.phone || 'N/A'}`,
    ];
  } else if (payload.type === 'call') {
    bodyLines = [
      `<b>Date :</b> ${payload.date || '—'}`,
      `<b>Heure :</b> ${payload.time || '—'}`,
      `<b>Durée :</b> ${payload.duration || '—'}`,
      `<b>Message :</b> ${payload.message || '—'}`,
      `<br/><b>Contact :</b> ${payload.contact?.name} — ${payload.contact?.email} — ${payload.contact?.phone || 'N/A'}`,
    ];
  } else if (payload.type === 'career' && payload.answers) {
    const a = payload.answers;
    bodyLines = [
      `<b>Poste visé :</b> ${a.role || '—'}`,
      `<b>Expérience :</b> ${a.xp || '—'}`,
      `<b>Contrat :</b> ${a.type || '—'}`,
      `<b>Portfolio :</b> ${a.cv || '—'}`,
      `<br/><b>Contact :</b> ${payload.contact?.name} — ${payload.contact?.email} — ${payload.contact?.phone || 'N/A'}`,
    ];
  } else {
    bodyLines = [
      `<b>Nom :</b> ${payload.contact?.name || payload.name || '—'}`,
      `<b>Email :</b> ${payload.contact?.email || payload.email || '—'}`,
      `<b>Téléphone :</b> ${payload.contact?.phone || payload.phone || '—'}`,
      `<b>Message :</b> ${payload.contact?.message || payload.message || '—'}`,
    ];
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="border-bottom: 2px solid #1A1E23; padding-bottom: 12px;">${typeLabels[payload.type]}</h2>
      <div style="line-height: 2; font-size: 15px;">
        ${bodyLines.join('<br/>')}
      </div>
      <p style="margin-top: 32px; font-size: 12px; color: #999;">
        Soumis le ${new Date().toLocaleString('fr-FR')} · Sohub OS
      </p>
    </div>`;

  const text = bodyLines.map(l => l.replace(/<[^>]+>/g, '')).join('\n');

  return { subject, html, text };
}

// ── Handler principal ─────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const payload: ContactPayload = await req.json();

    if (!payload.type) {
      return NextResponse.json({ error: 'Missing type' }, { status: 400 });
    }

    const { subject, html, text } = formatMessage(payload);

    // 1. Sauvegarder dans Supabase (si configuré)
    const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    if (supabaseUrl && supabaseKey) {
      const record = {
        type:       payload.type,
        payload:    JSON.stringify(payload),
        subject,
        created_at: new Date().toISOString(),
        is_read:    false,
      };

      await fetch(`${supabaseUrl}/rest/v1/contact_submissions`, {
        method: 'POST',
        headers: {
          apikey:        supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer:        'return=minimal',
        },
        body: JSON.stringify(record),
      }).catch(e => console.warn('Supabase save failed (non-critical):', e));
    }

    // 2. Envoyer par email via Resend (si RESEND_API_KEY est défini)
    //    Sinon, log dans la console et retourne succès quand même
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail   = process.env.CONTACT_EMAIL || 'hello@sohub.fr';

    if (resendKey) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from:    'Sohub Contact <contact@sohub.fr>',
          to:      [toEmail],
          subject,
          html,
          text,
          // Reply-to vers le client si email disponible
          reply_to: payload.contact?.email || payload.email || undefined,
        }),
      });

      if (!resendRes.ok) {
        const err = await resendRes.text();
        console.error('Resend error:', err);
        // On retourne quand même un succès côté client
        // (le lead est sauvé en base si Supabase est configuré)
      }
    } else {
      // Fallback : log structuré en console (prod : utilisez un vrai service email)
      console.log('📬 Nouveau contact [no Resend]:', {
        type: payload.type,
        subject,
        text,
        received_at: new Date().toISOString(),
      });
    }

    // 3. Optionnel : webhook Slack/Discord/Make.com/Zapier
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text:        `${subject}\n\n${text}`,
          username:    'Sohub Bot',
          icon_emoji:  ':mailbox_with_mail:',
        }),
      }).catch(e => console.warn('Webhook failed:', e));
    }

    return NextResponse.json({ success: true, message: 'Contact enregistré.' });

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}