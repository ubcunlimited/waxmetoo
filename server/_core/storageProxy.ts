import type { Express } from "express";
import { ENV } from "./env";

// In-memory cache for presigned URLs.
// The Forge API generates CloudFront presigned URLs that expire after ~24 hours.
// Caching them server-side eliminates the 5–6s Forge API round-trip on every
// request, which was the root cause of SEMrush "slow page load" flags on blog posts.
interface CacheEntry {
  url: string;
  expiresAt: number; // Unix ms — evict 30 min before actual expiry for safety
  contentType?: string;
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

// Derive a sensible Content-Type from the file extension when the upstream
// doesn't provide one (or provides an incorrect one).
function guessContentType(key: string): string | undefined {
  const ext = key.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    css: "text/css; charset=utf-8",
    js: "application/javascript; charset=utf-8",
    mjs: "application/javascript; charset=utf-8",
    json: "application/json; charset=utf-8",
    webp: "image/webp",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    svg: "image/svg+xml",
    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf",
    otf: "font/otf",
    mp4: "video/mp4",
    webm: "video/webm",
    mp3: "audio/mpeg",
    pdf: "application/pdf",
  };
  return ext ? map[ext] : undefined;
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
    let signedUrl: string | null = null;
    const cached = presignedUrlCache.get(key);
    if (cached && cached.expiresAt > now) {
      signedUrl = cached.url;
    } else {
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

        signedUrl = url;

        // Cache the presigned URL, evicting 30 min before its actual expiry.
        const expiry = parseExpiry(url);
        if (expiry > now) {
          presignedUrlCache.set(key, {
            url,
            expiresAt: expiry - 30 * 60 * 1000, // 30-min safety buffer
          });
        }
      } catch (err) {
        console.error("[StorageProxy] failed to get presigned URL:", err);
        res.status(502).send("Storage proxy error");
        return;
      }
    }

    // IMPORTANT: Pipe the content through the Express server instead of
    // redirecting the browser to CloudFront.
    //
    // Why: CloudFront presigned URLs don't include Access-Control-Allow-Origin
    // headers. When the browser follows a cross-origin 307 redirect from
    // waxmetoo.com → d36hbw14aib5lz.cloudfront.net, it blocks the response
    // due to CORS, causing CSS/JS/font files to fail silently (status 0) and
    // resulting in a blank page.
    //
    // By fetching the content server-side and streaming it back, the browser
    // only ever communicates with waxmetoo.com (same-origin), so CORS is never
    // triggered.
    try {
      const upstream = await fetch(signedUrl);
      if (!upstream.ok) {
        res.status(upstream.status).send("Upstream storage error");
        return;
      }

      // Determine content type: prefer upstream, fall back to extension guess.
      const upstreamCT = upstream.headers.get("content-type");
      const contentType = upstreamCT || guessContentType(key) || "application/octet-stream";

      // Cache for 23 hours (browsers) — safe because the server-side presigned
      // URL cache is refreshed before expiry.
      res.set("Content-Type", contentType);
      res.set("Cache-Control", "public, max-age=82800");
      res.set("Access-Control-Allow-Origin", "*");

      // Stream the body directly to the client.
      if (upstream.body) {
        const reader = upstream.body.getReader();
        const pump = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        };
        await pump();
      } else {
        const buffer = await upstream.arrayBuffer();
        res.end(Buffer.from(buffer));
      }
    } catch (err) {
      console.error("[StorageProxy] failed to pipe content:", err);
      if (!res.headersSent) {
        res.status(502).send("Storage proxy pipe error");
      }
    }
  });
}
