import { ReactNode } from "react";
import { Mail } from "lucide-react";
import { CONTACT_EMAIL } from "../data/products";
import { usePageMeta } from "../lib/seo";

export interface LegalSection {
  /** Anchor target, also the fragment the table of contents links to. */
  id: string;
  title: string;
  body: ReactNode;
}

/**
 * Shared shell for the terms and privacy pages.
 *
 * Both documents are the same shape — a titled preamble, a numbered run of
 * sections and a contact footer — so the chrome lives here and the pages carry
 * nothing but their text.
 */
export default function LegalLayout({
  title,
  description,
  updated,
  intro,
  sections,
}: {
  title: string;
  /** Meta description; the pages are indexable, so it is not derived from `intro`. */
  description: string;
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  usePageMeta({ title, description });

  return (
    <section className="py-14 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Updated {updated}
          </p>
          <div className="legal-prose mt-6">{intro}</div>
        </div>

        <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-[0.32fr_0.68fr] gap-10 lg:gap-16 items-start">
          {/* Table of contents. Sticky on desktop only: on a phone it would eat
              most of the first screen before any of the document showed. */}
          <nav aria-label="On this page" className="lg:sticky lg:top-24">
            <h2 className="text-slate-900 font-semibold text-xs uppercase tracking-[0.14em]">
              On this page
            </h2>
            <ol className="mt-4 space-y-2.5">
              {sections.map((section, idx) => (
                <li key={section.id} className="flex gap-3">
                  <span className="text-xs tabular-nums text-slate-400 shrink-0">{idx + 1}</span>
                  <a href={`#${section.id}`} className="text-xs text-slate-600">
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="min-w-0 divide-y divide-slate-200">
            {sections.map((section, idx) => (
              <section key={section.id} id={section.id} className="legal-anchor py-8 first:pt-0">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  <span className="text-slate-400 tabular-nums mr-2.5">{idx + 1}</span>
                  {section.title}
                </h2>
                <div className="legal-prose mt-4 max-w-2xl">{section.body}</div>
              </section>
            ))}

            <div className="pt-8">
              <div className="bg-slate-100 rounded-3xl p-6">
                <h2 className="text-base font-bold text-slate-900">Questions about this document?</h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Write to our team and we will route your message to the right person.
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
                >
                  <Mail className="w-4 h-4" />
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
