import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { products, CONTACT_EMAIL } from "../data/products";
import { asset } from "../lib/asset";

export default function Shop() {
  return (
    <>
      <section className="bg-slate-50 border-b border-slate-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900">Shop All Machines</h1>
          <p className="text-slate-600 max-w-2xl mx-auto mt-4">
            Six commercial-grade smart vending and refrigeration models, each built for a different capacity and traffic level. Pick a machine to see full specs, pricing, and availability.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/shop/${product.id}`}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative bg-slate-50 p-4 flex items-center justify-center" style={{ height: "240px" }}>
                <img src={asset(product.imgUrl)} alt={product.name} className="h-full object-contain" />
              </div>
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide">{product.category}</span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1 mb-1">{product.name}</h2>
                  <p className="text-slate-500 text-sm mb-3">{product.tagline}</p>
                  <p className="text-slate-400 text-xs">{product.capacity}</p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-slate-400 line-through block">${product.originalPrice.toLocaleString()}</span>
                    )}
                    <span className="text-xl font-bold text-slate-900">${product.price.toLocaleString()}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg">
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="pb-16 lg:pb-24 max-w-4xl mx-auto px-4 text-center">
        <p className="text-slate-500 text-sm">
          Not sure which model fits your location?{" "}
          <Link to="/#contact" className="text-blue-600 font-semibold hover:underline">Talk to our team</Link> or email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 font-semibold hover:underline">{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </>
  );
}
