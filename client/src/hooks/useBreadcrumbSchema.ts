/**
 * useBreadcrumbSchema
 * Injects a schema.org BreadcrumbList JSON-LD <script> tag into <head>
 * when the component mounts, and removes it on unmount.
 *
 * Usage:
 *   useBreadcrumbSchema([
 *     { name: "Home", url: "https://www.waxmetoo.com/" },
 *     { name: "Services", url: "https://www.waxmetoo.com/services" },
 *   ]);
 */

import { useEffect } from "react";

const BASE_URL = "https://www.waxmetoo.com";

export interface BreadcrumbItem {
  name: string;
  /** Absolute URL or path (e.g. "/services"). Paths are resolved against BASE_URL. */
  url: string;
}

export function useBreadcrumbSchema(items: BreadcrumbItem[], id = "breadcrumb-schema") {
  useEffect(() => {
    const listItems = items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    }));

    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: listItems,
    };

    // Remove any existing tag with the same id first (hot-reload safety)
    document.getElementById(id)?.remove();

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.getElementById(id)?.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
