// src/layout/AppLayout.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// MUI
import { styled } from "@mui/material/styles";
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
    <Root>
      <ToastMessage />

      {isAdminRoute ? (
        <AdminLayout>
          <AdminSidebarWrap>
            <Sidebar />
          </AdminSidebarWrap>

          <AdminContent>{children}</AdminContent>
        </AdminLayout>
      ) : (
        <>
          <Navbar user={user} />
          <DefaultContent>{children}</DefaultContent>
        </>
      )}
    </Root>
  );
};

export default AppLayout;

const SIDEBAR_WIDTH = 260;

// 스타일드 컴포넌트
const Root = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
}));

const AdminLayout = styled(Box)(() => ({
  display: "flex",
  minHeight: "100vh",
}));

const AdminSidebarWrap = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100vh",
  flexShrink: 0,
  backgroundColor: theme.palette.background.paper,

  // md 이상에서만 고정 폭 + 우측 보더
  [theme.breakpoints.up("md")]: {
    width: SIDEBAR_WIDTH,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const AdminContent = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  padding: theme.spacing(2),

  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(3),
  },
}));

const DefaultContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),

  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(3),
  },
}));
