import React from "react";
import { Route, Routes } from "react-router-dom";

import PrivateRouter from "./PrivateRouter";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import CartPage from "../pages/CartPage/CartPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import OrderCompletePage from "../pages/OrderCompletePage/OrderCompletePage";
import MyPage from "../pages/MyPage/MyPage";
import AdminProductPage from "../pages/AdminProductPage/AdminProductPage";
import AdminOrderPage from "../pages/AdminOrderPage/AdminOrderPage";
import ProductAll from "../pages/LandingPage/LandingPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductAll />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignUpPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route element={<PrivateRouter permissionLevel="customer" />}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/success" element={<OrderCompletePage />} />
        <Route path="/account/purchase" element={<MyPage />} />
      </Route>
      <Route element={<PrivateRouter permissionLevel="admin" />}>
        <Route path="/admin/product" element={<AdminProductPage />} />
        <Route path="/admin/order" element={<AdminOrderPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
