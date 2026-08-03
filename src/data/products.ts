export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  badge: string;
  tagline: string;
  category: string;
  capacity: string;
  battery: string;
  noise: string;
  payments: string;
  weight: string;
  description: string;
  imgUrl: string;
  bestFor: string;
  specs: string[];
}

export const products: Product[] = [
  {
    id: "haha1200ultra",
    name: "Haha 1200 Ultra",
    price: 6799,
    originalPrice: 6999,
    badge: "Best Value Option",
    category: "Haha Vending Series",
    tagline: "The smarter vending experience: tap, grab, and go.",
    capacity: "460L heavy duty cabinet (holds up to 240+ multi-size items)",
    battery: "Built-in uninterruptible battery backup (secures temp for 12 hours of power outage)",
    noise: "40 dB quiet eco commercial cooling compressor",
    payments: "Nayax & Pax integrated payment processing & real-time VMS portal",
    weight: "115 kg (sturdy secure metal frame)",
    bestFor: "Office breakrooms, gyms, hotel lobbies, residential apartment hubs.",
    description: "Smart micro-market vending cooler with physical high-accuracy load-cell shelves. Customers tap to unlock, grab their snacks or beverages, close the door, and get charged automatically. Zero spiral jams, coils, or dropped item damage.",
    imgUrl: "products/haha-1200-ultra.jpeg",
    specs: ["Tap, grab & go convenience", "Load-cell weight modules", "Nayax & Pax payments", "Anti-fog heated glass door"]
  },
  {
    id: "max620",
    name: "Max 620",
    price: 4899,
    originalPrice: 4999,
    badge: "Recommended Flagship",
    category: "Max Series",
    tagline: "Redefining vending with dual AI vision and weight fusion.",
    capacity: "650L premium double glass cabinet (holds 320+ items)",
    battery: "Continuous uptime battery & safety temperature backup system",
    noise: "34 dB stealth active silent compressor and double cooling fan",
    payments: "Nayax & Pax integrated payment processing & real-time VMS portal",
    weight: "165 kg (extremely robust anti-vandal retail structure)",
    bestFor: "High-traffic commercial complexes, medical systems, universities, airport lounges.",
    description: "Dual isolated glass-door smart cooling vending station. Fuses advanced digital weight sensors with internal multi-angle AI computer vision cameras to maintain supreme 99.9% transaction accuracy, perfect even for chaotic grab-and-return behaviors.",
    imgUrl: "products/max-620.jpeg",
    specs: ["Scan, grab & go flow", "Computer vision camera sensors", "99.9% transaction accuracy", "Live cloud management dashboard"]
  },
  {
    id: "qingoking509",
    name: "Qingo King 509",
    price: 3799,
    originalPrice: 3799,
    badge: "Compact & Best Value",
    category: "Qingo AI Vending Series",
    tagline: "Compact & refined. Best value. Widely usable.",
    capacity: "14.8 cu ft — holds 378 bottles (or 240 with pushers)",
    battery: "Air-cooled refrigeration, 36-46°F (2-8°C) temperature range",
    noise: "<55 dB commercial compressor",
    payments: "Nayax & Pax integrated payment processing & real-time VMS portal",
    weight: "194 lbs (W26.38 × D25.39 × H73.62 inch)",
    bestFor: "Offices, gyms, break rooms, hotel lobbies.",
    description: "Compact single-door AI smart vending machine with 9 columns × 7 rows × 6 tiers. AI Dynamic Recognition technology delivers 99% transaction accuracy. Standard US outlet (120V/60Hz), Nayax & Pax payment terminals included.",
    imgUrl: "products/qingo-king-509.jpeg",
    specs: ["AI Dynamic Recognition", "99% accuracy", "Nayax & Pax payments", "Remote temp control"]
  },
  {
    id: "qingoace779",
    name: "Qingo Ace 779",
    price: 4999,
    originalPrice: 4999,
    badge: "Flagship Model",
    category: "Qingo AI Vending Series",
    tagline: "Flagship model. Large capacity. Full featured.",
    capacity: "20.5 cu ft — holds 495 bottles (or 393 with pushers)",
    battery: "Air-cooled refrigeration, 36-46°F (2-8°C) temperature range",
    noise: "<55 dB commercial compressor",
    payments: "Nayax & Pax integrated payment processing & real-time VMS portal",
    weight: "276 lbs (W32.64 × D26.18 × H78.66 inch)",
    bestFor: "High-traffic offices, universities, medical facilities, hotel lobbies.",
    description: "Full-featured single-door AI smart vending machine with 11 columns × 7 rows × 6 tiers (plus 11 × 3 × 1 tiers). AI Dynamic Recognition with 99% accuracy. Nayax & Pax terminals, beverage & snack pushers available.",
    imgUrl: "products/qingo-ace-779.jpeg",
    specs: ["AI Dynamic Recognition", "99% accuracy", "Nayax & Pax payments", "Remote temp control"]
  },
  {
    id: "qingopair1208",
    name: "Qingo Pair 1208",
    price: 6999,
    originalPrice: 6999,
    badge: "High Capacity",
    category: "Qingo AI Vending Series",
    tagline: "High capacity. Low refill frequency.",
    capacity: "36.4 cu ft — holds 672 bottles (or 588 with pushers)",
    battery: "Air-cooled refrigeration, 36-46°F (2-8°C) temperature range",
    noise: "<55 dB dual commercial compressor",
    payments: "Nayax & Pax integrated payment processing & real-time VMS portal",
    weight: "388 lbs (W48.23 × D27.76 × H82.09 inch)",
    bestFor: "Airports, transit hubs, large event venues, major commercial complexes.",
    description: "Dual glass-door high-capacity AI smart vending machine with 16 columns × 7 rows × 6 tiers. AI Dynamic Recognition with 99% accuracy. Built for locations that demand maximum throughput with minimal restocking frequency.",
    imgUrl: "products/qingo-pair-1208.jpeg",
    specs: ["Dual door high capacity", "99% AI accuracy", "Nayax & Pax payments", "Remote temp control"]
  },
  {
    id: "freezer",
    name: "Smart Freezer",
    price: 4699,
    originalPrice: 4999,
    badge: "Frozen & Specialty",
    category: "Smart Freezer Series",
    tagline: "Frozen & chilled items, zero hassle. Grab what you need.",
    capacity: "380L dedicated frozen cabinet (holds 180+ frozen items)",
    battery: "Insulated thermal backup — maintains frozen temps for 8 hours during outage",
    noise: "42 dB commercial-grade deep-freeze compressor",
    payments: "Nayax & Pax integrated payment processing & real-time VMS portal",
    weight: "120 kg (heavy-duty steel frame with anti-vibration mounts)",
    bestFor: "Break rooms, convenience stores, food courts, hospitality venues.",
    description: "Purpose-built smart frozen vending unit with load-cell shelving and a deep-freeze glass door cabinet. Handles everything from ice cream and frozen meals to packaged snacks — all contactless, 24/7.",
    imgUrl: "products/freezer.jpeg",
    specs: ["Deep-freeze load cell shelves", "Anti-fog heated glass door", "Nayax & Pax payments", "Live cloud VMS dashboard"]
  }
];

export const addonOptions = [
  { id: "solar_mat", name: "100W Foldable Ultra-Thin Solar Panel", price: 129, badge: "Eco Essential" },
  { id: "spare_cell", name: "Spare Premium 72h Backup Battery Module", price: 169, badge: "Double Distance" },
  { id: "ballistic_case", name: "Heavy-Duty Ballistic Armor Nylon Cover", price: 59, badge: "Adventure Proof" }
];

export const steps = [
  { no: "01", title: "Tap Card or Scan QR", desc: "Customers present their credit/debit card, phone wallet (Apple/Google Pay), or scan the unique QR code on the glass front. The magnetic secure lock releases the door instantly." },
  { no: "02", title: "Grab Desired Items", desc: "Open the double-tempered anti-fog glass door and take any combination of beverages, fresh foods, snacks, or salads. Customers can inspect labels and return unwanted items freely." },
  { no: "03", title: "Close Door & Go", desc: "Upon door closure, the door locks, physical load-cell shelves measure the exact items removed, and the cloud computer processes the bill seamlessly in under 3 seconds." }
];

export const reviews = [
  {
    stars: 5,
    text: "We placed three Qingo smart cooling fridges across our hotel lobby halls. It has completely eliminated standard vending refunds. Guests love how seamless it is—just tap, choose a fresh cold salad, and walk away. Dynamic inventory tracking has cut restock trips in half.",
    name: "Marcus V.",
    location: "Austin, Texas - Marriott Franchise Owner",
    product: "Qingo Smart Cooler"
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
    product: "Qingo Smart Cooler"
  }
];

export const faqItems = [
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
    a: "Not at all. The VendSource Vending Management System (VMS) cloud dashboard is entirely web-based and highly intuitive. You can configure prices, review sales summaries, and analyze visual stock layout graphs directly from your phone or PC with zero coding."
  }
];

export const CONTACT_EMAIL = "info@vendsourcedistribution.com";
