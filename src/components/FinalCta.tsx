import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CONTACT_EMAIL } from "../data/products";

/**
 * Closing block: talk to a person.
 *
 * Flat slate-950, the exact background the footer uses, so the two read as one
 * continuous dark area with no seam and no gradient.
 *
 * Keeps the `contact` anchor id so existing /#contact links still land here.
 */
export default function FinalCta() {
  return (
    <section id="contact" className="bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 lg:py-32 text-center">
        {/* Lighter weight and wider measure than the rest of the site: this is a
            closing statement, not a section header. */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.08]">
          Vending that pays for itself
        </h2>

        <p className="text-slate-400 text-lg sm:text-xl leading-relaxed mt-6 max-w-xl mx-auto">
          Tell us where the machines are going and we will price it out.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center justify-between gap-3 bg-white text-slate-950 font-semibold text-sm pl-6 pr-2 py-2 rounded-full"
          >
            Get bulk pricing
            <span className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center">
              <ArrowRight className="animate-nudge-x w-4 h-4" />
            </span>
          </Link>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center justify-center border border-white/25 bg-white/5 text-white font-semibold text-sm px-6 py-3 rounded-full"
          >
            Email us
          </a>
        </div>
      </div>
    </section>
  );
}
