import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { X, Mail } from "lucide-react";
import { CONTACT_EMAIL } from "../data/products";

export default function QuotePopup() {
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();
  const onEligiblePage = pathname === "/" || pathname === "/shop";

  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (y > 600) setVisible(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, []);

  const dismiss = () => setDismissed(true);

  if (!visible || dismissed || !onEligiblePage) return null;

  return (
    <div className="animate-popup-in fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 max-w-[calc(100vw-2rem)] sm:max-w-sm bg-white border border-slate-200 shadow-2xl text-slate-900 p-5 sm:p-6 rounded-2xl flex flex-col gap-3">
      <button
        type="button"
        onClick={dismiss}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-100 rounded-full"
        aria-label="Close bundle pricing popup"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="pr-6">
        <span className="font-bold text-sm block text-slate-900 leading-tight">Ordering 5+ machines?</span>
        <p className="text-slate-500 text-xs leading-relaxed mt-1">Ask about volume bundle pricing.</p>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          onClick={dismiss}
          className="inline-flex items-center gap-1.5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 hover:from-slate-900 hover:via-slate-800 hover:to-indigo-900 border border-white/25 text-white font-semibold text-xs px-4 py-2.5 rounded-full transition-all shadow-lg shadow-slate-950/30"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Contact Sales</span>
        </a>
      </div>
    </div>
  );
}
