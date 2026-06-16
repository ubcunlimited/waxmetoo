import { useEffect } from "react";

const DEFAULT_TITLE = "Wax Me Too — Professional Waxing Studio | Utah";

/**
 * usePageSEO — sets the page <title> and <meta name="description"> on mount
 * and restores the default title on unmount.
 *
 * @param title        Full page title string.
 * @param description  Meta description (50–160 chars recommended for SEO).
 */
export function usePageSEO(title: string, description: string) {
  useEffect(() => {
    document.title = title;

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, description]);
}
