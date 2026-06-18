import type { Express } from "express";
import { ENV } from "./env";

// In-memory cache for presigned URLs.
// The Forge API generates CloudFront presigned URLs that expire after ~24 hours.
// Caching them server-side eliminates the 5–6s Forge API round-trip on every
// request, which was the root cause of SEMrush "slow page load" flags on blog posts.
interface CacheEntry {
  url: string;
  expiresAt: number; // Unix ms — evict 30 min before actual expiry for safety
}

const presignedUrlCache = new Map<string, CacheEntry>();

// Parse the Expires query param from a CloudFront presigned URL.
// Returns the expiry as Unix ms, or 0 if not parseable.
function parseExpiry(signedUrl: string): number {
  try {
    const u = new URL(signedUrl);
    const exp = u.searchParams.get("Expires");
    if (exp) return parseInt(exp, 10) * 1000; // seconds → ms
  } catch {
    // ignore
  }
  return 0;
}

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string | number, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }

    // Serve from cache if the entry is still valid (with 30-min safety buffer).
    const now = Date.now();
    const cached = presignedUrlCache.get(key);
    if (cached && cached.expiresAt > now) {
      const ttlSeconds = Math.floor((cached.expiresAt - now) / 1000);
      res.set("Cache-Control", `public, max-age=${Math.min(ttlSeconds, 82800)}`);
      res.redirect(307, cached.url);
      return;
    }

    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
      );
      forgeUrl.searchParams.set("path", key);

      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
      });

      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }

      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }

      // Cache the presigned URL, evicting 30 min before its actual expiry.
      const expiry = parseExpiry(url);
      if (expiry > now) {
        presignedUrlCache.set(key, {
          url,
          expiresAt: expiry - 30 * 60 * 1000, // 30-min safety buffer
        });
      }

      // Tell the browser to cache the redirect for up to 23 hours.
      // The presigned URL itself is valid for 24 hours; we use 23h (82800s)
      // as a safety margin so browsers re-fetch before the URL expires.
      const ttlSeconds = expiry > now
        ? Math.min(Math.floor((expiry - now) / 1000) - 1800, 82800)
        : 0;
      if (ttlSeconds > 0) {
        res.set("Cache-Control", `public, max-age=${ttlSeconds}`);
      } else {
        res.set("Cache-Control", "no-store");
      }

      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
