import { Link } from "react-router-dom";
import { CONTACT_EMAIL } from "../data/products";

export default function Footer() {
  return (
    <footer className="py-8 md:py-10 bg-slate-950 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 lg:gap-10">
            <span className="text-base font-semibold tracking-tight text-white">
              VendSource <span className="font-normal text-slate-400">Vending</span>
            </span>

            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
              <Link to="/shop" className="text-slate-400 hover:text-white transition-colors">Shop</Link>
              <Link to="/#reviews" className="text-slate-400 hover:text-white transition-colors">Reviews</Link>
              <Link to="/faq" className="text-slate-400 hover:text-white transition-colors">FAQ</Link>
              <Link to="/#contact" className="text-slate-400 hover:text-white transition-colors">Contact Us</Link>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-slate-400 hover:text-white transition-colors">{CONTACT_EMAIL}</a>
            </nav>
          </div>

          <div className="lg:max-w-xs w-full">
            <span className="text-white font-semibold text-xs uppercase tracking-wide block">Newsletter</span>
            <p className="text-xs text-slate-500 leading-relaxed mt-1.5">Micro-market discount codes and cellular VMS platform release notes.</p>
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-full mt-3">
              <input type="email" placeholder="Your business email" className="bg-transparent px-4 py-2 text-xs focus:outline-none text-white w-full" />
              <button
                onClick={() => alert("Successfully joined!")}
                className="shrink-0 bg-white hover:bg-slate-200 text-slate-900 px-4 py-1.5 rounded-full font-semibold text-xs transition-colors"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>&copy; 2026 VendSource Vending Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/faq" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/faq" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/faq" className="hover:text-white transition-colors">Warranty</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
