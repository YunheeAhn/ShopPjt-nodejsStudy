import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { ORDER_STATUS } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";
import { updateOrder } from "../../../features/order/orderSlice";

const OrderDetailDialog = ({ open, handleClose }) => {
  const selectedOrder = useSelector((state) => state.order.selectedOrder);
  const dispatch = useDispatch();

  const [orderStatus, setOrderStatus] = useState(selectedOrder?.status || "");

  useEffect(() => {
    setOrderStatus(selectedOrder?.status || "");
  }, [selectedOrder]);

  const handleStatusChange = (event) => {
    setOrderStatus(event.target.value);
  };

  const submitStatus = (event) => {
    event.preventDefault();
    dispatch(updateOrder({ id: selectedOrder._id, status: orderStatus }));
    handleClose();
  };

  if (!selectedOrder) return <></>;

  return (
    <StyledDialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Order Detail</DialogTitle>

      <DialogContent dividers>
        <Section>
          <Line>
            <Muted>예약번호:</Muted> {selectedOrder.orderNum}
          </Line>
          <Line>
            <Muted>주문날짜:</Muted> {selectedOrder.createdAt?.slice?.(0, 10)}
          </Line>
          <Line>
            <Muted>이메일:</Muted> {selectedOrder.userId?.email}
          </Line>
          <Line>
            <Muted>주소:</Muted>{" "}
            {(selectedOrder.shipTo?.address || "") + " " + (selectedOrder.shipTo?.city || "")}
          </Line>
          <Line>
            <Muted>연락처:</Muted>{" "}
            {`${(selectedOrder.contact?.firstName || "") + (selectedOrder.contact?.lastName || "")} ${
              selectedOrder.contact?.contact || ""
            }`}
          </Line>
        </Section>

        <Typography variant="subtitle1">주문내역</Typography>

        <TableWrap>
          <StyledTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <HeaderCell>ID</HeaderCell>
                  <HeaderCell>Name</HeaderCell>
                  <HeaderCell>Unit Price</HeaderCell>
                  <HeaderCell>Qty</HeaderCell>
                  <HeaderCell>Price</HeaderCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {selectedOrder.items?.length > 0 &&
                  selectedOrder.items.map((item) => (
                    <TableRow key={item._id}>
                      <BodyCell>{item._id}</BodyCell>
                      <BodyCell>{item.productId?.name}</BodyCell>
                      <BodyCell>{currencyFormat(item.price)}</BodyCell>
                      <BodyCell>{item.qty}</BodyCell>
                      <BodyCell>{currencyFormat(item.price * item.qty)}</BodyCell>
                    </TableRow>
                  ))}

                <TableRow>
                  <TotalRowCell colSpan={4}>총계:</TotalRowCell>
                  <TotalRowCell>{currencyFormat(selectedOrder.totalPrice)}</TotalRowCell>
                </TableRow>
              </TableBody>
            </Table>
          </StyledTableContainer>
        </TableWrap>

        <Box component="form" onSubmit={submitStatus}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={orderStatus}
              label="Status"
              onChange={handleStatusChange}
            >
              {ORDER_STATUS.map((item, idx) => (
                <MenuItem key={idx} value={item.toLowerCase()}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ActionRow>
            <LightButton variant="contained" onClick={handleClose}>
              닫기
            </LightButton>
            <Button type="submit" variant="contained">
              저장
            </Button>
          </ActionRow>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
};

export default OrderDetailDialog;

// 스타일드컴포넌트
const StyledDialog = styled(Dialog)(() => ({
  "& .MuiPaper-root": {
    borderRadius: 18,
  },
}));

const Section = styled(Box)(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const Line = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const Muted = styled("span")(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 600,
}));

const TableWrap = styled("div")(() => ({
  width: "100%",
  overflowX: "auto",
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 14,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 700,
  background: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.divider}`,
  whiteSpace: "nowrap",
}));

const BodyCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  whiteSpace: "nowrap",
}));

const TotalRowCell = styled(TableCell)(() => ({
  fontWeight: 800,
  borderBottom: "none",
}));

const ActionRow = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
  gap: theme.spacing(1),
}));

const LightButton = styled(Button)(({ theme }) => ({
  // background: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
}));
