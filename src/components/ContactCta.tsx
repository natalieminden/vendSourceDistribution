import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { CONTACT_EMAIL } from "../data/products";

/**
 * Home-page teaser for the contact page.
 *
 * Keeps the `contact` anchor id so existing `/#contact` links still land here
 * rather than 404ing, while the form itself lives at /contact.
 */
export default function ContactCta() {
  return (
    <section id="contact" className="pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 shadow-2xl shadow-slate-950/30">

          <div className="absolute -top-24 -left-16 w-96 h-96 rounded-full bg-indigo-500/25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-10 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-grain opacity-[0.12] mix-blend-overlay pointer-events-none" />

          <div className="relative p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Bulk pricing &amp; general enquiries
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight uppercase leading-[1.05] [text-shadow:0_2px_16px_rgb(0_0_0_/_35%)]">
                Talk to Our Team
              </h2>
              <p className="text-slate-200 text-sm leading-relaxed mt-4 [text-shadow:0_1px_10px_rgb(0_0_0_/_40%)]">
                Ordering more than one machine, or just have a question? Tell us what you need
                and we'll come back with volume pricing, shipping options and Nayax
                configuration templates.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                to="/contact"
                className="group inline-flex items-center justify-between gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm pl-6 pr-2 py-2 rounded-full transition-all shadow-lg shadow-black/20 hover:-translate-y-0.5"
              >
                Get bulk pricing
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white/60 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors backdrop-blur-xl"
              >
                <Mail className="w-4 h-4" />
                Email us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
