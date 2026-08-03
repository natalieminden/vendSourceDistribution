import { useEffect, useState, FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { Scale, Camera, Wifi, CreditCard, Star, ChevronDown, ChevronUp, ArrowRight, CheckCircle, Mail } from "lucide-react";
import { products, steps, reviews, faqItems, CONTACT_EMAIL } from "../data/products";
import { asset } from "../lib/asset";

const featuredIds = ["haha1200ultra", "qingoking509"];

const partners = ["Vend Guys", "Nayax Certified", "AI Merchandising", "Micro-Markets"];

const platformSpecs = [
  { icon: Scale, title: "Load Cell Shelves", desc: "True sub-2g pressure scales" },
  { icon: Camera, title: "Dual AI Vision", desc: "Fast visual gesture tracking" },
  { icon: Wifi, title: "Live Cloud VMS", desc: "Restock push alerts & charts" },
  { icon: CreditCard, title: "Nayax Payment Link", desc: "Card, NFC & RFID badges" },
];

export default function Home() {
  const location = useLocation();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    model: "multiple",
    locations: "1",
    notes: ""
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
      }
    }
  }, [location]);

  const featured = featuredIds.map(id => products.find(p => p.id === id)!);

  const handleQuoteSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = `Vending Machine Quote Request — ${quoteForm.businessName || quoteForm.name}`;
    const body = [
      `Name: ${quoteForm.name}`,
      `Business: ${quoteForm.businessName}`,
      `Email: ${quoteForm.email}`,
      `Phone: ${quoteForm.phone}`,
      `Cabinet Model: ${quoteForm.model}`,
      `Planned Locations: ${quoteForm.locations}`,
      `Notes: ${quoteForm.notes}`
    ].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setQuoteSubmitted(true);
  };

  return (
    <div className="relative bg-white overflow-x-clip">
      {/* FLOATING MOBILE STICKY SHOP CTA */}
      <div className="fixed bottom-4 right-4 z-30 md:hidden">
        <Link
          to="/shop"
          className="bg-gradient-to-r from-blue-500/90 via-indigo-500/90 to-violet-500/90 backdrop-blur-xl border border-white/25 text-white font-semibold px-5 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-indigo-500/30 text-xs"
        >
          <span>Shop Machines</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* HERO — inset photo panel, giant display type over full-bleed photography */}
      <section className="pt-4 px-3 sm:px-4 lg:px-6">
        <div className="relative overflow-hidden rounded-[1.5rem] lg:rounded-[2rem] min-h-[560px] lg:min-h-[82vh] flex flex-col">
          <img
            src={asset("hero/vending-shelf.jpg")}
            alt="Stocked smart vending cooler shelves"
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
                  Double retail sales and provide 24/7 premium amenities with the Tap, Grab &amp; Go self-service refrigeration experience. Features integrated load cells, AI vision models, and instant cellular Nayax checkouts.
                </p>
                <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white uppercase leading-[1.05] [text-shadow:0_2px_16px_rgb(0_0_0_/_35%)]">
                  AI-Powered Grab &amp; Go
                  <br />
                  Vending Coolers.
                </h1>
                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link to="/shop" className="group inline-flex items-center justify-between gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm pl-6 pr-2 py-2 rounded-full transition-all shadow-lg shadow-black/20 hover:-translate-y-0.5">
                    Shop All Machines
                    <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                  <a href="#contact" className="inline-flex items-center justify-center border border-white/30 hover:border-white/60 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors backdrop-blur-xl">
                    Talk to Our Team
                  </a>
                </div>
              </div>

              {/* Right: floating info cards */}
              <div className="hidden md:flex flex-col gap-3 w-60 shrink-0">
                <div className="bg-white rounded-2xl p-4 shadow-xl">
                  <span className="block text-2xl font-bold text-slate-900 tracking-tight">99.9%</span>
                  <span className="block text-xs font-semibold text-slate-900 mt-0.5">transaction accuracy</span>
                  <span className="block text-[11px] text-slate-500 mt-1">AI vision + load-cell fusion</span>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-0.5 mb-1.5">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="block text-xs font-semibold text-slate-900">500+ office &amp; gym locations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM SPEC CARDS */}
      <section className="py-10 lg:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {platformSpecs.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-slate-100 rounded-3xl p-5 lg:p-6 flex flex-col gap-6 lg:gap-10">
              <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center">
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 uppercase tracking-wide">{title}</p>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PARTNER MARQUEE */}
      <section className="py-6 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6">
          <span className="hidden md:block shrink-0 text-slate-400 text-[11px] font-semibold uppercase tracking-[0.2em]">Official Distributor &amp; Payment Partners</span>
          <div
            className="flex-1 overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
          >
            <div className="animate-marquee flex w-max items-center">
              {[0, 1].map(copy => (
                <div key={copy} className="flex items-center shrink-0">
                  {[...partners, ...partners].map((name, i) => (
                    <span key={`${copy}-${i}`} className="mx-8 text-slate-400 text-sm font-semibold tracking-wide whitespace-nowrap">
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
      <section id="machines" className="py-14 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.32fr_0.68fr] gap-10 lg:gap-14">
          <div className="lg:self-start">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Popular Smart Coolers</h2>
            <p className="text-slate-500 mt-4 text-sm leading-relaxed">A few of our best-selling models. Browse the full lineup — including the Qingo AI Vending series — in the shop.</p>
            <Link to="/shop" className="group mt-6 inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/90 via-indigo-500/90 to-violet-500/90 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 backdrop-blur-xl border border-white/25 text-white font-semibold text-sm pl-6 pr-2 py-2 rounded-full transition-all shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5">
              Shop All 6 Machines
              <span className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {featured.map((product) => (
              <Link key={product.id} to={`/shop/${product.id}`} className="group">
                <div className="relative rounded-3xl bg-slate-100 overflow-hidden h-80 lg:h-96 flex items-center justify-center p-6">
                  <span className="absolute top-4 left-4 bg-white text-slate-900 text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full">
                    {product.badge}
                  </span>
                  <img
                    src={asset(product.imgUrl)}
                    alt={product.name}
                    className="h-full object-contain group-hover:scale-[1.04] transition-transform duration-500"
                  />
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:underline underline-offset-4">{product.name}</h3>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">{product.tagline}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-slate-400 line-through block">${product.originalPrice.toLocaleString()}</span>
                    )}
                    <span className="text-base font-bold text-slate-900">${product.price.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — photo + numbered list rows */}
      <section className="py-14 lg:py-24 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-10 lg:mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">How It Works in 3 Steps</h2>
            <p className="text-slate-500 mt-4 text-sm leading-relaxed">Simple, straightforward integration to keep every location running smoothly.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
            <div className="relative rounded-3xl overflow-hidden min-h-[300px] lg:min-h-0">
              <img
                src={asset("hero/tap-to-pay.jpg")}
                alt="Customer paying at a vending machine with a phone tap-to-pay terminal"
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
      </section>

      {/* REVIEWS — side-column + staggered grey cards */}
      <section id="reviews" className="py-14 lg:py-24 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[0.32fr_0.68fr] gap-10 lg:gap-14">
          <div className="lg:self-start">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">What Vending Operators Say</h2>
            <p className="text-slate-500 mt-4 text-sm leading-relaxed">Read firsthand success stories from regional micro-market operators, office community coordinators, and gym facility directors.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgba(2,6,23,0.04)] p-6 lg:p-7 flex flex-col justify-between hover:shadow-[0_12px_32px_rgba(2,6,23,0.08)] hover:-translate-y-1 transition-all"
              >
                <div>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(rev.stars)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">"{rev.text}"</p>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <span className="font-semibold text-sm text-slate-900 block">{rev.name}</span>
                  <span className="text-xs text-slate-400">{rev.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — black statement band */}
      <section className="py-6 lg:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-slate-50 border border-slate-200 px-6 py-10 sm:px-10 lg:px-14 lg:py-14 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Ready to browse the full lineup?</h3>
            <p className="text-slate-500 text-sm mt-2">See specs, pricing, and availability for every model.</p>
          </div>
          <Link to="/shop" className="group shrink-0 inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/90 via-indigo-500/90 to-violet-500/90 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 backdrop-blur-xl border border-white/25 text-white font-semibold text-sm pl-6 pr-2 py-2 rounded-full transition-all shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5">
            Shop All Machines
            <span className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* FAQ — split editorial layout */}
      <section id="faq" className="hidden md:block py-14 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[0.38fr_0.62fr] gap-10 lg:gap-16">
          <div className="lg:self-start">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-500 mt-4 text-sm leading-relaxed">All technical, network, MDB payment gateway, and cooling telemetry inquiries answered by our micro-market operations team.</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:underline underline-offset-4 transition-colors">
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
                    className="w-full text-left py-5 lg:py-6 font-semibold text-slate-900 text-base flex justify-between items-center gap-6 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 shrink-0 text-slate-900" /> : <ChevronDown className="w-5 h-5 shrink-0 text-slate-400" />}
                  </button>

                  {isOpen && (
                    <div className="pb-6 text-slate-600 text-sm leading-relaxed max-w-2xl">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT / QUOTE — split panel */}
      <section id="contact" className="pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] lg:rounded-[2.5rem] border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">

            {/* Dark info panel */}
            <div className="bg-slate-950 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Talk to Our Team</h2>
              <p className="text-slate-400 mt-4 text-sm leading-relaxed">Fill in the quick parameters below to receive specialized volume discounts, freight options, and cellular remote Nayax configuration templates. Submitting opens your email client with the details pre-filled and addressed to our sales team.</p>

              <a href={`mailto:${CONTACT_EMAIL}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:underline underline-offset-4 transition-colors">
                <Mail className="w-4 h-4" />
                {CONTACT_EMAIL}
              </a>
            </div>

            {/* Form panel */}
            <div className="bg-slate-50 p-6 sm:p-8 lg:p-12">
              {quoteSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Your Email Client Should Be Open</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We pre-filled a message to <strong className="text-slate-900">{CONTACT_EMAIL}</strong> with your details. Just hit send and our team will reply within one business day. If nothing opened, email us directly at{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-slate-900 font-medium underline underline-offset-4">{CONTACT_EMAIL}</a>.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setQuoteSubmitted(false);
                        setQuoteForm({ name: "", businessName: "", email: "", phone: "", model: "multiple", locations: "1", notes: "" });
                      }}
                      className="bg-slate-100 text-slate-900 hover:bg-slate-200 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="space-y-4 text-left">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1 uppercase tracking-wide">Your Name *</label>
                        <input
                          required
                          id="quote-name-input"
                          type="text"
                          placeholder="John Doe"
                          value={quoteForm.name}
                          onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                          className="bg-white border border-slate-300 focus:border-slate-900 text-sm rounded-xl block w-full p-3 text-slate-800 outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1 uppercase tracking-wide">Business Name *</label>
                        <input
                          required
                          type="text"
                          placeholder="Acme Corp"
                          value={quoteForm.businessName}
                          onChange={(e) => setQuoteForm({ ...quoteForm, businessName: e.target.value })}
                          className="bg-white border border-slate-300 focus:border-slate-900 text-sm rounded-xl block w-full p-3 text-slate-800 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1 uppercase tracking-wide">Business Email *</label>
                        <input
                          required
                          type="email"
                          placeholder="john@example.com"
                          value={quoteForm.email}
                          onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                          className="bg-white border border-slate-300 focus:border-slate-900 text-sm rounded-xl block w-full p-3 text-slate-800 outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1 uppercase tracking-wide">Phone Number *</label>
                        <input
                          required
                          type="tel"
                          placeholder="(555) 000-0000"
                          value={quoteForm.phone}
                          onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                          className="bg-white border border-slate-300 focus:border-slate-900 text-sm rounded-xl block w-full p-3 text-slate-800 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1 uppercase tracking-wide">Cabinet Model</label>
                        <select
                          value={quoteForm.model}
                          onChange={(e) => setQuoteForm({ ...quoteForm, model: e.target.value })}
                          className="bg-white border border-slate-300 focus:border-slate-900 text-sm rounded-xl block w-full p-3 text-slate-800 outline-none cursor-pointer"
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.name}>{p.name} (${p.price.toLocaleString()})</option>
                          ))}
                          <option value="multiple">Bundle (Multiple Units)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1 uppercase tracking-wide">Planned Locations</label>
                        <select
                          value={quoteForm.locations}
                          onChange={(e) => setQuoteForm({ ...quoteForm, locations: e.target.value })}
                          className="bg-white border border-slate-300 focus:border-slate-900 text-sm rounded-xl block w-full p-3 text-slate-800 outline-none cursor-pointer"
                        >
                          <option value="1">1 Placement Spot</option>
                          <option value="2-4">2 - 4 Placement Spots</option>
                          <option value="5+">5+ Regional Lobbies</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1 uppercase tracking-wide">Special Requirements</label>
                      <textarea
                        rows={2}
                        placeholder="RFID reader options, custom branding..."
                        value={quoteForm.notes}
                        onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                        className="bg-white border border-slate-300 focus:border-slate-900 text-sm rounded-xl block w-full p-3 text-slate-800 outline-none resize-none transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500/90 via-indigo-500/90 to-violet-500/90 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 border border-white/25 text-white font-semibold text-sm py-3.5 rounded-full transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email Our Team
                  </button>
                  <p className="text-xs text-center text-slate-400">Opens your email client, addressed to {CONTACT_EMAIL}.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
