// Emails the team when an enquiry arrives.
//
// This matters more than it looks. Before the database existed, every enquiry
// landed in an inbox because a form service relayed it there. A database that
// nobody opens is a worse lead-capture system than that, so a new enquiry
// still produces an email — and if that email cannot be sent, the row records
// it (notify_status = 'failed') and the admin page shows a banner, instead of
// the failure being visible only in a log nobody reads.
//
// Resend's HTTPS API is used rather than SMTP because Railway blocks outbound
// SMTP on its lower plans. The enquiry is saved BEFORE any of this runs, and a
// notification failure never turns a saved enquiry into an error for the
// visitor.

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function rowsToMessage(title, rows, footer) {
  const present = rows.filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '');
  const text = [title, '', ...present.map(([k, v]) => `${k}: ${v}`), '', footer].join('\n');
  const html =
    `<div style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#1E2E40;max-width:560px">` +
    `<h2 style="font-size:18px;margin:0 0 16px">${escapeHtml(title)}</h2>` +
    `<table style="border-collapse:collapse;width:100%">` +
    present
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 12px 6px 0;color:#5A6A75;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td>` +
          `<td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`
      )
      .join('') +
    `</table><p style="margin-top:20px;color:#5A6A75;font-size:13px">${escapeHtml(footer)}</p></div>`;
  return { text, html };
}

export function inquiryEmail(row, adminUrl) {
  const isQuote = row.kind === 'quote';
  const title = isQuote ? `Quote request: ${row.product}` : 'New consultation request';
  const { text, html } = rowsToMessage(
    title,
    [
      ['Name', row.name],
      ['Email', row.email],
      ['Phone', row.phone],
      ['Company', row.company],
      ['Product', row.product],
      ['Service', row.service],
      ['Preferred date', row.preferred_date],
      ['Message', row.message],
    ],
    `Reply to this email to answer the visitor directly. Manage it in the admin: ${adminUrl}`
  );
  return { subject: `${isQuote ? 'Quote request' : 'Consultation request'} — ${row.name}`, text, html, replyTo: row.email };
}

export function applicationEmail(row, adminUrl) {
  const { text, html } = rowsToMessage(
    'New career application',
    [
      ['Name', row.name],
      ['Email', row.email],
      ['Message', row.message],
      ['CV', row.cv_original_name ? `${row.cv_original_name} (${Math.round(row.cv_size / 1024)} KB) — download it from the admin` : 'not attached'],
    ],
    `Manage it in the admin: ${adminUrl}`
  );
  return { subject: `Career application — ${row.name}`, text, html, replyTo: row.email };
}

export function createNotifier(config, log = console) {
  const configured = Boolean(config.resendApiKey && config.notifyTo.length);

  return {
    configured,
    /** Resolves { status: 'sent' | 'skipped' | 'failed', error? }. Never rejects. */
    async send({ subject, text, html, replyTo }) {
      if (!configured) return { status: 'skipped' };
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${config.resendApiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: config.notifyFrom,
            to: config.notifyTo,
            subject,
            text,
            html,
            reply_to: replyTo || undefined,
          }),
          signal: AbortSignal.timeout(10_000),
        });
        if (!res.ok) {
          const detail = await res.text().catch(() => '');
          throw new Error(`Resend responded ${res.status} ${detail.slice(0, 200)}`);
        }
        return { status: 'sent' };
      } catch (err) {
        log.error(`[notify] failed: ${err.message}`);
        return { status: 'failed', error: err.message };
      }
    },
  };
}
