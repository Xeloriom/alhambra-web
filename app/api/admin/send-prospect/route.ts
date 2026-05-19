export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';
import { isValidToken } from '@/app/api/auth/route';

async function requireAuth(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get('alhambra_admin')?.value || '';
  return isValidToken(token);
}

function buildEmailHtml(toName: string, message: string, fromName: string, emailId: string): string {
  const BASE = 'https://www.alhambra-web.com';
  const lines = message.split('\n').map(l => `<p style="margin:0 0 14px 0;color:rgba(0,0,0,0.75);font-size:15px;line-height:1.8;">${l || '&nbsp;'}</p>`).join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Alhambra Web</title>
</head>
<body style="margin:0;padding:0;background:#EFEFEF;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#EFEFEF;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" role="presentation" style="max-width:580px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 60px rgba(0,0,0,0.10);">

          <!-- HEADER -->
          <tr>
            <td style="background:#0A0A0A;padding:40px 48px 36px;">
              <img src="${BASE}/logo.png" height="30" alt="Alhambra Web" style="display:block;height:30px;max-width:160px;filter:brightness(0) invert(1);">
              <div style="height:28px;"></div>
              <p style="margin:0;color:rgba(255,255,255,0.35);font-size:9px;font-weight:800;letter-spacing:0.35em;text-transform:uppercase;">
                Studio Créatif &amp; Digital &nbsp;·&nbsp; Lyon
              </p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:48px 48px 36px;">
              <p style="margin:0 0 28px;font-size:22px;font-weight:900;color:#0A0A0A;letter-spacing:-0.03em;">
                Bonjour ${toName.split(' ')[0]}&nbsp;👋
              </p>

              ${lines}

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" role="presentation" style="margin:36px 0;">
                <tr>
                  <td style="background:#0A0A0A;border-radius:99px;">
                    <a href="https://alhambra-web.com" target="_blank"
                       style="display:inline-block;background:#0A0A0A;color:#ffffff;font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:99px;">
                      Voir notre portfolio →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- DIVIDER -->
              <div style="height:1px;background:rgba(0,0,0,0.07);margin:36px 0;"></div>

              <!-- SIGNATURE -->
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="width:40px;height:40px;background:#0A0A0A;border-radius:10px;text-align:center;vertical-align:middle;">
                    <span style="color:white;font-size:18px;font-weight:900;font-style:italic;">A</span>
                  </td>
                  <td style="padding-left:14px;">
                    <p style="margin:0;font-size:13px;font-weight:800;color:#0A0A0A;">${fromName}</p>
                    <p style="margin:2px 0 0;font-size:11px;color:rgba(0,0,0,0.4);font-weight:600;">
                      Alhambra Web &nbsp;·&nbsp;
                      <a href="https://www.alhambra-web.com" style="color:rgba(0,0,0,0.4);text-decoration:none;">alhambra-web.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#F5F5F5;padding:22px 48px;border-top:1px solid rgba(0,0,0,0.06);">
              <p style="margin:0 0 6px;font-size:10px;color:rgba(0,0,0,0.3);text-align:center;line-height:1.6;">
                Vous recevez cet email car vous êtes en contact avec Alhambra Web.
              </p>
              <p style="margin:0;font-size:10px;color:rgba(0,0,0,0.25);text-align:center;">
                © ${new Date().getFullYear()} Alhambra Web &nbsp;·&nbsp; Lyon, France
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
  <!-- Tracking pixel -->
  <img src="${BASE}/api/track.php?id=${emailId}" width="1" height="1" style="display:none;border:0;width:1px;height:1px;" alt="" />
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { to, toName, subject, message, fromName } = await req.json().catch(() => ({}));

  if (!to || !subject || !message) {
    return NextResponse.json({ error: 'Champs requis : to, subject, message' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 });
  }

  const emailId = randomUUID();
  const senderName = fromName || 'Équipe Alhambra Web';
  const html = buildEmailHtml(toName || to, message, senderName, emailId);

  try {
    const nodemailer = (await import('nodemailer')).default;
    const transporter = nodemailer.createTransport({ sendmail: true });
    await transporter.sendMail({
      from:    'Alhambra Web <contact@alhambra-web.com>',
      to,
      subject,
      html,
      replyTo: 'contact@alhambra-web.com',
    });
  } catch (err) {
    console.error('[send-prospect]', err);
    return NextResponse.json({ error: "Erreur d'envoi email" }, { status: 502 });
  }

  // Save to DB (non-blocking — don't fail the request if DB is down)
  const { db } = await import('@/lib/db');
  await db.insert('sent_emails', {
    id:        emailId,
    to_email:  to,
    to_name:   toName || '',
    from_name: senderName,
    subject,
    message,
    is_opened: false,
    sent_at:   new Date().toISOString(),
  }).catch(e => console.warn('[send-prospect] DB save failed:', e));

  return NextResponse.json({ success: true, id: emailId });
}
