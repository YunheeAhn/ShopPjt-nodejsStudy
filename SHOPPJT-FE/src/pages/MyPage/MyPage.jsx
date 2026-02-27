// MyPage.jsx

import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderStatusCard from "./component/OrderStatusCard";
import { getMyOrders } from "../../features/order/orderSlice";
import MyOrderDetailDialog from "./component/MyOrderDetailDialog";

// mui
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const MyPage = () => {
  const dispatch = useDispatch();
  const { orderList } = useSelector((state) => state.order);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  console.log(orderList);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  const openDetail = (order) => {
    setSelected(order);
    setOpen(true);
  };

  const closeDetail = () => {
    setOpen(false);
    setSelected(null);
  };

  if (!orderList || orderList.length === 0) {
    return (
      <EmptyContainer>
        <EmptyText>진행중인 주문이 없습니다.</EmptyText>
      </EmptyContainer>
    );
  }

  return (
    <>
      <CardWrap>
        {orderList.map((item) => (
          <OrderStatusCard key={item._id} orderItem={item} onClick={() => openDetail(item)} />
        ))}
      </CardWrap>

      <MyOrderDetailDialog open={open} handleClose={closeDetail} order={selected} />
    </>
  );
};

export default MyPage;

// 스타일드 컴포넌트

const CardWrap = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: "30px",

  [theme.breakpoints.down("md")]: {
    gap: "20px",
  },

  [theme.breakpoints.down("sm")]: {
    gap: "10px",
  },
}));

const EmptyContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  textAlign: "center",
  padding: 20,
}));

const EmptyText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
}));
