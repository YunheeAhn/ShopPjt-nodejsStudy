import React from "react";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

const OrderStatusCard = ({ orderItem, onClick }) => {
  const firstItem = orderItem?.items?.[0];
  const product = firstItem?.productId;

  const productName = product?.name || "상품 정보 없음";
  const itemCount = orderItem?.items?.length || 0;

  return (
    <CardOuter onClick={onClick} role="button" tabIndex={0}>
      <ImageCol>
        <ProductImage
          src={product?.image || "/image/default-image.png"}
          alt={productName}
          onError={(e) => {
            e.currentTarget.src = "/image/default-image.png";
          }}
        />
      </ImageCol>
      <InfoCol>
        <PrdName className="prdName">
          {productName}
          {itemCount > 1 && `외 ${itemCount - 1}개`}
        </PrdName>
        <OrderNumber>주문번호 : {orderItem?.orderNum}</OrderNumber>
        <OrderText>{orderItem?.createdAt?.slice?.(0, 10)}</OrderText>

        <TotalCost>₩ {currencyFormat(orderItem?.totalPrice || 0)}</TotalCost>
      </InfoCol>

      <StatusCol>
        <StatusBadge $variant={badgeBg?.[orderItem?.status]} label={orderItem?.status || "-"} />
      </StatusCol>
    </CardOuter>
  );
};

export default OrderStatusCard;

// 스타일드 컴포넌트
const CardOuter = styled("dl")(({ theme }) => ({
  width: "calc((100% - 120px) / 5)",
  padding: "10px",
  boxSizing: "border-box",
  borderRadius: "16px",
  background: theme.palette.background.paper,
  position: "relative",
  transition: "all .3s ease",
  cursor: "pointer",

  "&:hover img": {
    transform: "scale(1.1)",
  },

  "&:hover .prdName": {
    color: theme.palette.primary.main,
  },

  [theme.breakpoints.down("lg")]: {
    width: "calc((100% - 90px) / 4)",
  },

  [theme.breakpoints.down("md")]: {
    width: "calc((100% - 40px) / 3)",
  },

  [theme.breakpoints.down("sm")]: {
    width: "calc((100% - 10px) / 2)",
  },
}));

const ImageCol = styled("dt")(() => ({
  width: "100%",
  overflow: "hidden",
}));

const ProductImage = styled("img")(() => ({
  width: "100%",
  height: "auto",
  objectFit: "cover",
  aspectRatio: "1/1",
  transition: "all .3s ease",
}));

const InfoCol = styled("dd")(() => ({
  margin: 0,
  paddingTop: 16,

  display: "flex",
  flexDirection: "column",
  gap: "5px",
}));

const StatusCol = styled(Box)(() => ({
  padding: "6px",
  borderRadius: "20px",
  position: "absolute",
  top: 0,
  right: 0,
}));

const OrderText = styled("p")(({ theme }) => ({
  fontSize: 14,
  color: theme.palette.text.secondary,
  margin: 0,
}));

const OrderNumber = styled("p")(() => ({
  margin: 0,
}));

const PrdName = styled("p")(({ theme }) => ({
  margin: 0,
  fontSize: "1.125rem",
  color: theme.palette.text.primary,
  fontWeight: 600,
  transition: "all .3s ease",
}));

const TotalCost = styled("p")(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.primary,
  fontWeight: 800,
  textAlign: "right",
}));

const resolveBadgeColor = (theme, variant) => {
  if (!variant) return theme.palette.grey[600];

  // hex/rgb/hsl 등 “색상 값”일 가능성: 그대로 사용
  const looksLikeColor =
    variant.startsWith("#") ||
    variant.startsWith("rgb") ||
    variant.startsWith("hsl") ||
    variant.startsWith("var(");

  if (looksLikeColor) return variant;

  // bootstrap variant → MUI palette
  switch (variant) {
    case "primary":
      return theme.palette.primary.main;
    case "secondary":
      return theme.palette.secondary.main;
    case "success":
      return theme.palette.success.main;
    case "danger":
      return theme.palette.error.main;
    case "warning":
      return theme.palette.warning.main;
    case "info":
      return theme.palette.info.main;
    case "light":
      return theme.palette.grey[200];
    case "dark":
      return theme.palette.grey[800];
    default:
      return theme.palette.grey[600];
  }
};

const StatusBadge = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "$variant",
})(({ theme, $variant }) => ({
  height: 28,
  fontWeight: 700,
  borderRadius: 999,
  color: theme.palette.common.white,
  backgroundColor: resolveBadgeColor(theme, $variant),

  "& .MuiChip-label": {
    paddingLeft: 10,
    paddingRight: 10,
  },
}));
