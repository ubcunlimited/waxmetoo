import { sendEmail } from "./emailUtils";
/**
 * Mascot Hunt Email Helper
 * Sends a branded confirmation email when a user claims their mascot hunt reward.
 */

/**
 * Send the mascot hunt reward confirmation email.
 * Called immediately after a new reward is created.
 */
export async function sendMascotRewardEmail(opts: {
  to: string;
  fullName: string;
  discountCode: string;
  discountPercent: number;
}): Promise<boolean> {
  const firstName = opts.fullName.split(" ")[0] ?? opts.fullName;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You Found All the Mascots! — Wax Me Too</title>
</head>
<body style="margin:0;padding:0;background:#F7F3EE;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EE;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(59,47,42,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3D1A1A,#6B2D2D);padding:36px 40px;text-align:center;">
              <p style="color:#CFA7A0;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px;">Professional Waxing Studio</p>
              <h1 style="color:#F7F3EE;font-size:32px;margin:0;font-weight:700;letter-spacing:-0.5px;">Wax Me Too</h1>
              <p style="color:#D8C6B6;font-size:12px;margin:8px 0 0;">Est. 2007 · Utah's Premier Waxing Studio</p>
            </td>
          </tr>

          <!-- Hero celebration -->
          <tr>
            <td style="padding:40px 40px 28px;text-align:center;">
              <div style="font-size:52px;margin-bottom:16px;">🎉</div>
              <h2 style="color:#3B2F2A;font-size:26px;margin:0 0 12px;font-weight:700;">
                You Found All 11 Mascots, ${firstName}!
              </h2>
              <p style="color:#4A4A4A;font-size:16px;line-height:1.7;margin:0 0 8px;">
                Congratulations on completing the <strong>Wax Me Too Mascot Hunt</strong>! You've earned a
                <strong>${opts.discountPercent}% discount</strong> on your next waxing service.
              </p>
              <p style="color:#7A6A5A;font-size:14px;line-height:1.6;margin:0;">
                Mention your code when you book your appointment at any of our Utah locations.
              </p>
            </td>
          </tr>

          <!-- Discount code box -->
          <tr>
            <td style="padding:0 40px 32px;">
              <div style="background:linear-gradient(135deg,#3D1A1A,#6B2D2D);border-radius:14px;padding:24px;text-align:center;">
                <p style="color:rgba(255,255,255,0.6);font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">
                  Your ${opts.discountPercent}% Discount Code
                </p>
                <p style="color:#ffffff;font-size:28px;font-weight:700;font-family:monospace;letter-spacing:4px;margin:0 0 12px;">
                  ${opts.discountCode}
                </p>
                <p style="color:rgba(255,255,255,0.55);font-size:12px;margin:0;">
                  Valid for one use · Cannot be combined with other offers
                </p>
              </div>
            </td>
          </tr>

          <!-- How to redeem -->
          <tr>
            <td style="padding:0 40px 32px;">
              <h3 style="color:#3B2F2A;font-size:16px;font-weight:700;margin:0 0 14px;">How to Redeem</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${[
                  ["1", "Book your appointment online or by phone at <strong>(801) 572-7771</strong>"],
                  ["2", "Mention your discount code <strong>${opts.discountCode}</strong> when booking"],
                  ["3", "Enjoy your smooth, confident skin at <strong>${opts.discountPercent}% off</strong>!"],
                ].map(([num, text]) => `
                <tr>
                  <td style="padding:8px 0;vertical-align:top;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:32px;height:32px;background:#CFA7A0;border-radius:50%;text-align:center;vertical-align:middle;font-weight:700;color:#fff;font-size:14px;">
                          ${num}
                        </td>
                        <td style="padding-left:12px;color:#4A4A4A;font-size:14px;line-height:1.6;">${text}</td>
                      </tr>
                    </table>
                  </td>
                </tr>`).join("")}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 36px;text-align:center;">
              <a href="https://waxmetoo.com/locations"
                 style="display:inline-block;background:#CFA7A0;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:50px;font-size:16px;font-weight:700;letter-spacing:0.5px;">
                Book My Appointment →
              </a>
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
              <p style="color:#A8B3AA;font-size:12px;margin:0 0 6px;">Wax Me Too · Professional Waxing Studio · Utah</p>
              <p style="color:#A8B3AA;font-size:11px;margin:0;">
                <a href="https://waxmetoo.com" style="color:#CFA7A0;text-decoration:none;">waxmetoo.com</a>
                &nbsp;·&nbsp;
                <a href="tel:8015727771" style="color:#CFA7A0;text-decoration:none;">(801) 572-7771</a>
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
    subject: `🎉 You found all the mascots! Your ${opts.discountPercent}% discount code inside`,
    html,
  });
}
