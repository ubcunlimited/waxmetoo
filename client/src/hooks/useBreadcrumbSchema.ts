/**
 * useBreadcrumbSchema
 * Injects a schema.org/BreadcrumbList JSON-LD <script> tag into <head>
 * while the component is mounted and removes it on unmount.
 *
 * Usage:
 *   useBreadcrumbSchema([
 *     { name: "Home", url: "/" },
 *     { name: "Services", url: "/services" },
 *   ]);
 */
import { useEffect, useMemo } from "react";

const BASE_URL = "https://www.waxmetoo.com";

export interface BreadcrumbItem {
  name: string;
  /** Absolute URL or root-relative path (e.g. "/services"). */
  url: string;
}

export function useBreadcrumbSchema(items: BreadcrumbItem[], id = "breadcrumb-schema") {
  // Memoize the serialized schema so the DOM write only happens when items actually change.
  const schemaJson = useMemo(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
      })),
    };
    return JSON.stringify(schema);
  // items is an array literal at call-site — JSON.stringify gives stable comparison
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(items)]);

  useEffect(() => {
    // Remove any stale tag first (hot-reload safety)
    document.getElementById(id)?.remove();

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.textContent = schemaJson;
    document.head.appendChild(script);

    return () => {
      document.getElementById(id)?.remove();
    };
  }, [id, schemaJson]);
}
