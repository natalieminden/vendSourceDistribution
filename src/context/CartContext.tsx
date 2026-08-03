import { createContext, useContext, useState, FormEvent, ReactNode, Dispatch, SetStateAction } from "react";
import { Product, addonOptions } from "../data/products";

type Addon = typeof addonOptions[0];
type CartItem = { product: Product; quantity: number };
type CheckoutStep = "cart" | "shipping" | "success";

interface CartContextValue {
  cart: CartItem[];
  selectedAddons: Addon[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  checkoutStep: CheckoutStep;
  setCheckoutStep: (step: CheckoutStep) => void;
  shippingForm: { name: string; email: string; address: string; zip: string; card: string };
  setShippingForm: Dispatch<SetStateAction<{ name: string; email: string; address: string; zip: string; card: string }>>;
  promoCode: string;
  setPromoCode: (code: string) => void;
  promoApplied: boolean;
  setPromoApplied: (applied: boolean) => void;
  promoError: string;
  addToCart: (product: Product) => void;
  updateQty: (productId: string, delta: number) => void;
  toggleAddonOption: (addon: Addon) => void;
  handleApplyPromo: () => void;
  handleCheckoutSubmit: (e: FormEvent) => void;
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
  const [promoError, setPromoError] = useState("");
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [shippingForm, setShippingForm] = useState({ name: "", email: "", address: "", zip: "", card: "4111 2222 3333 4444" });

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
    }).filter(Boolean) as CartItem[]);
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

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "VENDSOURCE10") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid code. Try using: VENDSOURCE10");
    }
  };

  const itemsSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const addonsSubtotal = selectedAddons.reduce((sum, ad) => sum + ad.price, 0);
  const aggregateTotal = itemsSubtotal + addonsSubtotal;
  const promoDiscount = promoApplied ? aggregateTotal * 0.10 : 0;
  const grandTotal = aggregateTotal - promoDiscount;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!shippingForm.name || !shippingForm.email || !shippingForm.address) {
      alert("Please fulfill all shipping info requirements.");
      return;
    }
    setCheckoutStep("success");
  };

  const resetCart = () => {
    setCart([]);
    setSelectedAddons([]);
    setCartOpen(false);
    setCheckoutStep("cart");
    setPromoCode("");
    setPromoApplied(false);
  };

  return (
    <CartContext.Provider value={{
      cart, selectedAddons, cartOpen, setCartOpen, checkoutStep, setCheckoutStep,
      shippingForm, setShippingForm, promoCode, setPromoCode, promoApplied, setPromoApplied,
      promoError, addToCart, updateQty, toggleAddonOption, handleApplyPromo, handleCheckoutSubmit,
      resetCart, itemsSubtotal, addonsSubtotal, promoDiscount, grandTotal, cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
