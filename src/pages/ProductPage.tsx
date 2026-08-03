import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft, Lock, Truck, RotateCcw, Award } from "lucide-react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { asset } from "../lib/asset";

type ProductTab = "overview" | "features" | "specs" | "included";

const tabs: { id: ProductTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "specs", label: "Specifications" },
  { id: "included", label: "What's included" },
];

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<ProductTab>("overview");
  const product = products.find(p => p.id === id);

  useEffect(() => {
    setActiveTab("overview");
  }, [id]);

  if (!product) {
    return (
      <section className="py-24 max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Machine not found</h1>
        <p className="text-slate-500 mb-8">We couldn't find that model. It may have been renamed or retired.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-3.5 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
      </section>
    );
  }

  const otherProducts = products.filter(p => p.id !== product.id).slice(0, 3);
  const saveAmount = product.originalPrice - product.price;

  const specRows: [string, string][] = [
    ["Capacity", product.capacity],
    ["Power & Backup", product.battery],
    ["Noise Level", product.noise],
    ["Payments", product.payments],
    ["Weight & Dimensions", product.weight],
    ["Best For", product.bestFor],
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-slate-500">
          <Link to="/shop" className="hover:text-slate-900 transition-colors">Shop</Link>
          <span className="text-slate-300">/</span>
          <Link to="/shop" className="hover:text-slate-900 transition-colors">{product.category}</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-medium">{product.name}</span>
        </div>
      </div>

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8 lg:gap-12 items-start">

          {/* Preview canvas + content */}
          <div className="min-w-0">
            <div className="relative rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/70 bg-white/60 backdrop-blur">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                </div>
                <span className="text-[11px] font-medium text-slate-400 tracking-wide">{product.category}</span>
                <span className="text-[11px] font-medium text-slate-400">Preview</span>
              </div>
              <div className="p-6 sm:p-10 lg:p-14 flex items-center justify-center">
                <img
                  src={asset(product.imgUrl)}
                  alt={product.name}
                  className="w-auto max-w-full h-72 sm:h-[420px] lg:h-[520px] object-contain drop-shadow-xl"
                />
              </div>
            </div>

            {/* Tab bar — swaps content in place, no scrolling */}
            <div className="mt-10 flex flex-wrap items-center gap-1.5 bg-slate-100 rounded-full p-1.5 w-fit max-w-full" role="tablist" aria-label="Product information">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="pt-8 min-h-[16rem]">
              {activeTab === "overview" && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
                  <p className="mt-3 text-slate-600 leading-relaxed max-w-3xl">{product.description}</p>
                  <p className="mt-4 text-slate-600 leading-relaxed max-w-3xl">
                    Best suited for {product.bestFor.replace(/\.$/, "")}. Every unit ships with the VendSource cloud
                    dashboard, so pricing, planograms, and sales reporting stay in one place from day one.
                  </p>
                </div>
              )}

              {activeTab === "features" && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Features</h2>
                  <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.specs.map((spec, idx) => (
                      <li key={idx} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5">
                        <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "specs" && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Technical Specifications</h2>
                  <dl className="mt-4 rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-sm">
                    {specRows.map(([label, value]) => (
                      <div key={label} className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 px-5 py-4 odd:bg-slate-50/60">
                        <dt className="text-slate-500">{label}</dt>
                        <dd className="sm:col-span-2 text-slate-800">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {activeTab === "included" && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">What's included</h2>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-200">
                      <Lock className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Commercial encrypted checkout</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-200">
                      <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Ships within 24 hours via premium freight</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-200">
                      <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>30-day satisfaction warranty return</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-200">
                      <Award className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>2-year direct factory warranty</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky purchase rail */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="inline-flex items-center bg-blue-50 text-blue-700 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                {product.badge}
              </span>

              <h1 className="mt-4 text-2xl font-bold text-slate-900 leading-tight">{product.name}</h1>
              <p className="mt-1.5 text-sm text-slate-600">{product.tagline}</p>

              <div className="mt-4 flex items-center gap-2 pb-5 border-b border-slate-100">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">VS</div>
                <div className="leading-tight">
                  <p className="text-xs font-semibold text-slate-900">VendSource Distribution</p>
                  <p className="text-[11px] text-slate-500">{product.category}</p>
                </div>
              </div>

              <div className="pt-5 flex items-baseline gap-2.5">
                <span className="text-3xl font-bold text-slate-900">${product.price.toLocaleString()}.00</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through">${product.originalPrice.toLocaleString()}.00</span>
                )}
                {saveAmount > 0 && <span className="text-xs font-semibold text-emerald-600">Save ${saveAmount}</span>}
              </div>

              <button
                onClick={() => addToCart(product)}
                className="mt-4 w-full bg-gradient-to-r from-blue-500/90 via-indigo-500/90 to-violet-500/90 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 border border-white/25 text-white font-semibold text-sm px-6 py-3.5 rounded-full transition-all shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5"
              >
                Add to Cart
              </button>
              <Link
                to="/shop"
                className="mt-2.5 w-full inline-flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-800 font-semibold text-sm px-6 py-3.5 rounded-full transition-colors"
              >
                Browse all machines
              </Link>

              <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
                Authorized reseller — shipping directly via premium freight carriers.
              </p>

              <dl className="mt-5 pt-5 border-t border-slate-100 space-y-2.5 text-xs">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500 shrink-0">Capacity</dt>
                  <dd className="text-slate-800 text-right">{product.capacity}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500 shrink-0">Noise</dt>
                  <dd className="text-slate-800 text-right">{product.noise}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500 shrink-0">Weight</dt>
                  <dd className="text-slate-800 text-right">{product.weight}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500 shrink-0">Warranty</dt>
                  <dd className="text-slate-800 text-right">2-year direct factory</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {/* Other machines */}
      <section className="py-12 lg:py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-slate-900 mb-8">Other Machines</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherProducts.map((p) => (
              <Link
                key={p.id}
                to={`/shop/${p.id}`}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative bg-slate-50 p-4 flex items-center justify-center" style={{ height: "180px" }}>
                  <img src={asset(p.imgUrl)} alt={p.name} className="h-full object-contain" />
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{p.name}</h3>
                    <span className="text-sm text-slate-500">${p.price.toLocaleString()}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/shop" className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:underline">
              View Full Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
