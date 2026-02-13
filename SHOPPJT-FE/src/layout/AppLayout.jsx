// src/layout/AppLayout.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// MUI
import Box from "@mui/material/Box";

// Components
import Sidebar from "../components/common/SideBar";
import Navbar from "../components/common/Navbar";
import ToastMessage from "../components/common/ToastMessage";

// Redux thunks
import { loginWithToken } from "../features/user/userSlice";
import { getCartQty } from "../features/cart/cartSlice";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const isAdminRoute = location.pathname.includes("admin");

  useEffect(() => {
    dispatch(loginWithToken());
  }, [dispatch]);

  useEffect(() => {
    if (user) dispatch(getCartQty());
  }, [user, dispatch]);

  return (
    <Box>
      <ToastMessage />

      {isAdminRoute ? (
        <Box sx={{ display: "flex" }}>
          {/* Left */}
          <Box
            sx={{
              width: { xs: "100%", md: 260 }, // md 이상 사이드바 폭 고정
              flexShrink: 0,
              borderRight: { xs: "none", md: (t) => `1px solid ${t.palette.divider}` },
              bgcolor: "background.paper",
            }}
          >
            <Sidebar />
          </Box>

          {/* Right */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              p: { xs: 2, md: 3 },
            }}
          >
            {children}
          </Box>
        </Box>
      ) : (
        <>
          <Navbar user={user} />
          <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
        </>
      )}
    </Box>
  );
};

export default AppLayout;
