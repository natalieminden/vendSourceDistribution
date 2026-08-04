import { Routes, Route } from "react-router-dom";
import { RepAuthProvider } from "../../context/RepAuthContext";
import PortalLayout from "../../components/portal/PortalLayout";
import PortalLogin from "./Login";
import PortalDashboard from "./Dashboard";
import PortalMyLink from "./MyLink";
import PortalOrders from "./Orders";
import PortalCommissions from "./Commissions";

/**
 * The entire portal subtree, lazily loaded from App.
 *
 * Keeping the Supabase client and QR library in here means storefront visitors
 * never download them — the portal is a few reps, the storefront is everyone.
 */
export default function PortalRoutes() {
  return (
    <RepAuthProvider>
      <Routes>
        <Route path="login" element={<PortalLogin />} />
        <Route
          index
          element={
            <PortalLayout>
              <PortalDashboard />
            </PortalLayout>
          }
        />
        <Route
          path="link"
          element={
            <PortalLayout>
              <PortalMyLink />
            </PortalLayout>
          }
        />
        <Route
          path="orders"
          element={
            <PortalLayout>
              <PortalOrders />
            </PortalLayout>
          }
        />
        <Route
          path="commissions"
          element={
            <PortalLayout>
              <PortalCommissions />
            </PortalLayout>
          }
        />
      </Routes>
    </RepAuthProvider>
  );
}
