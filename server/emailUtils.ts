/**
 * Shared email utility — wraps the Manus built-in notification API.
 * Falls back to console logging if the API is unavailable (e.g. local dev).
 *
 * Import this wherever transactional emails need to be sent instead of
 * duplicating the fetch logic in each router file.
 */
import { ENV } from "./_core/env";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send a transactional email via the Manus Forge notification API.
 * Returns `true` on success, `false` on failure (never throws).
 */
export async function sendEmail(opts: SendEmailOptions): Promise<boolean> {
  const forgeUrl = ENV.forgeApiUrl?.replace(/\/+$/, "");
  const forgeKey = ENV.forgeApiKey;

  if (!forgeUrl || !forgeKey) {
    console.warn("[Email] Forge API not configured — logging email instead:");
    console.log(`TO: ${opts.to}\nSUBJECT: ${opts.subject}\n---\n${opts.html}`);
    return false;
  }

  try {
    const res = await fetch(`${forgeUrl}/v1/notification/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${forgeKey}`,
      },
      body: JSON.stringify({
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[Email] API error ${res.status}: ${body}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[Email] Unexpected error:", err);
    return false;
  }
}
