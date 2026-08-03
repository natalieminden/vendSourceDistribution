import { ShoppingBag, X, Minus, Plus, Check, CheckCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { addonOptions } from "../data/products";
import { asset } from "../lib/asset";

export default function CartDrawer() {
  const {
    cart, selectedAddons, cartOpen, setCartOpen, checkoutStep, setCheckoutStep,
    shippingForm, setShippingForm, promoCode, setPromoCode, promoApplied, promoError,
    updateQty, toggleAddonOption, handleApplyPromo, handleCheckoutSubmit, resetCart,
    itemsSubtotal, addonsSubtotal, promoDiscount, grandTotal
  } = useCart();

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        <button
          onClick={() => setCartOpen(false)}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity w-full h-full text-left"
          aria-label="Close cart trigger"
        />

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md">
            <div className="flex h-full flex-col bg-white shadow-2xl border-l border-slate-200">

              {/* Cart Header */}
              <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                  <span>Your Cart</span>
                </span>
                <button
                  onClick={() => setCartOpen(false)}
                  className="text-slate-400 hover:text-slate-900 p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Checkout Stage Tabs */}
              {cart.length > 0 && (
                <div className="bg-slate-100 p-2 flex border-b border-slate-200 text-xs">
                  <button
                    onClick={() => setCheckoutStep("cart")}
                    className={`flex-1 py-1.5 text-center font-semibold rounded ${checkoutStep === "cart" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                  >
                    1. Cart
                  </button>
                  <button
                    onClick={() => setCheckoutStep("shipping")}
                    className={`flex-1 py-1.5 text-center font-semibold rounded ${checkoutStep === "shipping" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                  >
                    2. Shipping &amp; Payment
                  </button>
                </div>
              )}

              {/* Cart Content Switch Area */}
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <ShoppingBag className="w-16 h-16 text-slate-300 stroke-[1.25]" />
                  <div>
                    <span className="font-semibold text-base text-slate-800 block">Your cart is empty</span>
                    <p className="text-slate-500 text-xs mt-1">Select a smart cooler to get started.</p>
                  </div>
                  <button
                    onClick={() => { setCartOpen(false); }}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-6 py-3 rounded-lg transition-colors"
                  >
                    Browse Coolers
                  </button>
                </div>
              ) : checkoutStep === "cart" ? (
                /* STEP 1: CART LIST */
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                  {/* Products items in cart */}
                  <div className="space-y-4">
                    <span className="text-xs uppercase font-semibold text-slate-400 tracking-wide block">Items</span>
                    {cart.map((item, index) => (
                      <div key={index} className="flex gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
                        <img src={asset(item.product.imgUrl)} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-slate-900 text-sm block truncate">{item.product.name}</span>
                          <span className="text-xs text-slate-500 truncate block">{item.product.tagline}</span>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="font-semibold text-slate-800 text-sm">${item.product.price}</span>
                            <div className="flex items-center space-x-2 bg-white rounded-lg border border-slate-200 p-1">
                              <button onClick={() => updateQty(item.product.id, -1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><Minus className="w-3.5 h-3.5" /></button>
                              <span className="text-xs font-semibold text-slate-800 px-1">{item.quantity}</span>
                              <button onClick={() => updateQty(item.product.id, 1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><Plus className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recommended Accessories */}
                  <div className="border-t border-slate-200 pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-semibold text-slate-400 tracking-wide block">Recommended Accessories</span>
                    </div>

                    <div className="space-y-2">
                      {addonOptions.map((addon) => {
                        const isAdded = selectedAddons.some(ad => ad.id === addon.id);
                        return (
                          <button
                            key={addon.id}
                            onClick={() => toggleAddonOption(addon)}
                            className={`w-full text-left p-3.5 rounded-xl border transition-colors flex items-center justify-between ${isAdded ? "bg-blue-50 border-blue-600" : "bg-white border-slate-200 hover:border-slate-300"}`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-5 h-5 rounded flex items-center justify-center border text-white ${isAdded ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white"}`}>
                                {isAdded && <Check className="w-4 h-4 stroke-[3]" />}
                              </div>
                              <div>
                                <span className="text-xs font-semibold text-slate-800 block">{addon.name}</span>
                                <span className="text-[11px] text-slate-400">{addon.badge}</span>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-slate-900">${addon.price}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : checkoutStep === "shipping" ? (
                /* STEP 2: SHIPPING & PAYMENT FORM */
                <form onSubmit={handleCheckoutSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                  <span className="text-xs uppercase font-semibold text-slate-400 tracking-wide block">Shipping &amp; Payment</span>

                  <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1 uppercase">Full Name</label>
                      <input
                        required
                        type="text"
                        value={shippingForm.name}
                        onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                        placeholder="John Doe"
                        className="bg-white border border-slate-300 text-sm rounded-lg block w-full p-2.5 focus:border-blue-600 outline-none text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1 uppercase">Email Address</label>
                      <input
                        required
                        type="email"
                        value={shippingForm.email}
                        onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                        placeholder="username@gmail.com"
                        className="bg-white border border-slate-300 text-sm rounded-lg block w-full p-2.5 focus:border-blue-600 outline-none text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1 uppercase">Shipping Address</label>
                      <input
                        required
                        type="text"
                        value={shippingForm.address}
                        onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                        placeholder="123 Main Street"
                        className="bg-white border border-slate-300 text-sm rounded-lg block w-full p-2.5 focus:border-blue-600 outline-none text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1 uppercase">Zip / Area Code</label>
                      <input
                        required
                        type="text"
                        value={shippingForm.zip}
                        onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })}
                        placeholder="78701"
                        className="bg-white border border-slate-300 text-sm rounded-lg block w-full p-2.5 focus:border-blue-600 outline-none text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1 uppercase">Test Payment Card Number</label>
                      <input
                        required
                        type="text"
                        value={shippingForm.card}
                        onChange={(e) => setShippingForm({ ...shippingForm, card: e.target.value })}
                        className="bg-white border border-slate-300 text-sm rounded-lg block w-full p-2.5 focus:border-blue-600 outline-none text-slate-800 font-mono"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">Sandboxed SSL checkout — no real payment is processed</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 text-white py-3.5 font-semibold text-center rounded-lg hover:bg-slate-800 transition-colors text-sm"
                  >
                    Submit Secure Checkout Payment (${grandTotal.toFixed(2)})
                  </button>
                </form>
              ) : (
                /* SUCCESS DIALOG STAGE */
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-emerald-500" />
                  <div>
                    <span className="text-2xl font-bold text-slate-900 block">Order Placed Successfully</span>
                    <p className="text-slate-600 text-xs mt-2">Congratulations <b>{shippingForm.name}</b>, your smart cooler setup is reserved and heading to <b>{shippingForm.address}</b>.</p>
                    <p className="text-slate-400 text-xs mt-2">Tracking codes have been sent to <b>{shippingForm.email}</b>. Preparation begins within the next 24 hours.</p>
                  </div>

                  <button
                    onClick={resetCart}
                    className="bg-slate-900 text-white font-semibold text-xs px-6 py-3 rounded-lg transition-colors"
                  >
                    Continue Exploring
                  </button>
                </div>
              )}

              {/* Pricing summary footer */}
              {cart.length > 0 && checkoutStep !== "success" && (
                <div className="border-t border-slate-200 bg-slate-50 p-6 space-y-4">

                  {/* Promo Code */}
                  {!promoApplied ? (
                    <div className="flex gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="Enter Promo Code (VENDSOURCE10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="border border-slate-300 bg-white rounded-lg px-3 py-2 w-full focus:border-blue-600 outline-none text-slate-800 font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="bg-slate-900 text-white font-semibold px-4 rounded-lg uppercase"
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex justify-between items-center text-xs text-emerald-800">
                      <span className="font-semibold">Promo code applied</span>
                      <span>-10% (-${promoDiscount.toFixed(2)})</span>
                    </div>
                  )}

                  {promoError && <p className="text-red-500 text-xs">{promoError}</p>}

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between"><span>Subtotal:</span><span className="font-semibold text-slate-800">${itemsSubtotal.toFixed(2)}</span></div>
                    {addonsSubtotal > 0 && <div className="flex justify-between"><span>Selected Accessories:</span><span className="font-semibold text-slate-800">${addonsSubtotal.toFixed(2)}</span></div>}
                    {promoApplied && <div className="flex justify-between text-emerald-600 font-medium"><span>Promo Discount (VENDSOURCE10):</span><span>-${promoDiscount.toFixed(2)}</span></div>}
                    <div className="flex justify-between text-base font-bold text-slate-900 border-t pt-2 mt-2">
                      <span>Total:</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {checkoutStep === "cart" && (
                    <button
                      onClick={() => setCheckoutStep("shipping")}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-lg text-xs uppercase tracking-wide transition-colors text-center block"
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
  );
}
