import React from "react";
import PrivateRouter from "./PrivateRouter";
import { Route, Routes } from "react-router-dom";
import SignUpPage from "../pages/SignUpPage/SignUpPage";

const AppRouter = () => {
  return (
    // <Routes>
    //   <Route path="/" element={<ProductAll />} />
    //   <Route path="/login" element={<Login />} />
    //   <Route path="/register" element={<SignUpPage />} />
    //   <Route path="/product/:id" element={<ProductDetail />} />
    //   <Route element={<PrivateRouter permissionLevel="customer" />}>
    //     <Route path="/cart" element={<CartPage />} />
    //     <Route path="/payment" element={<PaymentPage />} />
    //     <Route path="/payment/success" element={<OrderCompletePage />} />
    //     <Route path="/account/purchase" element={<MyPage />} />
    //   </Route>
    //   <Route element={<PrivateRouter permissionLevel="admin" />}>
    //     <Route path="/admin/product" element={<AdminProduct />} />
    //     <Route path="/admin/order" element={<AdminOrderPage />} />
    //   </Route>
    // </Routes>
    <Routes>
      <Route path="/" />
      <Route path="/register" element={<SignUpPage />} />
    </Routes>
  );
};

export default AppRouter;
