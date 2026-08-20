import nodemailer from 'nodemailer';

const hasSmtpConfig = Boolean(process.env.SMTP_HOST);

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    })
  : null;

/**
 * Sends mail via SMTP when configured; otherwise logs to the console so the
 * request still succeeds locally without a mail provider on hand.
 */
export async function sendMail({ subject, text, to }) {
  if (!transporter) {
    console.log(`[mailer:mock] To: ${to || process.env.MAIL_TO}\nSubject: ${subject}\n${text}\n`);
    return { mocked: true };
  }
  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: to || process.env.MAIL_TO,
    subject,
    text,
  });
}

export default sendMail;
