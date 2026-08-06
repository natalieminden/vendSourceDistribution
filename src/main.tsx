import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* basename follows the Vite base, so routes resolve both at the domain root
        (Firebase) and under /<repo>/ on GitHub Pages. Without it, every path on a
        project site falls through to no route at all. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
