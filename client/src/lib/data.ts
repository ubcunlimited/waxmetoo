/**
 * data.ts — barrel re-export
 *
 * All data has been split into focused domain modules for maintainability.
 * Import from here for backwards compatibility, or import directly from the
 * specific module when you only need one domain (e.g. import { faqs } from "@/lib/faqs").
 */

export * from "./locations";
export * from "./services";
export * from "./faqs";
export * from "./blogPosts";
export * from "./testimonials";
