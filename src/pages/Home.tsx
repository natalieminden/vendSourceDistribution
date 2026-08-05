import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Scale,
  Camera,
  Wifi,
  CreditCard,
  Star,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Mail,
} from "lucide-react";
import { products, steps, reviews, faqItems, CONTACT_EMAIL } from "../data/products";
import { asset } from "../lib/asset";
import { usePageMeta } from "../lib/seo";
import FinalCta from "../components/FinalCta";
import ReviewSlideshow from "../components/ReviewSlideshow";

const featuredIds = ["haha1200ultra", "qingoking509"];

const partners = ["Vend Guys", "Nayax Certified", "AI Merchandising", "Micro-Markets"];

const platformSpecs = [
  { icon: Scale, title: "Load Cell Shelves", desc: "True sub-2g pressure scales" },
  { icon: Camera, title: "Dual AI Vision", desc: "Fast visual gesture tracking" },
  { icon: Wifi, title: "Live Cloud VMS", desc: "Restock push alerts & charts" },
  { icon: CreditCard, title: "Nayax Payment Link", desc: "Card, NFC & RFID badges" },
];

const HOME_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SB Vendsource Distribution LLC",
  alternateName: "VendSource Distribution",
  email: CONTACT_EMAIL,
  description:
    "Distributor of AI-powered grab and go smart vending coolers with load-cell shelves, computer vision and Nayax payment integration.",
  makesOffer: products.map(p => ({
    "@type": "Offer",
    itemOffered: { "@type": "Product", name: p.name },
    price: p.price,
    priceCurrency: "USD",
  })),
};

export default function Home() {
  const location = useLocation();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  usePageMeta({
    title: "AI-Powered Smart Vending Coolers",
    description:
      "Smart vending coolers with load-cell shelves, AI vision and Nayax tap-to-pay. Compare six commercial models, see pricing and request volume quotes.",
    jsonLd: HOME_JSONLD,
  });

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
      }
    }
  }, [location]);

  const featured = featuredIds.map(id => products.find(p => p.id === id)!);

  return (
    // Transparent, not white: the ambient grid in StoreFront sits behind this.
    <div className="relative overflow-x-clip">
      {/* FLOATING MOBILE STICKY SHOP CTA */}
      <div className="fixed bottom-4 right-4 z-30 md:hidden">
        <Link
          to="/shop"
          className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 backdrop-blur-xl border border-white/25 text-white font-semibold px-5 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-slate-950/30 text-xs"
        >
          <span>Shop Machines</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* HERO — inset photo panel, giant display type over full-bleed photography */}
      <section className="pt-4 px-3 sm:px-4 lg:px-6">
        <div className="relative overflow-hidden rounded-[1.5rem] lg:rounded-[2rem] min-h-[560px] lg:min-h-[82vh] flex flex-col">
          {/* LCP element: never lazy, never deprioritised. */}
          <img
            src={asset("hero/vending-shelf.jpg")}
            alt="Stocked smart vending cooler shelves"
            width={1600}
            height={1000}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-slate-950/30" />

          {/* Giant display wordmark */}
          <div className="relative px-5 sm:px-10 pt-8 lg:pt-10 select-none pointer-events-none">
            <span className="block text-[13.5vw] lg:text-[11vw] leading-[0.85] font-bold tracking-tighter text-white/95 uppercase text-center">
              VendSource
            </span>
          </div>

          {/* Bottom content row */}
          <div className="relative flex-1 flex items-end">
            <div className="w-full px-5 sm:px-10 pb-8 lg:pb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              {/* Left: copy + CTAs */}
              <div className="max-w-xl">
                <p className="text-slate-200 text-sm leading-relaxed max-w-md [text-shadow:0_1px_10px_rgb(0_0_0_/_40%)]">
                  Double retail sales and provide 24/7 premium amenities with the Tap, Grab &amp; Go
                  self-service refrigeration experience. Features integrated load cells, AI vision models, and
                  instant cellular Nayax checkouts.
                </p>
                <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white uppercase leading-[1.05] [text-shadow:0_2px_16px_rgb(0_0_0_/_35%)]">
                  AI-Powered Grab &amp; Go
                  <br />
                  Vending Coolers.
                </h1>
                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link
                    to="/shop"
                    className="group inline-flex items-center justify-between gap-3 bg-white text-slate-900 font-semibold text-sm pl-6 pr-2 py-2 rounded-full transition-all shadow-lg shadow-black/20"
                  >
                    Shop All Machines
                    <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center border border-white/30 bg-white/10 text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors backdrop-blur-xl"
                  >
                    Talk to Our Team
                  </Link>
                </div>
              </div>

              {/* Right: floating info cards */}
              <div className="hidden md:flex flex-col gap-3 w-60 shrink-0">
                <div className="bg-white rounded-2xl p-4 shadow-xl">
                  <span className="block text-2xl font-bold text-slate-900 tracking-tight">99.9%</span>
                  <span className="block text-xs font-semibold text-slate-900 mt-0.5">
                    transaction accuracy
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-1">AI vision + load-cell fusion</span>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-0.5 mb-1.5">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="block text-xs font-semibold text-slate-900">
                    500+ office &amp; gym locations
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM SPEC CARDS */}
      <section className="py-10 lg:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {platformSpecs.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-slate-100 rounded-3xl p-5 lg:p-6 flex flex-col gap-6 lg:gap-10">
              <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center">
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 uppercase tracking-wide">{title}</p>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PARTNER MARQUEE */}
      <section className="py-6 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6">
          <span className="hidden md:block shrink-0 text-slate-500 text-[11px] font-semibold uppercase tracking-[0.2em]">
            Official Distributor &amp; Payment Partners
          </span>
          <div
            className="flex-1 overflow-hidden"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            }}
          >
            <div className="animate-marquee flex w-max items-center">
              {[0, 1].map(copy => (
                <div key={copy} className="flex items-center shrink-0">
                  {[...partners, ...partners].map((name, i) => (
                    <span
                      key={`${copy}-${i}`}
                      className="mx-8 text-slate-500 text-sm font-semibold tracking-wide whitespace-nowrap"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED MACHINES — side-column catalog */}
      <section id="machines" className="py-10 lg:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-[0.32fr_0.68fr] gap-10 lg:gap-14">
          <div className="lg:self-start">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Popular Smart Coolers
            </h2>
            <p className="text-slate-600 mt-4 text-base leading-relaxed">
              Our best-selling models. See all six in the shop.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-3 bg-slate-950 text-white font-semibold text-sm pl-6 pr-2 py-2 rounded-full shadow-lg shadow-slate-950/20"
            >
              Shop All 6 Machines
              <span className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {featured.map(product => (
              <Link key={product.id} to={`/shop/${product.id}`} className="group">
                <div className="relative rounded-3xl bg-slate-100 overflow-hidden h-80 lg:h-96 flex items-center justify-center p-6">
                  <span className="absolute top-4 left-4 bg-white text-slate-900 text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full">
                    {product.badge}
                  </span>
                  <img
                    src={asset(product.imgUrl)}
                    alt={`${product.name} smart vending cooler`}
                    width={480}
                    height={480}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-auto object-contain"
                  />
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 underline-offset-4">{product.name}</h3>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">{product.tagline}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-slate-500 line-through block">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-base font-bold text-slate-900">
                      ${product.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — photo + numbered list rows */}
      <section className="py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-10 lg:p-12">
            <div className="max-w-xl mb-10 lg:mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                How It Works in 3 Steps
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
              <div className="relative rounded-3xl overflow-hidden min-h-[300px] lg:min-h-0">
                <img
                  src={asset("hero/tap-to-pay.jpg")}
                  alt="Customer paying at a vending machine with a phone tap-to-pay terminal"
                  width={1200}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              <div className="divide-y divide-slate-200">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-5 py-7 first:pt-0 last:pb-0">
                    <span className="w-11 h-11 shrink-0 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                      {step.no}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                      <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS — side-column + staggered grey cards */}
      <section id="reviews" className="py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-[0.32fr_0.68fr] gap-10 lg:gap-14">
            <div className="lg:self-start">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                What Vending Operators Say
              </h2>
              <p className="text-slate-500 mt-4 text-sm leading-relaxed">
                Read firsthand success stories from regional micro-market operators, office community
                coordinators, and gym facility directors.
              </p>
            </div>

            <ReviewSlideshow />
          </div>
        </div>
      </section>

      {/* LINEUP CTA — borrows the product page's window-chrome treatment so the
          block reads as an app window rather than another flat panel. */}
      <section className="py-10 lg:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white overflow-hidden shadow-xl shadow-slate-950/5">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/70 bg-white/60 backdrop-blur">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              </div>
            </div>

            <div className="px-6 py-12 sm:px-10 sm:py-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-[1.05]">
                Browse the full lineup
              </h2>
              <Link
                to="/shop"
                className="mt-8 inline-flex items-center justify-between gap-3 bg-slate-950 text-white font-semibold text-sm pl-6 pr-2 py-2 rounded-full shadow-lg shadow-slate-950/20"
              >
                Shop all machines
                <span className="w-8 h-8 rounded-full bg-white text-slate-950 flex items-center justify-center">
                  <ArrowRight className="animate-nudge-x w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — split editorial layout */}
      <section id="faq" className="py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-[0.38fr_0.62fr] gap-10 lg:gap-16">
            <div className="lg:self-start">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-600 mt-4 text-sm leading-relaxed">
                Technical, network, payment gateway and cooling telemetry questions, answered by our
                operations team.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 underline underline-offset-4"
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
                      className="w-full text-left py-5 lg:py-6 font-semibold text-slate-900 text-base flex justify-between items-center gap-6"
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
        </div>
      </section>

      <FinalCta />
    </div>
  );
}
