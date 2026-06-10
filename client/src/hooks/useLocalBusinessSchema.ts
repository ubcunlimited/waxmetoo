import { useEffect } from "react";

interface HoursSpec {
  dayOfWeek: string | string[];
  opens: string;
  closes: string;
}

interface LocalBusinessOptions {
  name: string;
  description: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification: HoursSpec[];
  priceRange?: string;
  image?: string;
}

/**
 * Injects a schema.org/LocalBusiness JSON-LD block into <head> while the
 * component is mounted and removes it on unmount. This helps Google understand
 * each individual studio location for local search and map pack eligibility.
 */
export function useLocalBusinessSchema(options: LocalBusinessOptions) {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "BeautySalon"],
      name: options.name,
      description: options.description,
      url: options.url,
      telephone: options.telephone,
      email: options.email,
      address: {
        "@type": "PostalAddress",
        ...options.address,
      },
      ...(options.geo
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: options.geo.latitude,
              longitude: options.geo.longitude,
            },
          }
        : {}),
      openingHoursSpecification: options.openingHoursSpecification.map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.dayOfWeek,
        opens: h.opens,
        closes: h.closes,
      })),
      priceRange: options.priceRange ?? "$$",
      image: options.image,
      sameAs: ["https://www.facebook.com/waxmetoo", "https://www.instagram.com/waxmetoo"],
      parentOrganization: {
        "@type": "Organization",
        name: "Wax Me Too",
        url: "https://www.waxmetoo.com",
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "local-business-schema";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("local-business-schema");
      if (existing) existing.remove();
    };
  }, [options.name]);
}
