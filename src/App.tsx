import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import QuotePopup from "./components/QuotePopup";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductPage from "./pages/ProductPage";
import Faq from "./pages/Faq";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <CartProvider>
      <div className="bg-white text-slate-900 min-h-screen font-sans relative selection:bg-blue-600 selection:text-white">
        <ScrollToTop />
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ProductPage />} />
          <Route path="/faq" element={<Faq />} />
        </Routes>

        <Footer />
        <CartDrawer />
        <QuotePopup />
      </div>
    </CartProvider>
  );
}
