import { BrowserRouter, Route, Routes } from "react-router-dom";

import { routePaths } from "./routePaths";
import { AppLayout } from "../../shared/ui/layout/AppLayout";
import { AdminPage } from "../../pages/AdminPage";
import { CartPage } from "../../pages/CartPage";
import { HomePage } from "../../pages/HomePage";
import { NotFoundPage } from "../../pages/NotFoundPage";
import { OrderDetailsPage } from "../../pages/OrderDetailsPage";
import { ProductDetailsPage } from "../../pages/ProductDetailsPage";
import { SupplierDetailsPage } from "../../pages/SupplierDetailsPage";

export function AppRouter(): JSX.Element {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path={routePaths.home} element={<HomePage />} />
          <Route path={routePaths.productDetails} element={<ProductDetailsPage />} />
          <Route path={routePaths.cart} element={<CartPage />} />
          <Route path={routePaths.admin} element={<AdminPage />} />
          <Route path={routePaths.orderDetails} element={<OrderDetailsPage />} />
          <Route path={routePaths.supplierDetails} element={<SupplierDetailsPage />} />
          <Route path={routePaths.notFound} element={<NotFoundPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}