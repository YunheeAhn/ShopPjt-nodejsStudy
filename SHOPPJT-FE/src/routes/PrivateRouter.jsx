import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRouter = ({ permissionLevel }) => {
  const token = sessionStorage.getItem("token");
  const user = useSelector((state) => state.user.user);

  const isAuthenticated =
    token && user && (user.level === permissionLevel || user.level === "admin");

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRouter;
