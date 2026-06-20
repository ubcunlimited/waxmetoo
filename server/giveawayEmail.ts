import { sendEmail } from "./emailUtils";
/**
 * Giveaway Email Helpers
 * Uses the Manus built-in notification API to send transactional emails.
 * Falls back to console logging if the API is unavailable.
 */

/** Send the double opt-in confirmation email. */
export async function sendConfirmationEmail(opts: {
  to: string;
  firstName: string;
  confirmUrl: string;
}): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirm Your Giveaway Entry — Wax Me Too</title>
</head>
<body style="margin:0;padding:0;background:#F7F3EE;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EE;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(59,47,42,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#3B2F2A;padding:32px 40px;text-align:center;">
              <p style="color:#CFA7A0;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px;">Professional Waxing Studio</p>
              <h1 style="color:#F7F3EE;font-size:32px;margin:0;font-weight:700;letter-spacing:-0.5px;">Wax Me Too</h1>
              <p style="color:#D8C6B6;font-size:12px;margin:8px 0 0;">Est. 2007 · Utah's Premier Waxing Studio</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h2 style="color:#3B2F2A;font-size:24px;margin:0 0 16px;">You're almost entered, ${opts.firstName}! 🎉</h2>
              <p style="color:#4A4A4A;font-size:16px;line-height:1.7;margin:0 0 24px;">
                Thank you for entering our <strong>Win a Free Wax</strong> giveaway! To complete your entry and be eligible to win a complimentary waxing service, please confirm your email address by clicking the button below.
              </p>
              <div style="text-align:center;margin:32px 0;">
                <a href="${opts.confirmUrl}" style="display:inline-block;background:#CFA7A0;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:50px;font-size:16px;font-weight:700;letter-spacing:0.5px;">
                  ✓ Confirm My Entry
                </a>
              </div>
              <p style="color:#A8B3AA;font-size:13px;line-height:1.6;margin:24px 0 0;">
                If you didn't enter our giveaway, you can safely ignore this email. This link will expire in 48 hours.
              </p>
            </td>
          </tr>
          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #D8C6B6;margin:0;" />
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="color:#A8B3AA;font-size:12px;margin:0 0 8px;">Wax Me Too · Professional Waxing Studio · Utah</p>
              <p style="color:#A8B3AA;font-size:11px;margin:0;">
                <a href="https://waxmetoo.com" style="color:#CFA7A0;text-decoration:none;">waxmetoo.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return sendEmail({
    to: opts.to,
    subject: "✓ Confirm your entry — Win a Free Wax at Wax Me Too!",
    html,
  });
}

/** Send the winner notification email. */
export async function sendWinnerEmail(opts: {
  to: string;
  firstName: string;
  month: string;
}): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>You Won! — Wax Me Too</title>
</head>
<body style="margin:0;padding:0;background:#F7F3EE;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EE;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(59,47,42,0.08);">
          <tr>
            <td style="background:#3B2F2A;padding:32px 40px;text-align:center;">
              <h1 style="color:#F7F3EE;font-size:32px;margin:0;">Wax Me Too</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#3B2F2A;font-size:28px;margin:0 0 16px;">🎉 Congratulations, ${opts.firstName}!</h2>
              <p style="color:#4A4A4A;font-size:16px;line-height:1.7;margin:0 0 20px;">
                You've been selected as the <strong>${opts.month} winner</strong> of our <strong>Win a Free Wax</strong> giveaway! You've won a complimentary waxing service at any of our 6 Utah locations.
              </p>
              <p style="color:#4A4A4A;font-size:16px;line-height:1.7;margin:0 0 32px;">
                Please reply to this email or call us at <strong>(801) 572-7771</strong> to schedule your free appointment. Your prize is valid for 30 days.
              </p>
              <div style="text-align:center;">
                <a href="https://waxmetoo.com/locations" style="display:inline-block;background:#CFA7A0;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:50px;font-size:16px;font-weight:700;">
                  Find a Location Near You
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;text-align:center;background:#F7F3EE;">
              <p style="color:#A8B3AA;font-size:12px;margin:0;">Wax Me Too · Professional Waxing Studio · Utah · Est. 2007</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return sendEmail({
    to: opts.to,
    subject: `🎉 You won the ${opts.month} Wax Me Too Giveaway!`,
    html,
  });
}
