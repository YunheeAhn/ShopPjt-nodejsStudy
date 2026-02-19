import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

const OrderTable = ({ header, data, openEditForm }) => {
  return (
    <TableWrap>
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {header.map((title, idx) => (
                <HeaderCell key={`${title}-${idx}`}>{title}</HeaderCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <ClickRow
                  key={item._id || `${item.orderNum}-${index}`}
                  onClick={() => openEditForm(item)}
                >
                  <BodyCell>{index}</BodyCell>
                  <BodyCell>{item.orderNum}</BodyCell>
                  <BodyCell>{item.createdAt?.slice?.(0, 10)}</BodyCell>
                  <BodyCell>{item.userId?.email}</BodyCell>

                  {item.items?.length > 0 ? (
                    <BodyCell>
                      {item.items[0]?.productId?.name}
                      {item.items.length > 1 && `외 ${item.items.length - 1}개`}
                    </BodyCell>
                  ) : (
                    <BodyCell />
                  )}

                  <BodyCell>
                    {(item.shipTo?.address || "") + " " + (item.shipTo?.city || "")}
                  </BodyCell>

                  <BodyCell>{currencyFormat(item.totalPrice)}</BodyCell>

                  <BodyCell>
                    <StatusChip label={item.status} className={item.status} />
                  </BodyCell>
                </ClickRow>
              ))
            ) : (
              <TableRow>
                <EmptyRowCell colSpan={header.length}>
                  <Typography variant="body2">No Data to show</Typography>
                </EmptyRowCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </TableWrap>
  );
};

export default OrderTable;

// 스타일드컴포넌트

const TableWrap = styled("div")(() => ({
  width: "100%",
  overflowX: "auto",
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 700,
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.divider}`,
  whiteSpace: "nowrap",
}));

const BodyCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  whiteSpace: "nowrap",
}));

const ClickRow = styled(TableRow)(({ theme }) => ({
  cursor: "pointer",
  transition: "background-color 0.15s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 700,
  borderRadius: 999,
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,

  /* status 별 색상 매핑 */
  "&.pending": {
    backgroundColor: badgeBg.pending,
  },
  "&.paid": {
    backgroundColor: badgeBg.paid,
  },
  "&.shipping": {
    backgroundColor: badgeBg.shipping,
  },
  "&.delivered": {
    backgroundColor: badgeBg.delivered,
  },
  "&.cancelled": {
    backgroundColor: badgeBg.cancelled,
  },
}));

const EmptyRowCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
