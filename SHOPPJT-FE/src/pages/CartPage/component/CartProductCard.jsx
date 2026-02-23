import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { currencyFormat } from "../../../utils/number";
import { updateQty, deleteCartItem } from "../../../features/cart/cartSlice";

// MUI
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const CartProductCard = ({ item }) => {
  const dispatch = useDispatch();

  const handleQtyChange = (id, value) => {
    dispatch(updateQty({ id, value }));
  };

  const deleteCart = (id) => {
    dispatch(deleteCartItem(id));
  };

  // 삭제 버튼 클릭시 한 번 더 물어보기
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const openConfirmDelete = () => {
    setOpenDeleteDialog(true);
  };

  const closeConfirmDelete = () => {
    setOpenDeleteDialog(false);
  };

  const confirmDelete = () => {
    deleteCart(item._id);
    setOpenDeleteDialog(false);
  };

  return (
    <CardWrap>
      <CardInner>
        <ImageWrap>
          <Thumb src={item.productId.image} alt="product" />
        </ImageWrap>

        <InfoWrap>
          <HeaderRow>
            <Typography variant="h2">{item.productId.name}</Typography>

            <TrashButton onClick={openConfirmDelete} aria-label="delete">
              <DeleteOutlineIcon />
            </TrashButton>
          </HeaderRow>

          <Line>
            <PriceText component="span">₩ {currencyFormat(item.productId.price)}</PriceText>
          </Line>

          <Line>Size: {item.size}</Line>
          <Line>Total: ₩ {currencyFormat(item.productId.price * item.qty)}</Line>

          <QtyRow>
            <QtyLabel component="span">Quantity:</QtyLabel>

            <QtySelectWrap>
              <FormControl fullWidth>
                <Select
                  onChange={(event) => handleQtyChange(item._id, event.target.value)}
                  required
                  defaultValue={item.qty}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={6}>6</MenuItem>
                  <MenuItem value={7}>7</MenuItem>
                  <MenuItem value={8}>8</MenuItem>
                  <MenuItem value={9}>9</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                </Select>
              </FormControl>
            </QtySelectWrap>
          </QtyRow>
        </InfoWrap>
      </CardInner>

      <ConfirmDialog open={openDeleteDialog} onClose={closeConfirmDelete}>
        <DialogTitle>삭제할까요?</DialogTitle>
        <DialogContent>
          <DialogText>"{item.productId.name}" 상품을 카트에서 삭제합니다.</DialogText>
        </DialogContent>
        <DialogActions>
          <CancelButton variant="outlined" onClick={closeConfirmDelete}>
            취소
          </CancelButton>
          <DeleteButton variant="contained" color="error" onClick={confirmDelete}>
            삭제
          </DeleteButton>
        </DialogActions>
      </ConfirmDialog>
    </CardWrap>
  );
};

export default CartProductCard;

// 스타일드 컴포넌트
const CardWrap = styled(Box)(({ theme }) => ({
  marginBottom: "10px",
  padding: "10px",
  borderRadius: "16px",
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
}));

const CardInner = styled("div")(({ theme }) => ({
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

const ImageWrap = styled("div")(({ theme }) => ({
  width: "calc(30% - 30px)",

  [theme.breakpoints.down("md")]: {
    width: "calc(30% - 20px)",
  },

  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const InfoWrap = styled("div")(({ theme }) => ({
  width: "70%",

  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const Thumb = styled("img")(({ theme }) => ({
  width: "100%",
  height: "auto",
  display: "block",
  borderRadius: "12px",
  border: `1px solid ${theme.palette.divider}`,
}));

const HeaderRow = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
}));

const TrashButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "10px",
  width: "40px",
  height: "40px",
}));

const Line = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(0.75),
  color: theme.palette.text.primary,
}));

const PriceText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

const QtyRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(1),
  flexWrap: "wrap",
}));

const QtyLabel = styled(Typography)(() => ({
  fontWeight: 600,
}));

const QtySelectWrap = styled("div")(() => ({
  width: "100%",
  maxWidth: 400,
}));

const ConfirmDialog = styled(Dialog)(() => ({
  "& .MuiPaper-root": {
    borderRadius: "16px",
  },
}));

const DialogText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const CancelButton = styled(Button)(() => ({
  borderRadius: "12px",
  fontWeight: 700,
}));

const DeleteButton = styled(Button)(() => ({
  borderRadius: "12px",
  fontWeight: 700,
}));
