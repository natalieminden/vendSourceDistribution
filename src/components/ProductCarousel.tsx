import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Product } from "../data/products";
import { asset } from "../lib/asset";

/**
 * Horizontal product rail: native scroll-snap rather than a carousel library,
 * so it drags on touch, scrolls with a trackpad, and needs no JS to be usable.
 * The arrows are a convenience on top of that, not the mechanism.
 *
 * Cards are sized in viewport percentages so the next one always peeks past the
 * right edge, which is what signals the row keeps going.
 */
export default function ProductCarousel({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // A device-pixel of slack: fractional scroll widths never land exactly.
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncEdges();
    el.addEventListener("scroll", syncEdges, { passive: true });
    const ro = new ResizeObserver(syncEdges);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", syncEdges);
      ro.disconnect();
    };
  }, [syncEdges]);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    // Advance by one card. Measured as the distance between two real cards so
    // the gap comes from the stylesheet rather than a copy of it kept here.
    const [first, second] = el.children as unknown as HTMLElement[];
    const delta = second
      ? second.offsetLeft - first.offsetLeft
      : (first?.offsetWidth ?? el.clientWidth * 0.8);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * delta, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div>
      {/*
       * The rail runs the full width of its panel, and the panel is the thing
       * that bleeds off the page — so cards stay visible right up to the screen
       * edge. Left padding matches the panel's own gutter so the first card
       * lines up under the heading, and scroll-padding-left mirrors it, or a
       * snapped card would jam flush against the panel's edge.
       */}
      <ul
        ref={trackRef}
        className="no-scrollbar flex gap-5 overflow-x-auto snap-x snap-mandatory pb-1
            pl-6 sm:pl-10 lg:pl-12 pr-6 sm:pr-10 lg:pr-12
            scroll-pl-6 sm:scroll-pl-10 lg:scroll-pl-12"
        // Focusable so the row can be scrolled with the arrow keys, and labelled
        // because a scrollable region needs a name to be announced.
        tabIndex={0}
        role="group"
        aria-label="Machines"
      >
        {/* Card widths are fractional so one always overhangs the right edge. */}
        {products.map(product => (
          <li key={product.id} className="snap-start shrink-0 w-[72%] sm:w-[44%] lg:w-[30%] xl:w-[23%]">
            <Link to={`/shop/${product.id}`} className="block">
              {/* White, not grey: the older catalogue shots carry a baked-in
                  white background and read as a floating box on any other fill. */}
              <div className="rounded-3xl bg-white border border-slate-200/70 overflow-hidden h-72 lg:h-80 flex items-center justify-center p-6">
                <img
                  src={asset(product.imgUrl)}
                  alt={`${product.name} smart vending cooler`}
                  width={product.imgW}
                  height={product.imgH}
                  loading="lazy"
                  decoding="async"
                  className="max-h-full w-auto object-contain"
                />
              </div>
              {/* Stacked rather than name-beside-price: at card width the two
                  columns wrapped into each other. */}
              <div className="mt-4">
                <h3 className="text-base font-bold text-slate-900 leading-snug">{product.name}</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2">{product.tagline}</p>
                <p className="mt-2.5 flex items-baseline gap-2">
                  <span className="text-base font-bold text-slate-900">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-slate-500 line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Padded to the panel's own gutter rather than the page container, since
          the panel is what these now sit inside. */}
      <div className="px-6 sm:px-10 lg:px-12 mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={atStart}
          aria-label="Previous machines"
          className="w-10 h-10 rounded-full border border-slate-300 text-slate-900 grid place-items-center transition-opacity disabled:opacity-35"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={atEnd}
          aria-label="Next machines"
          className="w-10 h-10 rounded-full bg-robin text-white grid place-items-center transition-opacity disabled:opacity-35"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
