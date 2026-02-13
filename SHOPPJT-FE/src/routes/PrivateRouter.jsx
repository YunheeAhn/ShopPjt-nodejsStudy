import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouter = ({ permissionLevel }) => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const isAuthenticated = user && (user.level === permissionLevel || user.level === "admin");

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRouter;
