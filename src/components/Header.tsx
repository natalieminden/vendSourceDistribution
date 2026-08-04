import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, setCartOpen, setCheckoutStep } = useCart();

  //"Bulk Pricing" and"Contact Us" deliberately point at the same page — buyers
  // look for one or the other, rarely both.
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/contact", label: "Bulk Pricing" },
    { to: "/#reviews", label: "Reviews" },
    { to: "/#faq", label: "FAQ" },
    { to: "/contact", label: "Contact Us" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-6 lg:space-x-8 text-sm font-medium text-slate-600">
          {navLinks.map(link => (
            <Link key={link.label} to={link.to} className="whitespace-nowrap transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2 shrink-0 ml-auto">
          <button
            onClick={() => {
              setCartOpen(true);
              setCheckoutStep("cart");
            }}
            className="relative p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col space-y-1 text-sm font-medium text-slate-600">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
