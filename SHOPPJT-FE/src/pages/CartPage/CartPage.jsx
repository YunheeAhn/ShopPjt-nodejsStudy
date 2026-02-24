// CartPage.jsx
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartProductCard from "./component/CartProductCard";
import OrderReceipt from "../PaymentPage/component/OrderReceipt";
import { getCartList } from "../../features/cart/cartSlice";

// MUI
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartList, totalPrice } = useSelector((state) => state.cart);

  useEffect(() => {
    //카트리스트 불러오기
    dispatch(getCartList());
  }, []);

  return (
    <PageWrap>
      <Container maxWidth={false}>
        <CartPageInner>
          <ItemWrap>
            {cartList.length > 0 ? (
              cartList.map((item) => <CartProductCard item={item} key={item._id} />)
            ) : (
              <EmptyBag>
                <Typography variant="h2">카트가 비어있습니다.</Typography>
                <EmptyDesc>상품을 담아주세요!</EmptyDesc>
              </EmptyBag>
            )}
          </ItemWrap>

          <OrderWrap>
            <ReceiptArea>
              <OrderReceipt cartList={cartList} totalPrice={totalPrice} />
            </ReceiptArea>
          </OrderWrap>
        </CartPageInner>
      </Container>
    </PageWrap>
  );
};

export default CartPage;

// 스타일드 컴포넌트
const PageWrap = styled(Box)(() => ({
  width: "100%",
  padding: "0 !important",
}));

const CartPageInner = styled("div")(({ theme }) => ({
  width: "100%",
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

const ItemWrap = styled("div")(({ theme }) => ({
  width: "calc(70% - 30px)",

  [theme.breakpoints.down("md")]: {
    width: "calc(70% - 20px)",
  },

  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const OrderWrap = styled("div")(({ theme }) => ({
  width: "30%",

  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const EmptyBag = styled(Box)(({ theme }) => ({
  textAlign: "center",
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2.5),
  borderRadius: 16,
  border: `1px solid ${theme.palette.divider}`,
}));

const EmptyDesc = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const ReceiptArea = styled(Box)(() => ({
  width: "100%",
}));
