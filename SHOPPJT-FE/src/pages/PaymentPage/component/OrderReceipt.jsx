import React from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";

// MUI
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const OrderReceipt = ({ cartList, totalPrice }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <ReceiptContainer>
      <ReceiptTitle variant="h2">주문 내역</ReceiptTitle>

      <ReceiptList>
        {cartList.length > 0 &&
          cartList.map((item, index) => (
            <li key={index}>
              <RowBetween>
                <ProductWrap>
                  <p>{item.productId.name}</p>
                  <p>X {item.qty}</p>
                </ProductWrap>

                <PriceWrap>₩ {currencyFormat(item.productId.price * item.qty)}</PriceWrap>
              </RowBetween>
            </li>
          ))}
      </ReceiptList>

      <TotalRow>
        <div>
          <strong>Total:</strong>
        </div>
        <div>
          <strong>₩ {currencyFormat(totalPrice)}</strong>
        </div>
      </TotalRow>

      {location.pathname.includes("/cart") && cartList.length > 0 && (
        <OrderButton variant="contained" onClick={() => navigate("/payment")}>
          결제 계속하기
        </OrderButton>
      )}

      <NoticeText>
        가능한 결제 수단 귀하가 결제 단계에 도달할 때까지 가격 및 배송료는 확인되지 않습니다.
        <div>
          30일의 반품 가능 기간, 반품 수수료 및 미수취시 발생하는 추가 배송 요금 읽어보기 반품 및
          환불
        </div>
      </NoticeText>
    </ReceiptContainer>
  );
};

export default OrderReceipt;

// 스타일드 컴포넌트
const ReceiptContainer = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  padding: "32px 24px",
  borderRadius: 16,
  background: theme.palette.background.paper,
}));

const ReceiptTitle = styled(Typography)(() => ({
  marginBottom: 20,
  fontWeight: 800,
}));

const ReceiptList = styled("ul")(({ theme }) => ({
  listStyleType: "none",
  padding: 0,
  margin: 0,
  borderBottom: `1px solid ${theme.palette.text.primary}`,

  "& li": {
    paddingBottom: 10,
  },
}));

const RowBetween = styled("div")(() => ({
  display: "flex",
  // justifyContent: "space-between",
  alignItems: "center",
}));

const ProductWrap = styled("div")(() => ({
  width: "calc(100% - 120px - 16px)",
  display: "flex",
  // flexWrap: "wrap",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  "& p:first-of-type": {
    fontWeight: 600,
    wordBreak: "break-all",
    width: "calc(100% - 30px)",
  },

  "& p": {
    margin: "0 !important",
    width: "30px",
  },
}));

const PriceWrap = styled("div")(() => ({
  width: "120px",
  marginLeft: "16px",
}));

const TotalRow = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 20,
  marginBottom: 20,
}));

const NoticeText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  lineHeight: "160%",
}));

const OrderButton = styled(Button)(() => ({
  marginBottom: "20px",
  width: "100%",
}));
