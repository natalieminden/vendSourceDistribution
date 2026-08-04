import { createContext, useContext, useState, ReactNode } from "react";
import { Product, addonOptions } from "../data/products";
import { createCheckoutSession, validatePromo, trackEvent } from "../lib/api";

type Addon = (typeof addonOptions)[0];
type CartItem = { product: Product; quantity: number };

interface CartContextValue {
  cart: CartItem[];
  selectedAddons: Addon[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
  promoApplied: boolean;
  promoRate: number;
  promoError: string;
  promoChecking: boolean;
  checkoutError: string;
  checkoutLoading: boolean;
  addToCart: (product: Product) => void;
  updateQty: (productId: string, delta: number) => void;
  toggleAddonOption: (addon: Addon) => void;
  handleApplyPromo: () => Promise<void>;
  startCheckout: () => Promise<void>;
  resetCart: () => void;
  itemsSubtotal: number;
  addonsSubtotal: number;
  promoDiscount: number;
  grandTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoRate, setPromoRate] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoChecking, setPromoChecking] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(
      prev =>
        prev
          .map(item => {
            if (item.product.id === productId) {
              const nextQty = item.quantity + delta;
              return nextQty > 0 ? { ...item, quantity: nextQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[],
    );
  };

  const toggleAddonOption = (addon: Addon) => {
    setSelectedAddons(prev => {
      const exists = prev.some(item => item.id === addon.id);
      if (exists) {
        return prev.filter(item => item.id !== addon.id);
      }
      return [...prev, addon];
    });
  };

  /**
   * Promo codes double as rep referral codes, so validity and rate are resolved
   * server-side against the database rather than compared in the bundle.
   */
  const handleApplyPromo = async () => {
    const code = promoCode.trim();
    if (!code) {
      setPromoError("Enter a code to apply.");
      return;
    }

    setPromoChecking(true);
    setPromoError("");
    try {
      const result = await validatePromo(code);
      if (result.valid) {
        setPromoApplied(true);
        setPromoRate(result.rate);
      } else {
        setPromoApplied(false);
        setPromoRate(0);
        setPromoError(result.message || "That code isn't valid.");
      }
    } catch {
      setPromoError("Couldn't check that code. Please try again.");
    } finally {
      setPromoChecking(false);
    }
  };

  const itemsSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const addonsSubtotal = selectedAddons.reduce((sum, ad) => sum + ad.price, 0);
  const aggregateTotal = itemsSubtotal + addonsSubtotal;
  const promoDiscount = promoApplied ? aggregateTotal * promoRate : 0;
  const grandTotal = aggregateTotal - promoDiscount;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  /**
   * Hands off to Stripe Checkout. Name, email, address and payment details are
   * collected on Stripe's hosted page — this site never touches them.
   *
   * The displayed total above is indicative only; the server recomputes it from
   * the catalog so a tampered client can't set its own price.
   */
  const startCheckout = async () => {
    if (cart.length === 0 || checkoutLoading) return;

    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      trackEvent("checkout_start", window.location.pathname);
      const { url } = await createCheckoutSession({
        lines: cart.map(item => ({ productId: item.product.id, quantity: item.quantity })),
        addonIds: selectedAddons.map(addon => addon.id),
        promoCode: promoApplied ? promoCode.trim().toUpperCase() : null,
      });
      window.location.href = url;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Checkout is unavailable right now.");
      setCheckoutLoading(false);
    }
    // On success the browser navigates away, so the loading state stays set.
  };

  const resetCart = () => {
    setCart([]);
    setSelectedAddons([]);
    setCartOpen(false);
    setPromoCode("");
    setPromoApplied(false);
    setPromoRate(0);
    setPromoError("");
    setCheckoutError("");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        selectedAddons,
        cartOpen,
        setCartOpen,
        promoCode,
        setPromoCode,
        promoApplied,
        promoRate,
        promoError,
        promoChecking,
        checkoutError,
        checkoutLoading,
        addToCart,
        updateQty,
        toggleAddonOption,
        handleApplyPromo,
        startCheckout,
        resetCart,
        itemsSubtotal,
        addonsSubtotal,
        promoDiscount,
        grandTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
