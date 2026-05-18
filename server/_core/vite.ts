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

  // Serve sitemap.xml and robots.txt directly from client/public in dev mode
  const clientPublicPath = path.resolve(import.meta.dirname, "../..", "client", "public");
  app.get("/sitemap.xml", (_req, res) => {
    const p = path.resolve(clientPublicPath, "sitemap.xml");
    if (fs.existsSync(p)) {
      res.set("Content-Type", "application/xml").sendFile(p);
    } else {
      res.status(404).send("sitemap.xml not found");
    }
  });
  app.get("/robots.txt", (_req, res) => {
    const p = path.resolve(clientPublicPath, "robots.txt");
    if (fs.existsSync(p)) {
      res.set("Content-Type", "text/plain").sendFile(p);
    } else {
      res.status(404).send("robots.txt not found");
    }
  });

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
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
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

  // Serve sitemap.xml and robots.txt with correct Content-Type before catch-all
  app.get("/sitemap.xml", (_req, res) => {
    const sitemapPath = path.resolve(distPath, "sitemap.xml");
    if (fs.existsSync(sitemapPath)) {
      res.set("Content-Type", "application/xml").sendFile(sitemapPath);
    } else {
      res.status(404).send("sitemap.xml not found");
    }
  });

  app.get("/robots.txt", (_req, res) => {
    const robotsPath = path.resolve(distPath, "robots.txt");
    if (fs.existsSync(robotsPath)) {
      res.set("Content-Type", "text/plain").sendFile(robotsPath);
    } else {
      res.status(404).send("robots.txt not found");
    }
  });

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
