import React from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

// MUI
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

const OrderCompletePage = () => {
  const { orderNum } = useSelector((state) => state.order);

  if (orderNum === "")
    return (
      <PageWrap>
        <Content>
          <Title variant="h1">주문 실패</Title>

          <Desc>
            메인페이지로 돌아가세요
            <LinkButton component={RouterLink} to="/" variant="contained">
              메인페이지로 돌아가기
            </LinkButton>
          </Desc>
        </Content>
      </PageWrap>
    );

  return (
    <PageWrap>
      <Content>
        <CheckIconWrap>
          <CheckCircleRoundedIcon />
        </CheckIconWrap>

        <Title variant="h2">예약이 완료됬습니다!</Title>
        <InfoText>예약번호:하드코딩</InfoText>

        <Desc>
          예약 확인은 내 예약 메뉴에서 확인해주세요
          <CenterLinkArea>
            <LinkButton component={RouterLink} to="/account/purchase" variant="outlined">
              내 예약 바로가기
            </LinkButton>
          </CenterLinkArea>
        </Desc>
      </Content>
    </PageWrap>
  );
};

export default OrderCompletePage;

// 스타일드 컴포넌트
const PageWrap = styled(Container)(({ theme }) => ({
  maxWidth: "100%",
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));

const Content = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 680,
  margin: "0 auto",
  borderRadius: 18,
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
  padding: theme.spacing(4),
  textAlign: "center",
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  marginTop: theme.spacing(1),
}));

const Desc = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1.5),
  color: theme.palette.text.secondary,
}));

const InfoText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

const CenterLinkArea = styled("div")(() => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
}));

const LinkButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  fontWeight: 800,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));

const CheckIconWrap = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 88,
  height: 88,
  borderRadius: 999,
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.default,

  "& svg": {
    fontSize: 52,
    color: theme.palette.success.main,
  },
}));
