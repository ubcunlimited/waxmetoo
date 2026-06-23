import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      // Use res.send (not .end) so the seoPrerender middleware can intercept
      res.status(200).set({ "Content-Type": "text/html" }).send(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Disable express.static's automatic index.html serving so all HTML
  // requests fall through to the handler below, which uses res.send() instead
  // of sendFile() — this lets the seoPrerender middleware inject canonical
  // tags, OG metadata, and body text before the response is sent.
  app.use(express.static(distPath, { index: false }));

  // fall through to index.html — use res.send (not sendFile) so the
  // seoPrerender middleware can intercept and inject canonical/OG tags.
  const indexHtml = path.resolve(distPath, "index.html");
  app.use("*", (_req, res) => {
    try {
      const html = fs.readFileSync(indexHtml, "utf-8");
      res.status(200).set({ "Content-Type": "text/html" }).send(html);
    } catch {
      res.status(500).send("Server error: could not read index.html");
    }
  });
}
