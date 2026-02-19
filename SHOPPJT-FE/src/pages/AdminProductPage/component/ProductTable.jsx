import React from "react";
import { styled } from "@mui/material/styles";

import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

import { currencyFormat } from "../../../utils/number";

const ProductTable = ({ header, data, deleteItem, openEditForm }) => {
  const getStatusClassName = (status) => String(status || "").toLowerCase();

  return (
    <TableWrap>
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {header.map((title, index) => (
                <HeaderCell key={index}>{title}</HeaderCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={index} hover>
                  <BodyCell>{index}</BodyCell>
                  <BodyCell>{item.sku}</BodyCell>
                  <NameCell>{item.name}</NameCell>
                  <BodyCell>{currencyFormat(item.price)}</BodyCell>

                  <BodyCell>
                    {Object.keys(item.stock).map((size, idx) => (
                      <StockLine key={idx}>
                        {size}:{item.stock[size]}
                      </StockLine>
                    ))}
                  </BodyCell>

                  <BodyCell>
                    <ProductImage src={item.image} alt="image" />
                  </BodyCell>

                  <BodyCell>
                    <StatusChip
                      label={item.status}
                      className={getStatusClassName(item.status)}
                      size="small"
                    />
                  </BodyCell>

                  <ActionCell>
                    <ActionButtons>
                      <DangerButton
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => deleteItem(item._id)}
                      >
                        -
                      </DangerButton>

                      <EditButton
                        size="small"
                        variant="contained"
                        onClick={() => openEditForm(item)}
                      >
                        Edit
                      </EditButton>
                    </ActionButtons>
                  </ActionCell>
                </TableRow>
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

export default ProductTable;

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

const NameCell = styled(BodyCell)(() => ({
  minWidth: 100,
}));

const ActionCell = styled(BodyCell)(() => ({
  minWidth: 100,
}));

const StockLine = styled("div")(() => ({
  display: "block",
}));

const ProductImage = styled("img")(({ theme }) => ({
  display: "block",
  width: 100,
  height: "auto",
  borderRadius: 10,
  border: `1px solid ${theme.palette.divider}`,
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "center",
}));

const DangerButton = styled(Button)(({ theme }) => ({
  borderRadius: 10,
  fontWeight: 800,
  minWidth: 36,
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

const EditButton = styled(Button)(() => ({
  borderRadius: 10,
  fontWeight: 700,
}));

const EmptyRowCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 800,
  borderRadius: 999,
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,

  /* 자주 쓰는 케이스들 */
  "&.active": {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.getContrastText(theme.palette.success.main),
    borderColor: theme.palette.success.main,
  },
  "&.inactive": {
    backgroundColor: theme.palette.grey[400],
    color: theme.palette.getContrastText(theme.palette.grey[400]),
    borderColor: theme.palette.grey[400],
  },
  "&.disabled": {
    backgroundColor: theme.palette.grey[500],
    color: theme.palette.getContrastText(theme.palette.grey[500]),
    borderColor: theme.palette.grey[500],
  },
  "&.archived": {
    backgroundColor: theme.palette.grey[700],
    color: theme.palette.getContrastText(theme.palette.grey[700]),
    borderColor: theme.palette.grey[700],
  },
  "&.soldout": {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.getContrastText(theme.palette.warning.main),
    borderColor: theme.palette.warning.main,
  },
  "&.outofstock": {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.getContrastText(theme.palette.warning.main),
    borderColor: theme.palette.warning.main,
  },
  "&.deleted": {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.getContrastText(theme.palette.error.main),
    borderColor: theme.palette.error.main,
  },
}));
