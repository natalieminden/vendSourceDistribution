import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { products, CONTACT_EMAIL } from "../data/products";
import { asset } from "../lib/asset";
import { usePageMeta } from "../lib/seo";

const SHOP_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "VendSource smart vending coolers",
  itemListElement: products.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      name: p.name,
      description: p.tagline,
      offers: { "@type": "Offer", price: p.price, priceCurrency: "USD" },
    },
  })),
};

export default function Shop() {
  usePageMeta({
    title: "Shop All Machines",
    description:
      "Six commercial smart vending and refrigeration models. Compare capacity, sensors and pricing, then order online or request volume pricing.",
    jsonLd: SHOP_JSONLD,
  });

  return (
    <>
      <section className="bg-slate-50 border-b border-slate-200 py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900">Shop All Machines</h1>
        </div>
      </section>

      <section className="py-10 lg:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <Link
              key={product.id}
              to={`/shop/${product.id}`}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all flex flex-col"
            >
              <div
                className="relative bg-slate-50 p-4 flex items-center justify-center"
                style={{ height: "240px" }}
              >
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
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-950 uppercase tracking-wide">
                    {product.category}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1 mb-1">{product.name}</h2>
                  <p className="text-slate-500 text-sm mb-3">{product.tagline}</p>
                  <p className="text-slate-500 text-xs">{product.capacity}</p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-slate-500 line-through block">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-xl font-bold text-slate-900">
                      ${product.price.toLocaleString()}
                    </span>
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
          <Link to="/contact" className="text-slate-950 font-semibold">
            Talk to our team
          </Link>{" "}
          or email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-slate-950 font-semibold">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>
    </>
  );
}
