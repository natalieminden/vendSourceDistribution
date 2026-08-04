import { useState, FormEvent, ChangeEvent, ComponentType, ReactNode } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Check, Mail, ArrowRight, Clock, HelpCircle, Package } from "lucide-react";
import { products, CONTACT_EMAIL } from "../data/products";
import { usePageMeta } from "../lib/seo";

const EMPTY_FORM = {
  name: "",
  businessName: "",
  email: "",
  phone: "",
  reason: "pricing",
  machineCount: "1",
  locations: "1",
  notes: "",
};

const REASONS = [
  { value: "pricing", label: "Bulk / volume pricing" },
  { value: "product", label: "Product or spec question" },
  { value: "installation", label: "Installation & site requirements" },
  { value: "payments", label: "Payments & VMS setup" },
  { value: "general", label: "Something else" },
];

/** Machine-count options; the form is equally valid for a single unit. */
const MACHINE_COUNTS = ["1", "2", "3", "4", "5", "6-10", "11-20", "20+"];

const FIELD =
  "w-full rounded-xl bg-white/95 border border-white/40 text-sm text-slate-800 p-3 outline-none " +
  "placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-white/70 transition-all";

const LABEL = "text-[11px] font-semibold text-slate-300 block mb-1.5 uppercase tracking-wide";

const CONTACT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact VendSource Distribution",
  mainEntity: {
    "@type": "Organization",
    name: "SB Vendsource Distribution LLC",
    email: CONTACT_EMAIL,
  },
};

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [machines, setMachines] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  usePageMeta({
    title: "Contact & Bulk Pricing",
    description:
      "Get volume pricing, shipping estimates and Nayax setup details for VendSource smart vending coolers. Tell us how many machines you need.",
    jsonLd: CONTACT_JSONLD,
  });

  const update =
    (field: keyof typeof EMPTY_FORM) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const toggleMachine = (name: string) =>
    setMachines(prev => (prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const reasonLabel = REASONS.find(r => r.value === form.reason)?.label ?? form.reason;
    const subject = `${reasonLabel}: ${form.businessName || form.name}`;
    const body = [
      `Enquiry type: ${reasonLabel}`,
      `Name: ${form.name}`,
      `Business: ${form.businessName}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || "Not provided"}`,
      `Number of machines: ${form.machineCount}`,
      `Machines of interest: ${machines.length ? machines.join(", ") : "Not specified"}`,
      `Planned Locations: ${form.locations}`,
      `Notes: ${form.notes}`,
    ].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <main className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">Contact our team</h1>
          <p className="text-slate-600 mt-4 text-lg leading-relaxed">
            Pricing a rollout, or just have a question? Send us the details.
          </p>
        </div>

        <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-12 items-start">
          {/* Form card — carries the hero's navy treatment. */}
          <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 shadow-2xl shadow-slate-950/30">
            <div className="absolute -top-24 -left-16 w-96 h-96 rounded-full bg-indigo-500/25 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-10 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-grain opacity-[0.12] mix-blend-overlay pointer-events-none" />

            <div className="relative p-6 sm:p-8 lg:p-10">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 border border-white/30 grid place-items-center mx-auto text-white">
                    <CheckCircle className="w-9 h-9" />
                  </div>
                  <h2 className="text-2xl font-bold text-white uppercase tracking-tight [text-shadow:0_2px_16px_rgb(0_0_0_/_35%)]">
                    Your email client should be open
                  </h2>
                  <p className="text-slate-200 text-sm leading-relaxed max-w-md mx-auto">
                    We pre-filled a message to <strong className="text-white">{CONTACT_EMAIL}</strong> with
                    your details. Just hit send. If nothing opened, email us directly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setForm(EMPTY_FORM);
                      setMachines([]);
                    }}
                    className="mt-2 bg-white/15 border border-white/30 text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div>
                    <label htmlFor="contact-reason" className={LABEL}>
                      How can we help? *
                    </label>
                    <select
                      id="contact-reason"
                      value={form.reason}
                      onChange={update("reason")}
                      className={`${FIELD} cursor-pointer`}
                    >
                      {REASONS.map(reason => (
                        <option key={reason.value} value={reason.value}>
                          {reason.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className={LABEL}>
                        Your name *
                      </label>
                      <input
                        required
                        id="contact-name"
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={update("name")}
                        className={FIELD}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-business" className={LABEL}>
                        Business name *
                      </label>
                      <input
                        required
                        id="contact-business"
                        type="text"
                        placeholder="Acme Corp"
                        value={form.businessName}
                        onChange={update("businessName")}
                        className={FIELD}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-email" className={LABEL}>
                        Business email *
                      </label>
                      <input
                        required
                        id="contact-email"
                        type="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={update("email")}
                        className={FIELD}
                      />
                    </div>
                    <div>
                      {/* Optional: a general question shouldn't demand a phone number. */}
                      <label htmlFor="contact-phone" className={LABEL}>
                        Phone number
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        placeholder="(555) 000-0000"
                        value={form.phone}
                        onChange={update("phone")}
                        className={FIELD}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-machine-count" className={LABEL}>
                        Number of machines
                      </label>
                      <select
                        id="contact-machine-count"
                        value={form.machineCount}
                        onChange={update("machineCount")}
                        className={`${FIELD} cursor-pointer`}
                      >
                        {MACHINE_COUNTS.map(count => (
                          <option key={count} value={count}>
                            {count} {count === "1" ? "machine" : "machines"}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="contact-locations" className={LABEL}>
                        Planned locations
                      </label>
                      <select
                        id="contact-locations"
                        value={form.locations}
                        onChange={update("locations")}
                        className={`${FIELD} cursor-pointer`}
                      >
                        <option value="1">1 placement spot</option>
                        <option value="2-4">2 – 4 placement spots</option>
                        <option value="5+">5+ regional lobbies</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-notes" className={LABEL}>
                      Special requirements
                    </label>
                    <textarea
                      id="contact-notes"
                      rows={4}
                      placeholder="RFID reader options, custom branding…"
                      value={form.notes}
                      onChange={update("notes")}
                      className={`${FIELD} resize-none`}
                    />
                  </div>

                  {/* Machines of interest — sourced from the live catalog. */}
                  <fieldset>
                    <legend className={LABEL}>Machines of interest</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 mt-1">
                      {products.map(product => {
                        const checked = machines.includes(product.name);
                        return (
                          <label key={product.id} className="flex items-center gap-2.5 cursor-pointer group">
                            <span
                              className={`w-4 h-4 rounded border grid place-items-center transition-colors shrink-0 ${
                                checked ? "bg-white border-white text-slate-900" : "border-white/40"
                              }`}
                            >
                              {checked && <Check className="w-3 h-3 stroke-[3]" />}
                            </span>
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={checked}
                              onChange={() => toggleMachine(product.name)}
                            />
                            <span className="text-sm text-slate-200">{product.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <button
                    type="submit"
                    className="group w-full inline-flex items-center justify-between gap-3 bg-white text-slate-900 font-semibold text-sm pl-6 pr-2 py-2 rounded-full transition-all shadow-lg shadow-black/20"
                  >
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Send message
                    </span>
                    <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center transition-transform shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>

                  <p className="text-xs text-center text-slate-400">
                    Opens your email client, addressed to {CONTACT_EMAIL}.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <InfoCard icon={Mail} title="Email us">
              <p className="text-xs text-slate-600 leading-relaxed">
                Prefer to write your own message? Reach the sales team directly.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-2 inline-block text-sm font-semibold text-slate-900 underline underline-offset-4 transition-colors break-all"
              >
                {CONTACT_EMAIL}
              </a>
            </InfoCard>

            <InfoCard icon={Clock} title="What to expect">
              <p className="text-xs text-slate-600 leading-relaxed">
                A written reply covering volume pricing, shipping estimates and lead times for your region.
              </p>
            </InfoCard>

            <InfoCard icon={Package} title="Browse first">
              <p className="text-xs text-slate-600 leading-relaxed">
                Not sure which cabinet fits? Compare capacity, sensors and pricing across the full range.
              </p>
              <Link
                to="/shop"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 transition-colors"
              >
                View all machines
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </InfoCard>

            <InfoCard icon={HelpCircle} title="Common questions">
              <p className="text-xs text-slate-600 leading-relaxed">
                Connectivity, payment terminals, restocking and warranty are all covered in our FAQ.
              </p>
              <Link
                to="/#faq"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 transition-colors"
              >
                Read the FAQ
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </InfoCard>
          </aside>
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-slate-100 rounded-3xl p-6">
      <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center">
        <Icon className="w-4.5 h-4.5" />
      </div>
      <p className="text-sm font-bold text-slate-900 uppercase tracking-wide mt-4">{title}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
