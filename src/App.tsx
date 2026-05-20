import { useState, useEffect, FormEvent } from "react";
import { 
  Smartphone, Sun, Shield, VolumeX, Battery, Sparkles, 
  Plus, Minus, ShoppingBag, Check, Trash2, Star, 
  ChevronDown, ChevronUp, Menu, X, Flame, ArrowRight, 
  Lock, Truck, RotateCcw, Award, Download, Copy, CheckCircle, Info, Eye
} from "lucide-react";

// Product Data Type
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  badge: string;
  tagline: string;
  accentColor: string;
  secondaryColor: string;
  capacity: string;
  battery: string;
  noise: string;
  solar: string;
  weight: string;
  description: string;
  imgUrl: string;
  stock: number;
  bestFor: string;
  specs: string[];
}

export default function App() {
  // Products definition with premium colors & specs
  const products: Product[] = [
    {
      id: "haha",
      name: "Haha Smart Cooler",
      price: 1999, // Commercial Vending Unit Entry
      originalPrice: 2499,
      badge: "Best Value Option",
      tagline: "The Smarter Vending Experience: Tap, Grab, and Go.",
      accentColor: "#00D4FF", // Electric Cyan
      secondaryColor: "rgba(0, 212, 255, 0.15)",
      capacity: "460L Heavy Duty Cabinet (holds up to 240+ multi-size items)",
      battery: "Built-in uninterruptible battery backup (secures temp for 12 hours of power outage)",
      noise: "40 dB Quiet Eco Commercial Cooling Compressor",
      solar: "Nayax Integrated payment processing & real-time VMS portal",
      weight: "115 kg (Sturdy secure metal frame)",
      bestFor: "Office breakrooms, gyms, hotel lobbies, residential apartment hubs.",
      description: "Smart micro-market vending cooler with physical high-accuracy load-cell shelves. Customers tap to unlock, grab their snacks or beverages, close the door, and get charged automatically. Zero spiral jams, coils, or dropped item damage.",
      imgUrl: "https://images.unsplash.com/photo-1574757565409-e855c9f59380?auto=format&fit=crop&w=800&q=80",
      stock: 14,
      specs: ["TAP, GRAB & GO CONVENIENCE", "LOAD-CELL WEIGHT MODULES", "NAYAX NFC / CREDIT PAYMENTS", "ANTI-FOG HEATED GLASS DOOR"]
    },
    {
      id: "qingo",
      name: "Qingo Smart Cooler",
      price: 3499, // Flagship model price
      originalPrice: 4299,
      badge: "Recommended Flagship",
      tagline: "Redefining the Future of Vending with Dual AI Vision and Weight Fusion.",
      accentColor: "#FB923C", // Energetic Amber/Orange
      secondaryColor: "rgba(251, 146, 60, 0.15)",
      capacity: "650L Premium Double glass cabinet (holds 320+ items)",
      battery: "Continuous uptime battery & safety temperature backup system",
      noise: "34 dB stealth active silent compressor and double cooling fan",
      solar: "99.9% Accuracy dual weight load-plates and dual-camera fusion",
      weight: "165 kg (Extremely robust anti-vandal retail structure)",
      bestFor: "High-traffic commercial complexes, medical systems, universities, airport lounges.",
      description: "Dual isolated glass-door smart cooling vending station. Fuses advanced digital weight sensors with internal multi-angle AI computer vision cameras to maintain supreme 99.9% transaction accuracy, perfect even for chaotic grab-and-return behaviors.",
      imgUrl: "https://images.unsplash.com/photo-1583258292688-d0213df4a3a8?auto=format&fit=crop&w=800&q=80",
      stock: 6,
      specs: ["SCAN, GRAB & GO FLOW", "COMPUTER VISION CAMERA SENSORS", "99.9% TRANSACTION ACCURACY", "LIVE CLOUD MANAGEMENT DASHBOARD"]
    }
  ];

  // Primary interactive states
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<{ id: string; name: string; price: number; badge: string }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "shipping" | "success">("cart");
  const [shippingForm, setShippingForm] = useState({ name: "", email: "", address: "", zip: "", card: "4111 2222 3333 4444" });
  
  // Custom Quote States
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
  
  // Navigation & Floating UI metrics
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [cookieConsent, setCookieConsent] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 4, minutes: 28, seconds: 41 });
  const [exportOpen, setExportOpen] = useState(false);
  const [activeCompareId, setActiveCompareId] = useState<string>("qingo");

  useEffect(() => {
    // Show discount consent bar after 5 seconds
    const timer = setTimeout(() => {
      const alreadyClaimed = localStorage.getItem("cooltech_discount_claimed");
      if (!alreadyClaimed) {
        setCookieConsent(true);
      }
    }, 5000);

    // Continuous real time countdown ticked
    const clock = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 4, minutes: 28, seconds: 41 }; // Loop fallback
      });
    }, 1000);

    // Dynamic scroll tracking
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      clearInterval(clock);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const addonOptions = [
    { id: "solar_mat", name: "100W Foldable Ultra-Thin Solar Panel", price: 129, badge: "Eco Essential" },
    { id: "spare_cell", name: "Spare Premium 72h Backup Battery Module", price: 169, badge: "Double Distance" },
    { id: "ballistic_case", name: "Heavy-Duty Ballistic Armor Nylon Cover", price: 59, badge: "Adventure Proof" }
  ];

  // Real Add to Cart
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCheckoutStep("cart");
    setCartOpen(true);
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter(Boolean) as typeof cart);
  };

  const toggleAddonOption = (addon: typeof addonOptions[0]) => {
    setSelectedAddons(prev => {
      const exists = prev.some(item => item.id === addon.id);
      if (exists) {
        return prev.filter(item => item.id !== addon.id);
      }
      return [...prev, addon];
    });
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "COOLTECH10") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid code. Try using: COOLTECH10");
    }
  };

  // Pricing tallies
  const itemsSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const addonsSubtotal = selectedAddons.reduce((sum, ad) => sum + ad.price, 0);
  const aggregateTotal = itemsSubtotal + addonsSubtotal;
  const promoDiscount = promoApplied ? aggregateTotal * 0.10 : 0;
  const grandTotal = aggregateTotal - promoDiscount;

  const handleCheckoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!shippingForm.name || !shippingForm.email || !shippingForm.address) {
      alert("Please fulfill all shipping info requirements.");
      return;
    }
    setCheckoutStep("success");
  };

  const claimCookieDiscount = () => {
    setPromoCode("COOLTECH10");
    setPromoApplied(true);
    setCookieConsent(false);
    localStorage.setItem("cooltech_discount_claimed", "true");
  };

  // Automated standalone HTML generator code
  const getHTMLTemplate = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CoolTech | AI-Powered Grab & Go Vending Coolers</title>
  
  <!-- Favicon -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>🧊</text></svg>">
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@700&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            heading: ['Space Grotesk', 'sans-serif'],
            display: ['Syne', 'sans-serif'],
          },
          colors: {
            navy: {
              DEFAULT: '#0A0F2C',
              light: '#1A2356',
            },
            cyanGlow: '#00D4FF',
          }
        }
      }
    }
  </script>
  
  <style>
    html {
      scroll-behavior: smooth;
    }
    .hero-pattern {
      background-image: radial-gradient(#00d4ff0d 1px, transparent 1px), radial-gradient(#00d4ff08 1px, transparent 1px);
      background-size: 20px 20px;
      background-position: 0 0, 10px 10px;
    }
  </style>
</head>
<body class="bg-white text-[#0A0F2C] antialiased">

  <!-- NAVIGATION -->
  <nav class="sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <span class="text-2xl font-black tracking-tight text-[#0A0F2C] font-display">
          COOL<span class="text-[#00D4FF]">TECH</span> VENDING🧊
        </span>
      </div>
      
      <div class="hidden md:flex space-x-8 text-sm font-semibold text-slate-600">
        <a href="#features" class="hover:text-[#00D4FF] transition-colors">Features</a>
        <a href="#products" class="hover:text-[#00D4FF] transition-colors">Products</a>
        <a href="#compare" class="hover:text-[#00D4FF] transition-colors">Compare</a>
        <a href="#reviews" class="hover:text-[#00D4FF] transition-colors">Reviews</a>
        <a href="#faq" class="hover:text-[#00D4FF] transition-colors">FAQ</a>
      </div>

      <div>
        <a href="#products" class="bg-[#0A0F2C] hover:bg-slate-900 text-white font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all">
          View Models
        </a>
      </div>
    </div>
  </nav>

  <!-- HERO SECTION -->
  <section class="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-24 px-4 bg-gradient-to-b from-slate-50 to-white hero-pattern border-b border-slate-200">
    <div class="max-w-5xl mx-auto text-center relative z-10">
      <div class="inline-flex items-center space-x-2 bg-slate-100 border border-slate-200 rounded-full px-4 py-1.5 mb-8">
        <span class="text-xs font-semibold text-[#0A0F2C]">🎯 4.9★ RATED BY OVER 500+ AMERICAN BUSINESS SITES</span>
      </div>

      <h1 class="text-5xl md:text-7xl font-extrabold font-display leading-tight mb-6 text-[#0A0F2C]">
        AI-Powered Grab & Go <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600">Vending Coolers</span>
      </h1>

      <p class="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
        Double sales with the TAP, GRAB & GO frictionless vending experience. Physical weight load-sensing shelves or camera vision identify grabs instantly. Zero spirals, zero mechanical jams.
      </p>

      <div class="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto mb-12">
        <a href="#haha" class="w-full sm:w-1/2 bg-[#00D4FF] hover:bg-cyan-400 text-[#0A0F2C] font-black tracking-tight text-center px-6 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5">
          Haha Cooler ($1,999)
        </a>
        <a href="#qingo" class="w-full sm:w-1/2 bg-[#0A0F2C] text-white font-black tracking-tight text-center px-6 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5">
          Qingo Cooler ($3,499)
        </a>
      </div>

      <!-- Quick Metrics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-slate-200 text-slate-700 text-xs md:text-sm">
        <div>🔒 2-Year Direct Warranty</div>
        <div>🚚 Direct Freight Pallet Shipping</div>
        <div>🔋 Uninterruptible Power Backup</div>
        <div>📡 Pre-wired 4G LTE Nayax eSIM</div>
      </div>
    </div>
  </section>

  <!-- SOCIAL PROOF BAR -->
  <section class="py-10 bg-slate-50 border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="text-slate-500 text-xs font-bold uppercase tracking-widest text-center md:text-left">OFFICIAL DISTRIBUTOR LOGOS & CHANNELS:</div>
      <div class="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-slate-400 text-base font-extrabold tracking-widest">
        <span>VEND GUYS</span>
        <span>NAYAX CERTIFIED</span>
        <span>AI MERCHANDISING</span>
        <span>MICRO-MARKETS</span>
      </div>
      <div class="text-[#0A0F2C] text-sm font-semibold">★ ★ ★ ★ ★ <span class="text-slate-600">(500+ Office & Gym Locations Locked)</span></div>
    </div>
  </section>

  <!-- PRODUCT SHOWCASE 1: HAHA -->
  <section id="haha" class="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-5 space-y-6">
        <span class="px-2.5 py-1 text-xs font-bold uppercase bg-cyan-100 text-cyan-800 rounded">SMART MICRO-MARKET BESTSEller</span>
        <h2 class="text-3xl md:text-5xl font-extrabold text-[#0A0F2C] font-display">Haha Smart Cooler</h2>
        <p class="text-slate-600 text-lg leading-relaxed">
          Premium 460L heavy cabinet with high-accuracy load-cell weight shelf tracking modules. Ideal for offices, gyms, lobbies, and co-working locations. Simple plug, load, and earn.
        </p>

        <div class="grid grid-cols-2 gap-4 text-sm text-slate-700">
          <div>💎 Multi-sku weight plates</div>
          <div>💳 Nayax credit card / Apple Pay</div>
          <div>🔌 12Hr battery backup safety</div>
          <div>🧊 Double-tempered heating glass</div>
        </div>

        <div class="pt-6">
          <div class="text-slate-400 line-through text-sm">MSRP: $2,499.00</div>
          <div class="text-4xl font-extrabold text-[#00D4FF] mb-6">$1,999 <span class="text-xs bg-cyan-100 text-[#00D4FF] px-2 py-1 rounded">SAVE 20%</span></div>
          <a href="#buy-section" class="bg-[#00D4FF] hover:bg-cyan-400 text-[#0A0F2C] uppercase tracking-tight text-xs font-black px-8 py-3.5 rounded-lg inline-block transition-all">
            Inquire/Purchase Haha
          </a>
        </div>
      </div>
      
      <div class="lg:col-span-7">
        <img src="https://images.unsplash.com/photo-1574757565409-e855c9f59380?auto=format&fit=crop&w=800&q=80" alt="Haha Cooler" class="w-full h-[400px] object-cover rounded-2xl shadow-xl border border-slate-200">
      </div>
    </div>
  </section>

  <!-- PRODUCT SHOWCASE 2: QINGO -->
  <section id="qingo" class="py-24 bg-slate-50 border-y border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div class="lg:col-span-7">
          <img src="https://images.unsplash.com/photo-1583258292688-d0213df4a3a8?auto=format&fit=crop&w=800&q=80" alt="Qingo Cooler" class="w-full h-[400px] object-cover rounded-2xl shadow-xl border border-slate-200">
        </div>
        
        <div class="lg:col-span-5 space-y-6">
          <span class="px-2.5 py-1 text-xs font-bold uppercase bg-orange-100 text-orange-800 rounded">ULTIMATE DUAL AI FUSION</span>
          <h2 class="text-3xl md:text-5xl font-extrabold text-[#0A0F2C] font-display">Qingo Vending Cooler</h2>
          <p class="text-slate-600 text-lg leading-relaxed">
            Flagship double-door 650-liter scale. Fuses multi-angle computer vision camera tracking with heavy-duty load plates to secure unrivaled 99.9% auto-billing scan accuracy. Perfect for fast high-traffic lobbies.
          </p>

          <div class="grid grid-cols-2 gap-4 text-sm text-slate-700">
            <div>📸 AI Computer vision matrix</div>
            <div>⚖️ Load cell pressure scales</div>
            <div>📊 Real-time online cellular VMS</div>
            <div>⚡ 320+ multi-size items slots</div>
          </div>

          <div class="pt-6">
            <div class="text-slate-400 line-through text-sm">MSRP: $4,299.00</div>
            <div class="text-4xl font-extrabold text-orange-600 mb-6">$3,499 <span class="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">SAVE 18%</span></div>
            <a href="#buy-section" class="bg-[#0A0F2C] hover:bg-slate-900 text-white uppercase tracking-tight text-xs font-black px-8 py-3.5 rounded-lg inline-block transition-all">
              Inquire/Purchase Qingo
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- COMPARE TABLE -->
  <section id="compare" class="py-24 max-w-5xl mx-auto px-4">
    <h2 class="text-4xl font-extrabold text-center text-[#0A0F2C] font-display mb-12">Model Specs Breakdown</h2>
    <div class="overflow-x-auto rounded-xl border border-slate-200 shadow-lg">
      <table class="w-full text-left border-collapse bg-white">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200 text-sm text-[#0A0F2C]">
            <th class="p-4 font-bold">Specs Factor</th>
            <th class="p-4 font-bold text-center text-[#00D4FF]">Haha Cabinet Series</th>
            <th class="p-4 font-bold text-center text-orange-600 bg-orange-50/50">Qingo Dual AI fusion</th>
          </tr>
        </thead>
        <tbody class="text-slate-700 text-sm divide-y divide-slate-200">
          <tr><td class="p-4 font-semibold">Cabinet Volume</td><td class="p-4 text-center">460 Liters</td><td class="p-4 text-center bg-orange-50/20 font-bold">650 Liters Dual-door</td></tr>
          <tr><td class="p-4 font-semibold">Core Tracking Tech</td><td class="p-4 text-center">Precision Weight Load Plates</td><td class="p-4 text-center bg-orange-50/20 font-bold">AI Computer Vision + Weight Fusion</td></tr>
          <tr><td class="p-4 font-semibold">Billing Accuracy</td><td class="p-4 text-center">~98.5%</td><td class="p-4 text-center bg-orange-50/20">99.9% (Supreme Precision)</td></tr>
          <tr><td class="p-4 font-semibold">Cellular VMS Portal</td><td class="p-4 text-center">Yes</td><td class="p-4 text-center bg-orange-50/20 font-bold">Yes (Includes vision stream audit)</td></tr>
          <tr><td class="p-4 font-semibold">Pallet Price</td><td class="p-4 text-center text-emerald-600 font-bold">$1,999</td><td class="p-4 text-center text-orange-600 font-bold bg-orange-50/20">$3,499</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- FAQS -->
  <section id="faq" class="py-24 bg-slate-50 border-t border-slate-200">
    <div class="max-w-4xl mx-auto px-4">
      <h2 class="text-4xl font-extrabold text-center mb-12 text-[#0A0F2C]">Vending Operations FAQ</h2>
      <div class="space-y-4">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h4 class="font-bold text-[#0A0F2C] text-lg">Are these suitable for outdoor locations?</h4>
          <p class="text-slate-600 mt-2">These are high-grade commercial display refrigerators. They require indoor configurations or covered shelters shielded from heavy direct rainfall or excessive moisture.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h4 class="font-bold text-[#0A0F2C] text-lg">How are transaction disputes handled?</h4>
          <p class="text-slate-600 mt-2">Qingo has full visual auditing capabilities. Operators can review the high-speed video clip associated with a weight shift to resolve billing dispute queries inside our intuitive web management platform.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- PURCHASE SECTION -->
  <section id="buy-section" class="py-24 bg-[#0A0F2C] text-white text-center">
    <div class="max-w-4xl mx-auto px-4">
      <h2 class="text-4xl md:text-5xl font-black mb-6">Redefining Smart Self-Service.</h2>
      <p class="text-slate-300 mb-12">Claim a 10% commercial distributor discount when purchasing a bundle of 2 or more cabinets today.</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-left text-[#0A0F2C]">
        <div class="bg-white p-8 rounded-2xl border border-slate-200 relative">
          <h3 class="text-2xl font-bold mb-1 text-[#0A0F2C]">Haha Smart Cabinet</h3>
          <p class="text-slate-500 mb-4">460L physical load-cell vending station</p>
          <p class="text-3xl font-black text-[#00D4FF] mb-6">$1,999.00</p>
          <a href="#buy-section" onclick="alert('Inquiry successfully recorded! Our vending accounts executive will phone you in under an hour.')" class="bg-[#00D4FF] hover:bg-cyan-400 font-bold block text-center py-3.5 rounded text-sm text-[#0A0F2C]">INQUIRE HAHA CABINET</a>
        </div>

        <div class="bg-white p-8 rounded-2xl border border-slate-200 relative">
          <h3 class="text-2xl font-bold mb-1 text-[#0A0F2C]">Qingo Vision Cabinet</h3>
          <p class="text-slate-500 mb-4">650L dual weight & computer vision elite tower</p>
          <p class="text-3xl font-black text-orange-600 mb-6">$3,499.00</p>
          <a href="#buy-section" onclick="alert('Inquiry successfully recorded! Our vending accounts executive will phone you in under an hour.')" class="bg-orange-500 hover:bg-orange-600 text-white font-bold block text-center py-3.5 rounded text-sm">INQUIRE QINGO SYSTEM</a>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="py-12 bg-slate-900 text-slate-400 text-center border-t border-slate-800 text-sm">
    <p class="font-bold text-white mb-2">COOLTECH VENDING DISTRIBUTIONS INC.</p>
    <p>&copy; 2026 CoolTech Vending. All rights reserved. Revolutionizing smart retail.</p>
  </footer>

</body>
</html>`;
  };

  const copyHTMLToClipboard = () => {
    navigator.clipboard.writeText(getHTMLTemplate());
    alert("Pristine, high-converting standalone single-file HTML has been successfully compiled and copied to clipboard!");
  };

  const downloadHTMLFile = () => {
    const blob = new Blob([getHTMLTemplate()], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "index.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white text-[#0A0F2C] min-h-screen font-sans relative selection:bg-[#00D4FF] selection:text-[#0A0F2C]">
      
      {/* FLOATING MOBILE STICKY GET QUOTE ACTION */}
      <div className="fixed bottom-4 right-4 z-40 md:hidden">
        <a 
          href="#get-quote-block"
          className="bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold px-5 py-3 rounded-full flex items-center gap-2 shadow-2xl animate-bounce text-xs uppercase"
        >
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Get Custom Quote</span>
        </a>
      </div>

      {/* BRAND MAIN NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-[#0A0F2C] p-2 rounded-xl text-[#00D4FF]">
              <span className="text-xl font-bold font-display">🧊</span>
            </div>
            <span className="text-xl md:text-2xl font-black font-display tracking-tight text-[#0A0F2C] flex items-center">
              COOL<span className="text-cyan-500">TECH</span> VENDING
              <span className="text-[10px] ml-1 bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">SMART</span>
            </span>
          </div>

          <nav className="hidden md:flex space-x-8 text-sm font-bold text-slate-600">
            <a href="#features-deep" className="hover:text-cyan-600 transition-colors">Features</a>
            <a href="#haha-showcase" className="hover:text-cyan-600 transition-colors">Haha Vending</a>
            <a href="#qingo-showcase" className="hover:text-cyan-600 transition-colors">Qingo Vending</a>
            <a href="#compare" className="hover:text-cyan-600 transition-colors">Compare</a>
            <a href="#reviews" className="hover:text-cyan-600 transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-cyan-600 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setExportOpen(true)}
              className="bg-slate-100 border border-slate-200 hover:border-cyan-400 hover:bg-slate-200 text-xs text-slate-700 font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-4 h-4 text-cyan-600" />
              <span>Export HTML</span>
            </button>

            <button 
              onClick={() => { setCartOpen(true); setCheckoutStep("cart"); }}
              className="relative p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-800 transition-all shadow-sm"
              aria-label="Open purchase baggage cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-navy-dark text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            <a href="#get-quote-block" className="hidden lg:inline-block text-xs font-extrabold uppercase bg-cyan-400 hover:bg-cyan-300 text-navy-dark px-5 py-2.5 rounded-xl shadow-md transition-all">
              Get Custom Quote
            </a>
          </div>
        </div>
      </header>

      {/* HERO GLOW CONTAINER BACKGROUND */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 md:py-20 px-4 border-b border-slate-100">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,255,0.06),transparent_60%)]"></div>
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-glow"></div>

        {/* HERO CONTENT */}
        <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8 text-center pb-8">
          
          <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-full mb-6">
            <span className="text-[#0A0F2C]">🔥</span>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
              Authorized Distributor – Secure Direct Shipping on All Models
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-extrabold font-display leading-[1.08] tracking-tight text-[#0A0F2C]">
            AI-Powered Grab & Go <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-indigo-600 to-blue-700">
              Vending Coolers.
            </span>
          </h1>

          <p className="mt-6 text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-sans">
            Double retail sales and provide 24/7 premium amenities with the Tap, Grab & Go self-service refrigeration experience. Features integrated load cells, AI vision models, and instant cellular Nayax checkouts.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
            <a 
              href="#haha-showcase" 
              className="w-full sm:w-1/2 bg-[#00D4FF] hover:bg-cyan-300 text-[#0A0F2C] font-black text-center px-6 py-4 rounded-xl text-sm transition-all transform hover:-translate-y-1 block shadow-lg shadow-cyan-400/20 uppercase tracking-tight font-heading"
            >
              Haha Vending ($1,999)
            </a>
            <a 
              href="#qingo-showcase" 
              className="w-full sm:w-1/2 bg-[#0A0F2C] hover:bg-slate-950 text-white font-black text-center px-6 py-4 rounded-xl text-sm transition-all transform hover:-translate-y-1 block uppercase tracking-tight font-heading"
            >
              Qingo Vending ($3,499)
            </a>
          </div>

          {/* Core Specs Dashboard Grid in Center Layout */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto text-[#0A0F2C] font-sans">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
              <span className="text-2xl mb-1">⚖️</span>
              <p className="text-xs font-bold font-heading">LOAD CELL SHELVES</p>
              <p className="text-[10px] text-slate-500 mt-1">True sub-2g pressure scales</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
              <span className="text-2xl mb-1">📸</span>
              <p className="text-xs font-bold font-heading">DUAL AI EYE VISION</p>
              <p className="text-[10px] text-slate-500 mt-1">Fast visual gesture tracking</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
              <span className="text-2xl mb-1">📶</span>
              <p className="text-xs font-bold font-heading">LIVE CLOUD VMS</p>
              <p className="text-[10px] text-slate-500 mt-1">Restock push alerts & charts</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
              <span className="text-2xl mb-1">💳</span>
              <p className="text-xs font-bold font-heading">NAYAX PAYMENT LINK</p>
              <p className="text-[10px] text-slate-500 mt-1">Card, NFC & RFID badges</p>
            </div>
          </div>

        </div>
      </section>

      {/* TRUSTED SOURCE LOGO MARQUEE */}
      <section className="py-8 bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-semibold tracking-wider">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-black uppercase text-slate-400 tracking-widest">OFFICIAL COMMERCIAL partners:</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-slate-400 font-extrabold text-lg">
            <span className="hover:text-[#0A0F2C] transition-colors duration-200">VEND GUYS</span>
            <span className="hover:text-[#0A0F2C] transition-colors duration-200">NAYAX</span>
            <span className="hover:text-[#0A0F2C] transition-colors duration-200">MICRO-MARKETS</span>
            <span className="hover:text-[#0A0F2C] transition-colors duration-200">AI SMART RETAL</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-yellow-500">★★★★★</span>
            <span className="text-xs text-slate-700 font-bold">500+ Active Business Lobbies Rating 4.9★</span>
          </div>
        </div>
      </section>

      {/* PRODUCT 1 SHOWCASE: HAHA SMART COOLER */}
      <section id="haha-showcase" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-1"></div>
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center space-x-1.5 bg-cyan-100 text-cyan-800 text-xs font-bold px-3 py-1 rounded">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>Perfect Micro-Retail Gateway Choice</span>
            </span>
            
            <h2 className="text-3xl md:text-5xl font-extrabold font-display text-[#0A0F2C]">
              Haha Smart Cooler
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              The flagship smart cabinet from the Haha Vending series. Designed with a pristine glass door and high-accuracy weight sensors underneath every shelf. It turns any high-visibility office lounge or physical gym into a frictionless 24/7 retail slot.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-start space-x-2">
                <Check className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 text-sm">460L Shelf Layout</span>
                  <p className="text-slate-500 text-xs">Holds 240+ multi-size items</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 text-sm">12h Outage Backup</span>
                  <p className="text-slate-500 text-xs">Instant temperature safety battery</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 text-sm">Nayax Swiper Gateway</span>
                  <p className="text-slate-500 text-xs">Accept credit, NFC & employee cards</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 text-sm">Cloud VMS Suite</span>
                  <p className="text-slate-500 text-xs">Manage prices and inventory live</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 line-through block">MSRP: $2,499.00</span>
                <div className="flex items-baseline space-x-3">
                  <span className="text-4xl font-extrabold text-[#0A0F2C]">$1,999.00</span>
                  <span className="bg-red-100 text-red-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    SAVE $500 ON BUNDLE
                  </span>
                </div>
                <span className="text-xs text-[#0A0F2C] font-bold block mt-1">🏷️ Authorized Reseller — shipping directly via premium freight carriers</span>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => addToCart(products[0])}
                  className="w-full sm:w-auto bg-[#00D4FF] hover:bg-cyan-300 text-[#0A0F2C] font-black uppercase tracking-tight text-xs px-8 py-4 rounded-xl transition-all shadow-md transform hover:-translate-y-0.5"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>

          {/* Product Showcase Visual Layout (Right side) */}
          <div className="lg:col-span-1"></div>
          <div className="lg:col-span-5 relative">
            <div className="relative overflow-hidden rounded-3xl p-4 bg-gradient-to-tr from-cyan-400/5 to-slate-200/50 border border-slate-200">
              <img 
                src="https://images.unsplash.com/photo-1574757565409-e855c9f59380?auto=format&fit=crop&w=1000&q=80" 
                alt="Haha Smart Vending Cooler" 
                className="w-full h-[400px] object-cover rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-8 left-8 bg-white/95 backdrop-blur shadow border border-slate-200 px-4 py-2 rounded-xl">
                <span className="text-cyan-600 text-xs font-mono block uppercase">Haha Vending Series</span>
                <span className="text-sm font-extrabold text-[#0A0F2C]">AMBIENT & CHILLED CABINET</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT 2 SHOWCASE: QINGO SMART COOLER (FLAGSHIP RUGGED CHOICE) */}
      <section id="qingo-showcase" className="py-24 bg-[#0A0F2C] text-white border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Column */}
            <div className="lg:col-span-6 relative order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-3xl p-4 bg-gradient-to-tl from-orange-400/5 to-slate-200/50 border border-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1583258292688-d0213df4a3a8?auto=format&fit=crop&w=1000&q=80" 
                  alt="Qingo Smart Vending Cooler" 
                  className="w-full h-[400px] object-cover rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-8 left-8 bg-[#0A0F2C]/95 backdrop-blur shadow border border-white/10 px-4 py-2 rounded-xl">
                  <span className="text-orange-400 text-xs font-mono block uppercase">Qingo Flagship</span>
                  <span className="text-sm font-extrabold text-white">DUAL AI FUSION MERCHANDISER</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1 order-2"></div>

            {/* Custom Description Content Column */}
            <div className="lg:col-span-5 order-1 lg:order-3 space-y-6">
              <span className="inline-flex items-center space-x-1.5 bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded">
                <Award className="w-3.5 h-3.5 text-orange-400" />
                <span>Certified High-Traffic Vending Solution</span>
              </span>
              
              <h2 className="text-3xl md:text-5xl font-extrabold font-display text-white">
                Qingo Smart Cooler
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                The absolute king of commercial micro-markets. Fuses dual-angle high-speed camera computer vision tracking with robust bottom physical scale-plates. By correlating the weight changes with visual gesture identification, Qingo secures an unrivaled 99.9% checkout scan accuracy.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-100 text-sm">650L Giant Layout</span>
                    <p className="text-slate-400 text-xs">Accommodates 320+ multi-size slots</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-100 text-sm">AI Computer Vision</span>
                    <p className="text-slate-400 text-xs">Multi-lens gesture recognition matrix</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-100 text-sm">Industrial Compressors</span>
                    <p className="text-slate-400 text-xs">Dual stable zone preservation controls</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-100 text-sm">Cellular VMS Platform</span>
                    <p className="text-slate-400 text-xs">Track audits, telemetry & sales charts</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-slate-400 line-through block">MSRP: $4,299.00</span>
                  <div className="flex items-baseline space-x-3">
                    <span className="text-4xl font-extrabold text-white">$3,499.00</span>
                    <span className="bg-orange-500/20 text-orange-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      SAVE $800 NOW
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-bold block mt-1">⭐ Authorized Reseller — full manufacturer warranty support</span>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => addToCart(products[1])}
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-tight text-xs px-8 py-4 rounded-xl transition-all shadow-md transform hover:-translate-y-0.5"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS: 3 STEP STRATEGY */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black tracking-widest text-cyan-600 uppercase font-heading">EXTREMELY SIMPLE UTILITY</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A0F2C] font-display mt-2">How It Works in 3 Steps</h2>
          <p className="text-slate-500 mt-4 font-sans">Simple, straightforward integration to keep all offgrid moments healthy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line pattern on desktop */}
          <div className="absolute top-1/2 left-1/6 right-1/6 h-[2px] bg-slate-100 hidden md:block z-0"></div>
          
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative z-10 hover:shadow-md transition-all">
              <span className="text-5xl font-black font-display text-cyan-100 block mb-4">{step.no}</span>
              <h3 className="text-lg font-bold text-[#0A0F2C] flex items-center gap-1.5 mb-2">
                <span>{step.title}</span>
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SIDE-BY-SIDE COMPARISON TABLE */}
      <section id="compare" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black tracking-widest text-orange-600 uppercase font-heading">COMPARISON CHART</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A0F2C] font-display mt-2">Which Cooler Is Right for You?</h2>
            <p className="text-slate-500 mt-3 text-sm">Compare technical factors of our premium active units side by side.</p>
          </div>

          {/* Desktop visible table */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-800 text-xs uppercase tracking-wider font-heading">
                  <th className="p-4 font-bold">Specs Factors</th>
                  <th className="p-4 font-bold text-center text-cyan-800">Haha Smart Vending</th>
                  <th className="p-4 font-bold text-center text-orange-850 bg-orange-100/30">
                    <span className="inline-flex items-center gap-1">
                      <span>Qingo Vending 👑</span>
                      <span className="text-[9px] bg-orange-500 text-white px-2 py-0.5 rounded-full font-sans uppercase font-black">MOST POPULAR</span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="text-slate-700 text-sm divide-y divide-slate-100">
                <tr>
                  <td className="p-4 font-bold text-slate-800">Cabinet Volume</td>
                  <td className="p-4 text-center">460 Liters Capacity</td>
                  <td className="p-4 text-center font-bold text-slate-900 bg-orange-50/15">650 Liters Dual-Gate Space</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-800">Core Interaction Tech</td>
                  <td className="p-4 text-center">Precision Weight Load Plates</td>
                  <td className="p-4 text-center font-bold text-orange-600 bg-orange-50/15">Dual Action Sensor Fusion (AI Vision + Weights)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-800">Checkout Accuracy</td>
                  <td className="p-4 text-center">~98.5% automatic item matching</td>
                  <td className="p-4 text-center bg-orange-50/15 font-bold text-slate-900">99.9% flawless transaction rating</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-800">Secure Payment Support</td>
                  <td className="p-4 text-center">Inbuilt MDB Nayax card Reader</td>
                  <td className="p-4 text-center bg-orange-50/15 font-bold text-slate-900">Nayax + RFID badge + direct QR portals</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-800">Cellular Cloud VMS</td>
                  <td className="p-4 text-center">Yes (Daily sales tracking)</td>
                  <td className="p-4 text-center bg-orange-50/15 font-bold text-slate-900">Premium VMS (Vision recordings auditing + live charts)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-800">Uptime Backup Power</td>
                  <td className="p-4 text-center">12 Hours (Continuous thermostatic hold)</td>
                  <td className="p-4 text-center bg-orange-50/15 text-orange-600 font-bold">18 Hours (Full dual-engine hold + router backups)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-800">Weight & Materials</td>
                  <td className="p-4 text-center">130 kg (Ultra steel framework)</td>
                  <td className="p-4 text-center bg-orange-50/15">192 kg (Reinforced triple-paned heat glass)</td>
                </tr>
                <tr className="bg-slate-50/40">
                  <td className="p-4 font-extrabold text-slate-900">Promo Reseller Price</td>
                  <td className="p-4 text-center text-[#0A0F2C] font-black text-lg">$1,999.00</td>
                  <td className="p-4 text-center bg-orange-50/15 text-orange-600 font-black text-xl">$3,499.00</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-800">Best Installed in</td>
                  <td className="p-4 text-center text-xs">Gyms, mid-size office lounges, regional lobbies</td>
                  <td className="p-4 text-center text-xs bg-orange-50/15 text-slate-800 font-medium">High-density public lobbies, transit squares, major event hubs</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Quick Mobile Compare Toggles */}
          <div className="md:hidden space-y-4">
            <div className="flex bg-slate-200 p-1.5 rounded-lg gap-2">
              <button 
                onClick={() => setActiveCompareId("haha")}
                className={`flex-1 py-2 rounded font-bold text-xs ${activeCompareId === "haha" ? "bg-white text-[#0A0F2C] shadow-sm" : "text-slate-600"}`}
              >
                Haha specs view
              </button>
              <button 
                onClick={() => setActiveCompareId("qingo")}
                className={`flex-1 py-2 rounded font-bold text-xs ${activeCompareId === "qingo" ? "bg-orange-500 text-white shadow-sm" : "text-slate-600"}`}
              >
                Qingo specs view
              </button>
            </div>

            {activeCompareId === "haha" ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-sm">
                <div className="border-b pb-2 flex justify-between"><span className="text-slate-500">Volume & Zone</span><span className="font-bold">460L Plate Layout</span></div>
                <div className="border-b pb-2 flex justify-between"><span className="text-slate-500">Accuracy rate</span><span className="font-bold">~98.5% automatic scan</span></div>
                <div className="border-b pb-2 flex justify-between"><span className="text-slate-500">Battery Limit</span><span className="font-bold">12 Hours continuous</span></div>
                <div className="border-b pb-2 flex justify-between"><span className="text-slate-500">Payment interface</span><span className="font-bold">Nayax debit card</span></div>
                <div className="border-b pb-2 flex justify-between"><span className="text-slate-500">Cloud telemetry</span><span className="text-slate-800 font-bold">Sales VMS included</span></div>
                <div className="pt-2 flex justify-between items-baseline"><span className="font-bold">Inquiry Price</span><span className="text-lg font-black text-cyan-600">$1,999</span></div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-md space-y-3 text-sm">
                <div className="border-b pb-2 flex justify-between"><span className="text-slate-500">Volume & Zone</span><span className="font-bold text-orange-600">650L Double layout</span></div>
                <div className="border-b pb-2 flex justify-between"><span className="text-slate-500">Accuracy rate</span><span className="font-bold text-orange-600">99.9% Supreme Precision</span></div>
                <div className="border-b pb-2 flex justify-between"><span className="text-slate-500">Battery Limit</span><span className="font-bold text-orange-600">18 Hours long endurance</span></div>
                <div className="border-b pb-2 flex justify-between"><span className="text-slate-500">Payment interface</span><span className="font-bold text-orange-600">Nayax + employee badge</span></div>
                <div className="border-b pb-2 flex justify-between"><span className="text-slate-500">Cloud telemetry</span><span className="font-bold text-green-600">Premium audit with video</span></div>
                <div className="pt-2 flex justify-between items-baseline"><span className="font-bold">Inquiry Price</span><span className="text-lg font-black text-orange-600">$3,499</span></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES DEEP-DIVE SECTION WITH ALTERNATING COLUMNS */}
      <section id="features-deep" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-black tracking-widest text-cyan-600 uppercase font-heading">INDUSTRIAL SMART LOGISTICS</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A0F2C] font-display mt-2">Modernize Traditional Vending Jams</h2>
          <p className="text-slate-500 mt-4 leading-relaxed font-sans">Eliminate mechanical spirals, item lodging, physical coins, and tedious manual inventory tracking. Run a fully automated smart-refrigeration business with 24/7 web accessibility.</p>
        </div>

        <div className="space-y-28">
          {deepDiveFeatures.map((feat, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col lg:flex-row items-center gap-12 ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
            >
              <div className="w-full lg:w-1/2 relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-transparent rounded-2xl filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img 
                  src={feat.image} 
                  alt={feat.title} 
                  className="w-full h-[360px] object-cover rounded-2xl shadow-lg border border-slate-200 relative z-10 transition-transform duration-500 group-hover:scale-[1.01]"
                />
              </div>

              <div className="w-full lg:w-1/2 space-y-6">
                <span className="text-xs font-black text-cyan-600 uppercase font-heading">CORE SPECS 0{idx + 1}</span>
                <h3 className="text-3xl font-extrabold text-[#0A0F2C] tracking-tight">{feat.title}</h3>
                <p className="text-slate-600 leading-relaxed text-base">{feat.desc}</p>
                
                <ul className="space-y-3">
                  {feat.specs.map((sp, sIdx) => (
                    <li key={sIdx} className="flex items-center space-x-2 text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                      <span>{sp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS GRID (CUSTOMER PROOF BLOCK) */}
      <section id="reviews" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black tracking-widest text-[#0A0F2C] uppercase font-heading">PROVEN B2B OPERATORS</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A0F2C] mt-2 font-display">What Vending Operators Say</h2>
            <p className="text-slate-500 mt-4 font-sans">Read firsthand success stories from regional micro-market operators, office community coordinators, and gym facility directors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(rev.stars)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed italic">"{rev.text}"</p>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-sm text-[#0A0F2C] block">{rev.name}</span>
                    <span className="text-xs text-slate-400">{rev.location}</span>
                  </div>
                  <span className="text-[10px] bg-slate-100/80 text-slate-600 px-2.5 py-1 rounded-full font-bold">
                    {rev.product}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCORDION FAQ CONTAINER */}
      <section id="faq" className="py-24 bg-[#0A0F2C] text-white border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-xs font-black tracking-widest text-[#00D4FF] uppercase font-heading">VENDING QUESTIONS ANSWERED</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-2 font-display">Frequently Asked Questions</h2>
            <p className="text-slate-300 mt-4 font-sans">All technical, network, MDB payment gateway, and cooling telemetry inquiries answered by our micro-market operations team.</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-[#131b42] rounded-2xl border border-white/10 overflow-hidden transition-all duration-200"
                >
                  <button 
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-5 font-bold text-slate-100 text-base flex justify-between items-center bg-white/5 hover:bg-white/10 transition-all focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-[#00D4FF]" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 py-5 text-slate-300 text-sm leading-relaxed bg-[#1a2356]/30 border-t border-white/10">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL BUY NOW/CTA & PRICING PLANS */}
      <section id="pricing-cards" className="py-24 bg-white text-[#0A0F2C] overflow-hidden relative border-t border-slate-200">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,212,255,0.04),transparent_65%)]"></div>
        
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <span className="text-xs font-black tracking-widest text-cyan-600 uppercase font-heading">SECURE YOUR CHILL TODAY</span>
          <h2 className="text-4xl md:text-6xl font-black text-[#0A0F2C] mt-1 mb-4 font-display">Ready to Set Up Your Smarter Spot?</h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-16 text-sm md:text-base font-sans">Claim these exclusive commercial reseller rates, free freight pallet delivery, and a complete 2-Year direct factory replacement warranty package.</p>
 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left text-[#0A0F2C]">
            
            {/* Haha Unit Plan Card */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 relative hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col justify-between">
              <div>
                <span className="bg-cyan-100 text-cyan-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-4 inline-block font-heading">BEST VALUE CABINET</span>
                <h3 className="text-2xl font-black text-[#0A0F2C] mb-1 font-display">Haha Smart Cooler</h3>
                <p className="text-slate-500 text-xs mb-6">460 Liters single unit layout featuring physical load cells.</p>
                
                <div className="flex items-baseline space-x-2 text-[#0A0F2C] mb-6">
                  <span className="text-4xl font-extrabold font-display">$1,999.00</span>
                  <span className="text-slate-400 text-xs line-through">$2,499.00 MSRP</span>
                </div>
 
                <ul className="space-y-3 text-xs text-slate-700 mb-8 border-t border-slate-100 pt-4 font-sans">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-cyan-600" />
                    <span>Multi-shelf pressure load cell tracking system</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-cyan-600" />
                    <span>Inbuilt Nayax swipe + tap NFC credit reader</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-cyan-600" />
                    <span>12 hour blackout thermal cooling security cell</span>
                  </li>
                </ul>
              </div>
 
              <button 
                onClick={() => addToCart(products[0])}
                className="w-full bg-[#00D4FF] hover:bg-cyan-300 text-[#0A0F2C] font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl text-center transform hover:-translate-y-0.5 transition-all shadow-md mt-auto"
              >
                Inquire & Purchase Haha
              </button>
            </div>
 
            {/* Qingo Plan Card */}
            <div className="bg-white p-8 rounded-3xl border-2 border-orange-500 relative hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col justify-between">
              <div className="absolute -top-3.5 right-6 bg-orange-500 text-white text-[9px] font-extrabold px-3 py-1 rounded-full tracking-widest uppercase">
                RECOMMENDED FLAGSHIP
              </div>
              
              <div>
                <span className="bg-orange-100 text-orange-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-4 inline-block font-heading">PREMIUM AI MERCHANDISER</span>
                <h3 className="text-2xl font-black text-[#0A0F2C] mb-1 font-display">Qingo Vending Cooler</h3>
                <p className="text-slate-500 text-xs mb-6">650 Liters premium dual-fusion computer vision & weight layout.</p>
                
                <div className="flex items-baseline space-x-2 text-[#0A0F2C] mb-6">
                  <span className="text-4xl font-extrabold font-display text-orange-600">$3,499.00</span>
                  <span className="text-slate-400 text-xs line-through">$4,299.00 MSRP</span>
                </div>
 
                <ul className="space-y-3 text-xs text-slate-700 mb-8 border-t border-slate-100 pt-4 font-sans">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold text-slate-800">Dynamic dual-zone computer vision cameras</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold text-slate-800">Robust plate sensory weight fusion (99.9% accuracy)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-orange-500" />
                    <span>Commercial pricing/restock cloud dashboard</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-orange-500" />
                    <span>Nayax + RFID employee badges integration</span>
                  </li>
                </ul>
              </div>
 
              <button 
                onClick={() => addToCart(products[1])}
                className="w-full bg-[#0A0F2C] hover:bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl text-center transform hover:-translate-y-0.5 transition-all shadow-md mt-auto"
              >
                Inquire & Purchase Qingo
              </button>
            </div>
 
          </div>
 
          {/* Secure Purchase Trust Badges strip */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto text-slate-600 text-xs border-t border-slate-200 pt-10 font-sans font-semibold">
            <div className="flex items-center justify-center space-x-2 bg-slate-50 px-4 py-3 rounded-lg border border-slate-200">
              <Lock className="w-4 h-4 text-cyan-600" />
              <span>Commercial encrypted checkout</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-slate-50 px-4 py-3 rounded-lg border border-slate-200">
              <Truck className="w-4 h-4 text-cyan-600" />
              <span>Ships within 24 hours via premium freight</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-slate-50 px-4 py-3 rounded-lg border border-slate-200">
              <RotateCcw className="w-4 h-4 text-cyan-600" />
              <span>30-Day satisfaction warranty return</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-slate-50 px-4 py-3 rounded-lg border border-slate-200">
              <Award className="w-4 h-4 text-cyan-600" />
              <span>CONFIDENT 2-YEAR DIRECT FACTORY WARRANTY</span>
            </div>
          </div>
        </div>
      </section>

      {/* CHRIS CUSTOM INTERACTIVE GET QUOTE SECTION */}
      <section id="get-quote-block" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-black tracking-widest text-cyan-600 uppercase font-heading">CUSTOM COMMERCIAL SOLUTIONS</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A0F2C] mt-2 mb-4 font-display">Get a Custom Pricing Quote</h2>
          <p className="text-slate-500 max-w-2xl mx-auto mb-16 text-sm font-sans">Fill in the quick parameters below to receive specialized volume discounts, freight options, and cellular remote Nayax configuration templates.</p>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-xl relative text-left">
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-cyan-400 text-[#0A0F2C] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm font-heading">
                Quick Response
              </div>
              
              {quoteSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0A0F2C] font-display">Quote Request Sent!</h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-sans">
                    Thank you, <strong className="text-[#0A0F2C]">{quoteForm.name}</strong>. Our dedicated smart vending coordinator will contact you at <strong className="text-[#0A0F2C]">{quoteForm.email}</strong> or by phone at <strong className="text-[#0A0F2C]">{quoteForm.phone}</strong> in under 60 minutes with a full custom bulk estimate.
                  </p>
                  <div className="pt-4">
                    <button 
                      type="button"
                      onClick={() => {
                        setQuoteSubmitted(false);
                        setQuoteForm({
                          name: "",
                          businessName: "",
                          email: "",
                          phone: "",
                          model: "multiple",
                          locations: "1",
                          notes: ""
                        });
                      }}
                      className="bg-slate-100 text-[#0A0F2C] hover:bg-slate-200 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors font-heading"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setQuoteSubmitted(true); }} className="space-y-4 text-left">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-500 block mb-1 uppercase tracking-wider font-heading">Your Name *</label>
                        <input 
                          required 
                          id="quote-name-input"
                          type="text" 
                          placeholder="John Doe"
                          value={quoteForm.name}
                          onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                          className="bg-slate-50 border border-slate-200 focus:border-[#00D4FF] focus:bg-white text-xs rounded-xl block w-full p-3 text-slate-800 outline-none transition-colors border-slate-200/90 font-sans" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-500 block mb-1 uppercase tracking-wider font-heading">Workspace Name *</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="Acme Corp"
                          value={quoteForm.businessName}
                          onChange={(e) => setQuoteForm({ ...quoteForm, businessName: e.target.value })}
                          className="bg-slate-50 border border-slate-200 focus:border-[#00D4FF] focus:bg-white text-xs rounded-xl block w-full p-3 text-slate-800 outline-none transition-colors border-slate-200/90 font-sans" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-500 block mb-1 uppercase tracking-wider font-heading">Business Email *</label>
                        <input 
                          required 
                          type="email" 
                          placeholder="john@example.com"
                          value={quoteForm.email}
                          onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                          className="bg-slate-50 border border-slate-200 focus:border-[#00D4FF] focus:bg-white text-xs rounded-xl block w-full p-3 text-slate-800 outline-none transition-colors border-slate-200/90 font-sans" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-500 block mb-1 uppercase tracking-wider font-heading">Phone Number *</label>
                        <input 
                          required 
                          type="tel" 
                          placeholder="(555) 000-0000"
                          value={quoteForm.phone}
                          onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                          className="bg-slate-50 border border-slate-200 focus:border-[#00D4FF] focus:bg-white text-xs rounded-xl block w-full p-3 text-slate-800 outline-none border-slate-200/90 transition-colors font-sans" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-500 block mb-1 uppercase tracking-wider font-heading">Cabinet Model</label>
                        <select 
                          value={quoteForm.model}
                          onChange={(e) => setQuoteForm({ ...quoteForm, model: e.target.value })}
                          className="bg-slate-50 border border-slate-200 focus:border-[#00D4FF] focus:bg-white text-xs rounded-xl block w-full p-3 text-slate-800 outline-none border-slate-200/90 cursor-pointer text-slate-800 font-sans"
                        >
                          <option value="haha">Haha Vending ($1,999)</option>
                          <option value="qingo">Qingo Vending ($3,499)</option>
                          <option value="multiple">Bundle (Multiple Units)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-500 block mb-1 uppercase tracking-wider font-heading">Planned Locations</label>
                        <select 
                          value={quoteForm.locations}
                          onChange={(e) => setQuoteForm({ ...quoteForm, locations: e.target.value })}
                          className="bg-slate-50 border border-slate-200 focus:border-[#00D4FF] focus:bg-white text-xs rounded-xl block w-full p-3 text-slate-800 outline-none border-slate-200/90 cursor-pointer text-slate-800 font-sans"
                        >
                          <option value="1">1 Placement Spot</option>
                          <option value="2-4">2 - 4 Placement Spots</option>
                          <option value="5+">5+ Regional Lobbies</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold text-slate-500 block mb-1 uppercase tracking-wider font-heading">Special Requirements</label>
                      <textarea 
                        rows={2}
                        placeholder="RFID reader options, custom branding..."
                        value={quoteForm.notes}
                        onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                        className="bg-slate-50 border border-slate-200 focus:border-[#00D4FF] focus:bg-white text-xs rounded-xl block w-full p-3 text-slate-800 outline-none resize-none transition-colors border-slate-200/90 font-sans"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#0A0F2C] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all shadow-md transform hover:-translate-y-0.5 pointer-events-auto font-heading"
                  >
                    Retrieve Custom Estimate
                  </button>
                  <p className="text-[10px] text-center text-slate-400">⚡ No obligation quote. Delivered within 60 minutes.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
 
      {/* FOOTER SECTION */}
      <footer className="py-16 bg-slate-900 border-t border-slate-800 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          
          <div className="space-y-4 font-sans">
            <span className="text-xl font-black tracking-tight text-white font-display">
              COOL<span className="text-cyan-500">TECH</span> VENDING🧊
            </span>
            <p className="text-slate-500 text-xs leading-relaxed">Providing high-end frictionless self-service setups, remote VMS cloud controllers, and automated retail solutions to businesses nationwide.</p>
          </div>
 
          <div className="space-y-2 font-sans">
            <span className="text-white font-bold text-xs uppercase tracking-wider block">NAVIGATION</span>
            <a href="#features-deep" className="block text-slate-500 hover:text-white text-xs transition-colors">Vending Features</a>
            <a href="#compare" className="block text-slate-500 hover:text-white text-xs transition-colors">Model Comparison Table</a>
            <a href="#reviews" className="block text-slate-500 hover:text-white text-xs transition-colors">Operator Reviews</a>
          </div>
 
          <div className="space-y-2 font-sans">
            <span className="text-white font-bold text-xs uppercase tracking-wider block">SUPPORT & TRUST</span>
            <a href="#faq" className="block text-slate-500 hover:text-white text-xs transition-colors">Operations FAQ</a>
          </div>
 
          <div className="space-y-4 font-sans">
            <span className="text-white font-bold text-xs uppercase tracking-wider block">NEWSLETTER DEALS</span>
            <p className="text-xs text-slate-500 leading-relaxed">Submit your emails to receive micro-market discount codes and cellular VMS platform release logs.</p>
            <div className="flex bg-slate-800 p-1 rounded-xl">
              <input type="email" placeholder="Your business email" className="bg-transparent px-3 py-2 text-xs focus:outline-none text-white w-full" />
              <button onClick={() => alert("Successfully joined!")} className="bg-cyan-500 text-slate-900 px-3 py-1.5 rounded font-bold text-xs">JOIN</button>
            </div>
          </div>
        </div>
 
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 font-medium font-sans">
          <span>&copy; 2026 CoolTech Vending Inc. All rights reserve-cooled.</span>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#faq" className="hover:underline">Privacy Policy</a>
            <span>&bull;</span>
            <a href="#faq" className="hover:underline">Terms of Service</a>
            <span>&bull;</span>
            <a href="#faq" className="hover:underline">Warranty details</a>
          </div>
        </div>
      </footer>

      {/* RETAIL PURCHASE DRAWER DIALOG PANEL (FULLY INTERACTIVE SYSTEM) */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            <button 
              onClick={() => setCartOpen(false)} 
              className="absolute inset-0 bg-[#0A0F2C]/60 backdrop-blur-sm transition-opacity w-full h-full text-left"
              aria-label="Close cart trigger"
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col bg-white shadow-2xl border-l border-slate-200">
                  
                  {/* Cart Header */}
                  <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-lg font-black text-[#0A0F2C] flex items-center gap-1.5">
                      <ShoppingBag className="w-5 h-5 text-cyan-600" />
                      <span>Adventure Cart Storage</span>
                    </span>
                    <button 
                      onClick={() => setCartOpen(false)}
                      className="text-slate-400 hover:text-[#0A0F2C] p-1.5 hover:bg-slate-200 rounded-lg transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Checkout Stage Tabs */}
                  {cart.length > 0 && (
                    <div className="bg-slate-100/80 p-2 flex border-b border-slate-200 text-xs">
                      <button 
                        onClick={() => setCheckoutStep("cart")}
                        className={`flex-1 py-1.5 text-center font-bold rounded ${checkoutStep === "cart" ? "bg-white text-[#0A0F2C] shadow-sm" : "text-slate-500"}`}
                      >
                        1. Review Baggage
                      </button>
                      <button 
                        onClick={() => setCheckoutStep("shipping")}
                        className={`flex-1 py-1.5 text-center font-bold rounded ${checkoutStep === "shipping" ? "bg-white text-[#0A0F2C] shadow-sm" : "text-slate-500"}`}
                      >
                        2. Shipping & Payment
                      </button>
                    </div>
                  )}

                  {/* Cart Content Switch Area */}
                  {cart.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                      <ShoppingBag className="w-16 h-16 text-slate-300 stroke-[1.25]" />
                      <div>
                        <span className="font-extrabold text-base text-slate-800 block">Your shopping bag is empty</span>
                        <p className="text-slate-500 text-xs mt-1">Select our smart coolers to unlock discount structures!</p>
                      </div>
                      <button 
                        onClick={() => { setCartOpen(false); }}
                        className="bg-[#0A0F2C] text-white font-bold text-xs uppercase px-6 py-3 rounded-lg"
                      >
                        Browse Coolers
                      </button>
                    </div>
                  ) : checkoutStep === "cart" ? (
                    /* STEP 1: CART LIST */
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      
                      {/* Products items inside backpack */}
                      <div className="space-y-4">
                        <span className="text-xs uppercase font-black text-slate-400 tracking-wider block">Items list</span>
                        {cart.map((item, index) => (
                          <div key={index} className="flex gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
                            <img src={item.product.imgUrl} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg border shadow-sm" />
                            <div className="flex-1 min-w-0">
                              <span className="font-extrabold text-[#0A0F2C] text-sm block truncate">{item.product.name}</span>
                              <span className="text-xs text-slate-500 truncate block">{item.product.tagline}</span>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="font-black text-slate-800 text-sm">${item.product.price}</span>
                                <div className="flex items-center space-x-2 bg-white rounded-lg border border-slate-200 p-1">
                                  <button onClick={() => updateQty(item.product.id, -1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><Minus className="w-3.5 h-3.5" /></button>
                                  <span className="text-xs font-bold text-slate-800 px-1">{item.quantity}</span>
                                  <button onClick={() => updateQty(item.product.id, 1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><Plus className="w-3.5 h-3.5" /></button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Recommend Accessories Cross-sell Bundle System */}
                      <div className="border-t border-slate-200 pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase font-black text-slate-400 tracking-wider block">Add Recommended Accessories</span>
                          <span className="text-[10px] bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded uppercase">Highly recommended</span>
                        </div>
                        
                        <div className="space-y-2">
                          {addonOptions.map((addon) => {
                            const isAdded = selectedAddons.some(ad => ad.id === addon.id);
                            return (
                              <button 
                                key={addon.id}
                                onClick={() => toggleAddonOption(addon)}
                                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${isAdded ? "bg-cyan-50 border-cyan-500 shadow-sm" : "bg-white border-slate-200 hover:border-slate-300"}`}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className={`w-5 h-5 rounded flex items-center justify-center border text-white ${isAdded ? "bg-cyan-500 border-cyan-500" : "border-slate-300 bg-white"}`}>
                                    {isAdded && <Check className="w-4 h-4 stroke-[3]" />}
                                  </div>
                                  <div>
                                    <span className="text-xs font-bold text-slate-800 block">{addon.name}</span>
                                    <span className="text-[10px] text-slate-400 underline">{addon.badge}</span>
                                  </div>
                                </div>
                                <span className="text-xs font-black text-[#0A0F2C]">${addon.price}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : checkoutStep === "shipping" ? (
                    /* STEP 2: SHIPPING SECURE checkout FORM */
                    <form onSubmit={handleCheckoutSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                      <span className="text-xs uppercase font-black text-slate-400 tracking-wider block">Secure Shipping & Payments</span>
                      
                      <div className="space-y-4 bg-slate-50/60 p-5 rounded-2xl border border-slate-200">
                        <div>
                          <label className="text-xs font-extrabold text-slate-600 block mb-1 uppercase">Full Name</label>
                          <input 
                            required 
                            type="text" 
                            value={shippingForm.name} 
                            onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })} 
                            placeholder="John Doe" 
                            className="bg-white border text-sm rounded-lg block w-full p-2.5 focus:ring-cyan-500 focus:border-cyan-500 text-slate-800" 
                          />
                        </div>

                        <div>
                          <label className="text-xs font-extrabold text-slate-600 block mb-1 uppercase">Email Address</label>
                          <input 
                            required 
                            type="email" 
                            value={shippingForm.email} 
                            onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })} 
                            placeholder="username@gmail.com" 
                            className="bg-white border text-sm rounded-lg block w-full p-2.5 focus:ring-cyan-500 text-slate-800" 
                          />
                        </div>

                        <div>
                          <label className="text-xs font-extrabold text-slate-600 block mb-1 uppercase">Shipping Destination Address</label>
                          <input 
                            required 
                            type="text" 
                            value={shippingForm.address} 
                            onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })} 
                            placeholder="123 Wilderness Trail" 
                            className="bg-white border text-sm rounded-lg block w-full p-2.5 focus:ring-cyan-500 text-slate-800" 
                          />
                        </div>

                        <div>
                          <label className="text-xs font-extrabold text-slate-600 block mb-1 uppercase">Zip / Area Code</label>
                          <input 
                            required 
                            type="text" 
                            value={shippingForm.zip} 
                            onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })} 
                            placeholder="78701" 
                            className="bg-white border text-sm rounded-lg block w-full p-2.5 focus:ring-cyan-500 text-slate-800" 
                          />
                        </div>

                        <div>
                          <label className="text-xs font-extrabold text-slate-600 block mb-1 uppercase">Test Payment card number (secured live bypass)</label>
                          <input 
                            required 
                            type="text" 
                            value={shippingForm.card} 
                            onChange={(e) => setShippingForm({ ...shippingForm, card: e.target.value })} 
                            className="bg-white border text-sm rounded-lg block w-full p-2.5 focus:ring-cyan-500 text-slate-800 font-mono" 
                          />
                          <p className="text-[10px] text-slate-400 mt-1">🔒 Sandboxed SSL Direct Bypass enabled</p>
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        className="w-full bg-[#0A0F2C] text-white py-4 font-bold text-center rounded-xl hover:bg-slate-900 transition-all uppercase text-xs tracking-wider"
                      >
                        Submit Secure Checkout Payment (${grandTotal.toFixed(2)})
                      </button>
                    </form>
                  ) : (
                    /* SUCCESS DIALOG STAGE */
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                      <CheckCircle className="w-16 h-16 text-emerald-500" />
                      <div>
                        <span className="text-2xl font-black text-[#0A0F2C] block">Order Placed Successfully!</span>
                        <p className="text-slate-600 text-xs mt-2">Congratulations <b>{shippingForm.name}</b>, your smart cooler setup is reserved and heading to <b>{shippingForm.address}</b>!</p>
                        <p className="text-slate-400 text-xs mt-2">Tracking codes have been dispatched to <b>{shippingForm.email}</b>. Preparation queues will launch in next 24 Hours.</p>
                      </div>
                      
                      <button 
                        onClick={() => { setCart([]); setSelectedAddons([]); setCartOpen(false); setCheckoutStep("cart"); }}
                        className="bg-[#0A0F2C] text-white font-extrabold text-xs uppercase px-6 py-3 rounded-lg"
                      >
                        Continue Exploring
                      </button>
                    </div>
                  )}

                  {/* Pricing summaries footer inside Drawer */}
                  {cart.length > 0 && checkoutStep !== "success" && (
                    <div className="border-t border-slate-200 bg-slate-50 p-6 space-y-4">
                      
                      {/* Promo Codes System */}
                      {!promoApplied ? (
                        <div className="flex gap-2 text-xs">
                          <input 
                            type="text" 
                            placeholder="Enter Promo Code (COOLTECH10)" 
                            value={promoCode} 
                            onChange={(e) => setPromoCode(e.target.value)} 
                            className="border bg-white rounded-lg px-3 py-2 w-full focus:ring-1 focus:ring-cyan-500 text-slate-800 font-mono" 
                          />
                          <button 
                            type="button" 
                            onClick={handleApplyPromo}
                            className="bg-[#0A0F2C] text-white font-bold px-4 rounded-lg uppercase"
                          >
                            Apply
                          </button>
                        </div>
                      ) : (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex justify-between items-center text-xs text-emerald-800">
                          <span className="font-bold flex items-center gap-1">🎟️ Promo Code Applied!</span>
                          <span>-10% (-${promoDiscount.toFixed(2)})</span>
                        </div>
                      )}
                      
                      {promoError && <p className="text-red-500 text-xs">{promoError}</p>}

                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex justify-between"><span>Subtotal Smart Items:</span><span className="font-bold text-slate-800">${itemsSubtotal.toFixed(2)}</span></div>
                        {addonsSubtotal > 0 && <div className="flex justify-between"><span>Selected Accessories:</span><span className="font-bold text-slate-800">${addonsSubtotal.toFixed(2)}</span></div>}
                        {promoApplied && <div className="flex justify-between text-emerald-600 font-medium"><span>Promo Discount (COOLTECH10):</span><span>-${promoDiscount.toFixed(2)}</span></div>}
                        <div className="flex justify-between text-base font-black text-[#0A0F2C] border-t pt-2 mt-2">
                          <span>Grand Total Estimate:</span>
                          <span>${grandTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      {checkoutStep === "cart" && (
                        <button 
                          onClick={() => setCheckoutStep("shipping")}
                          className="w-full bg-[#0A0F2C] hover:bg-slate-900 text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider transition-all text-center block"
                        >
                          Proceed to secure checkout
                        </button>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* DETAILED EXPORT STANDALONE MODAL (As required by conversion specialist for absolute portability) */}
      {exportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/70 backdrop-blur-sm">
          <div className="bg-white text-[#0A0F2C] rounded-3xl p-8 max-w-2xl w-full border border-slate-200 shadow-2xl relative">
            <button onClick={() => setExportOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 p-1 bg-slate-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>

            <span className="text-[#00D4FF] text-xs font-mono block">CONVERSION OPTIMIZED EXPORTER</span>
            <h3 className="text-2xl font-black text-[#0A0F2C] mb-2 font-display">Export Standalone Landing Page</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-6">
              Get the entire landing page bundled cleanly into a single self-contained offline html files. Zero build steps, zero complex installation. Open in any modern mobile or desktop browsers directly.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 font-mono text-[10px] text-slate-600 max-h-48 overflow-y-auto">
              <pre>{`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CoolTech | The Smartest Coolers on the Planet</title>
  ...`}</pre>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                onClick={copyHTMLToClipboard}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold p-3.5 rounded-xl text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all"
              >
                <Copy className="w-4 h-4 text-[#00D4FF]" />
                Copy Complete Code
              </button>
              
              <button 
                onClick={downloadHTMLFile}
                className="bg-[#0A0F2C] hover:bg-slate-900 text-white font-bold p-3.5 rounded-xl text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4 text-[#00D4FF]" />
                Download file (index.html)
              </button>
            </div>
            
            <p className="text-[10px] text-slate-400 text-center mt-4">🔒 Secured & optimized for top load speed metrics (100% Core Web Vitals targets)</p>
          </div>
        </div>
      )}

      {/* PROFESSIONAL COMMERICAL GET QUOTE BOTTOM-LEFT MINI CARD POPUP */}
      {cookieConsent && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm bg-white border-2 border-cyan-400 text-[#0A0F2C] p-6 rounded-2xl shadow-2xl animate-fade-in flex flex-col gap-3">
          <button 
            type="button"
            onClick={() => setCookieConsent(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold p-1 hover:bg-slate-100 rounded"
            aria-label="Close quote popup"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-3">
            <span className="text-2xl">💼</span>
            <div>
              <span className="font-extrabold text-sm block text-slate-900 leading-tight">Ready to upgrade your lobby?</span>
              <p className="text-slate-500 text-xs leading-relaxed mt-1">Get custom commercial pricing, cellular setup, and volume freight shipping rates direct to your business.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button 
              type="button"
              onClick={() => {
                const element = document.getElementById("get-quote-block");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                  const firstInput = document.getElementById("quote-name-input");
                  if (firstInput) {
                    (firstInput as HTMLInputElement).focus();
                  }
                }
                setCookieConsent(false);
              }}
              className="bg-[#00D4FF] hover:bg-cyan-400 text-[#0A0F2C] font-black text-xs px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5"
            >
              <span>Get Custom Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

const steps = [
  { no: "01", title: "Tap Card or Scan QR", desc: "Customers present their credit/debit card, phone wallet (Apple/Google Pay), or scan the unique QR code on the glass front. The magnetic secure lock releases the door instantly." },
  { no: "02", title: "Grab Desired Items", desc: "Open the double-tempered anti-fog glass door and take any combination of beverages, fresh foods, snacks, or salads. Customers can inspect labels and return unwanted items freely." },
  { no: "02", title: "Close Door & Go", desc: "Upon door closure, the door locks, physical load-cell shelves measure the exact items removed, and the cloud computer processes the bill seamlessly in under 3 seconds." }
];

const deepDiveFeatures = [
  {
    title: "High-Precision Load Cell Shelves",
    desc: "Every single shelf is built with sensitive aerospace-grade weight plates that detect weight changes down to 2 grams. This allows Haha to automatically calculate multi-priced SKU inventory instantly.",
    specs: ["Sub-2g sensitivity range", "Automatic ambient offset balance", "Rugged shock-absorbent mounting", "Multi-stack support validation"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Dual AI Computer Vision Fusion",
    desc: "Deploying flagship Qingo Units grants access to top-tier security. Dynamic multi-camera matrix arrays capture real-time grab-and-return motions, matching weight shifts to visual item shapes for bulletproof verification.",
    specs: ["Multi-angle wide-aperture cameras", "Real-time edge neural inference", "99.9% multi-grab accuracy", "Dynamic gesture-association logic"],
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Real-time Cloud VMS & Nayax",
    desc: "Never run out of high-velocity stock. Integrated online vending dashboards track hourly sales, gross margin curves, and dispatch live restocking push alerts directly to your mobile browser when shelves deplete.",
    specs: ["Seamless Nayax card swiper native support", "Hourly live temperature chart history", "Encrypted cellular eSIM data links", "Easy CSV accounting spreadsheet exports"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
  }
];

const reviews = [
  {
    stars: 5,
    text: "We placed three Qingo smart cooling fridges across our hotel lobby halls. It has completely eliminated standard vending refunds! Guests love how seamless it is—just tap, choose a fresh cold salad, and walk away. Dynamic inventory tracking has cut restock trips in half.",
    name: "Marcus V.",
    location: "Austin, Texas - Marriott Franchise Owner",
    product: "Qingo Smart Cooler 👑"
  },
  {
    stars: 5,
    text: "Absolutely stunning technology. No gears, coils, or plastic spirals to jam, meaning zero dropped carbonated soda cans. Our team easily configured different pricing tags for sandwiches and craft energy beers. Simple to set up in our corporate breakrooms.",
    name: "Sarah L.",
    location: "Seattle, Washington - Corporate HR Mgr",
    product: "Haha Smart Cooler"
  },
  {
    stars: 5,
    text: "As an overland rest facility operator in Utah, we left the Haha Smart Cooler in our 24/7 self-service hub. Customers swipe high frequency credit cards to buy fresh local provisions. The Nayax credit system works flawlessly even with bad satellite delay.",
    name: "Brandon K.",
    location: "Denver, Colorado - Micro-Market Operator",
    product: "Haha Smart Cooler"
  },
  {
    stars: 5,
    text: "The Qingo visual computer vision is brilliant. Hospital staff grab pre-packaged dinners at midnight, and even if they pick an item up, look at the label, and return it to a different shelf, the machine auto-adjusts before billing. Truly premium customer satisfaction experience.",
    name: "Cap. Dave H.",
    location: "Miami, Florida - Healthcare Operations Director",
    product: "Qingo Smart Cooler 👑"
  }
];

const faqItems = [
  {
    q: "How does the machine accurately detect which item was grabbed?",
    a: "Our smart coolers use advanced pressure-sensitive load-cell arrays embedded below each individual SKU slot. Flagship Qingo coolers additionally pair this weight telemetry with multi-angle Computer Vision cameras inside the chassis. The dual sensor fusion accurately identifies purchases up to a 99.9% precision metric."
  },
  {
    q: "What payment terminals and currencies are supported?",
    a: "Every unit comes fully pre-wired with native mounting space for standard Nayax Onyx card readers, supporting magnetic stripes, chip inserting, contactless tap-to-pay credit/debit cards, Apple Pay, Google Pay, and custom RFID employee badges."
  },
  {
    q: "What happens if a customer returns an item back to a different shelf?",
    a: "Our system is designed to handle this effortlessly. If a customer changes their mind, both the load plates and the machine's AI identify the placement. It registers the item as returned, ensuring they are only billed for whatever they successfully walk away with."
  },
  {
    q: "Do I need a continuous internet connection for these coolers?",
    a: "Yes. Both Haha and Qingo utilize real-time authorization to unlock their magnetic locks safely. Our systems come equipped with active Wi-Fi receivers and robust 4G LTE eSIM cellular multi-carrier antennas, ensuring connectivity out-of-the-box."
  },
  {
    q: "Is specialized staff training required to operate and manage the VMS dashboard?",
    a: "Not at all. The CoolTech Vending Management System (VMS) cloud dashboard is entirely web-based and highly intuitive. You can configure prices, review sales summaries, and analyze visual stock layout graphs directly from your phone or PC with zero coding."
  },
  {
    q: "What is your warranty and shipping dispatch policy?",
    a: "We ship our commercial refrigerators securely packaged on heavy-duty wooden pallets directly from NJ. Each purchase is reinforced with a 2-Year Full Replacement warranty on the smart refrigeration compressor and weight load systems."
  }
];
