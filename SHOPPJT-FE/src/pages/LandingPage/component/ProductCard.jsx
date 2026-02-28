import React from "react";
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";

// MUI
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { CATEGORY } from "../../../constants/product.constants";
import { useMemo } from "react";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();

  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const normalizeCategory = (v) =>
    String(v ?? "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/-/g, "");

  const categoryLabel = useMemo(() => {
    const firstCategory = (item?.category || []).find((x) => typeof x === "string") || "";

    const match = CATEGORY.find(
      (c) => normalizeCategory(c.value) === normalizeCategory(firstCategory),
    );

    return match?.label || "ALL";
  }, [item]);

  return (
    <CardWrap>
      <CardActionArea onClick={() => showProduct(item._id)}>
        <Media component="img" image={item?.image} alt={item?.image} />
        <Content>
          <CategoryText>{categoryLabel}</CategoryText>
          <ProductName variant="body1" className="prdName">
            {item?.name}
          </ProductName>
          <ProductPrice variant="body1">₩ {currencyFormat(item?.price)}</ProductPrice>
        </Content>
      </CardActionArea>
    </CardWrap>
  );
};

export default ProductCard;

// 스타일드컴포넌트
const CardWrap = styled(Card)(({ theme }) => ({
  border: "none",
  boxShadow: "none",
  backgroundColor: "transparent",

  transition: "all .3s ease",

  "&:hover .prdName": {
    color: theme.palette.primary.main,
  },
}));

const Media = styled(CardMedia)(({ theme }) => ({
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,

  aspectRatio: "1 / 1",
  width: "100%",
  objectFit: "cover",
  display: "block",

  overFlow: "hidden",

  transition: "all .3s ease",

  "&:hover": {
    transform: "scale(1.1)",
    zIndex: 1,
  },
}));

const Content = styled(CardContent)(() => ({
  paddingLeft: 0,
  paddingRight: 0,
  paddingBottom: 0,
  "&:last-child": {
    paddingBottom: 0,
  },
}));

const ProductName = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontWeight: 600,
  color: theme.palette.text.primary,
  lineHeight: 1.3,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  transition: "all .3s ease",
}));

const ProductPrice = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  fontWeight: 600,
}));

const CategoryText = styled("div")(({ theme }) => ({
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: theme.palette.background.paper,
  background: theme.palette.primary.main,
  borderRadius: "60px",
  padding: "6px 12px",
  boxSizing: "border-box",
  width: "auto",
  position: "absolute",
  top: 10,
  left: 10,
}));
