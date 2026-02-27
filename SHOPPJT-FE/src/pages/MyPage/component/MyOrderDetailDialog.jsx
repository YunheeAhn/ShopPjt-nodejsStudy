import React from "react";
import { styled } from "@mui/material/styles";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

import { currencyFormat } from "../../../utils/number";

const MyOrderDetailDialog = ({ open, handleClose, order }) => {
  if (!order) return null;

  return (
    <StyledDialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>주문 상세</DialogTitle>

      <DialogContent dividers>
        <Section>
          <Line>
            <Muted>주문번호:</Muted> {order.orderNum}
          </Line>
          <Line>
            <Muted>주문날짜:</Muted> {order.createdAt?.slice?.(0, 10)}
          </Line>
          <Line>
            <Muted>주문상태:</Muted> {order.status}
          </Line>
          <Line>
            <Muted>주소:</Muted> {(order.shipTo?.address || "") + " " + (order.shipTo?.city || "")}
          </Line>
          <Line>
            <Muted>연락처:</Muted>{" "}
            {`${(order.contact?.firstName || "") + (order.contact?.lastName || "")} ${
              order.contact?.contact || ""
            }`}
          </Line>
        </Section>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          주문내역
        </Typography>

        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "none" }}>
          <Table>
            <TableHead>
              <TableRow>
                <HeaderCell>상품</HeaderCell>
                <HeaderCell>단가</HeaderCell>
                <HeaderCell>수량</HeaderCell>
                <HeaderCell>금액</HeaderCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(order.items || []).map((it, idx) => {
                const name = it.productId?.name || "상품 정보 없음";
                const unit = it.price ?? 0;
                const qty = it.qty ?? 0;
                return (
                  <TableRow key={it._id || idx}>
                    <BodyCell>{name}</BodyCell>
                    <BodyCell>{currencyFormat(unit)}</BodyCell>
                    <BodyCell>{qty}</BodyCell>
                    <BodyCell>{currencyFormat(unit * qty)}</BodyCell>
                  </TableRow>
                );
              })}

              <TableRow>
                <TotalCell colSpan={3}>총계</TotalCell>
                <TotalCell>{currencyFormat(order.totalPrice || 0)}</TotalCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant="contained" onClick={handleClose}>
          닫기
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default MyOrderDetailDialog;

// styles
const StyledDialog = styled(Dialog)(() => ({
  "& .MuiPaper-root": { borderRadius: 18 },
}));

const Section = styled(Box)(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(1),
}));

const Line = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const Muted = styled("span")(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 700,
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 800,
  background: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.divider}`,
  whiteSpace: "nowrap",
}));

const BodyCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  whiteSpace: "nowrap",
}));

const TotalCell = styled(TableCell)(() => ({
  fontWeight: 900,
  borderBottom: "none",
}));
