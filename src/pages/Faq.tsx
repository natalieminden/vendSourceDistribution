import { useState } from "react";
import { ChevronDown, ChevronUp, Mail } from "lucide-react";
import { faqItems, CONTACT_EMAIL } from "../data/products";
import { usePageMeta } from "../lib/seo";

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map(item => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function Faq() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  usePageMeta({
    title: "Frequently Asked Questions",
    description:
      "How smart vending coolers detect purchases, which payment terminals they support, connectivity requirements and warranty terms.",
    jsonLd: FAQ_JSONLD,
  });

  return (
    <section className="py-14 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[0.38fr_0.62fr] gap-10 lg:gap-16">
        <div className="lg:self-start">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-500 mt-4 text-sm leading-relaxed">
            All technical, network, MDB payment gateway, and cooling telemetry inquiries answered by our
            micro-market operations team.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 underline-offset-4 transition-colors"
          >
            <Mail className="w-4 h-4" />
            {CONTACT_EMAIL}
          </a>
        </div>

        <div>
          {faqItems.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="border-b border-slate-200">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left py-5 lg:py-6 font-semibold text-slate-900 text-base flex justify-between items-center gap-6 transition-colors focus:outline-none"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 shrink-0 text-slate-900" />
                  ) : (
                    <ChevronDown className="w-5 h-5 shrink-0 text-slate-500" />
                  )}
                </button>

                {isOpen && (
                  <div className="pb-6 text-slate-600 text-sm leading-relaxed max-w-2xl">{faq.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
