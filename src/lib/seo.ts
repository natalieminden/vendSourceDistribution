import { useEffect } from "react";

/**
 * Per-page document metadata for a client-rendered SPA.
 *
 * This sets tags after hydration, which Google handles but most social-preview
 * crawlers do not. Open Graph previews will only be correct once these routes
 * are prerendered or server-rendered; the static fallbacks in index.html cover
 * that case for now.
 */

export const SITE_NAME = "Vendsource AI Vending Machines";

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = url;
}

export interface PageMeta {
  title: string;
  description: string;
  /** JSON-LD structured data for this page, serialised into a script tag. */
  jsonLd?: Record<string, unknown>;
}

export function usePageMeta({ title, description, jsonLd }: PageMeta) {
  useEffect(() => {
    // The home page passes SITE_NAME itself and stands alone; every other page is
    // suffixed with it. Guarding on equality avoids "Site | Site" on the home page.
    const fullTitle = title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE_NAME);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);

    const url = window.location.origin + window.location.pathname;
    setCanonical(url);
    setMeta('meta[property="og:url"]', "property", "og:url", url);

    if (!jsonLd) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.pageJsonld = "true";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [title, description, jsonLd]);
}
