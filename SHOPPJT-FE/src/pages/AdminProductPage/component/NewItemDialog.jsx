import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import CloudinaryUploadWidget from "../../../utils/CloudinaryUploadWidget";
import { CATEGORY, STATUS, SIZE } from "../../../constants/product.constants";
import {
  clearError,
  createProduct,
  editProduct,
  clearSuccess,
} from "../../../features/product/productSlice";

/** 초기값 */
const InitialFormData = {
  name: "",
  sku: "",
  stock: {},
  image: "",
  description: "",
  category: [],
  status: "active",
  price: "",
};

const NewItemDialog = ({ mode, showDialog, setShowDialog }) => {
  const { error, success, selectedProduct } = useSelector((state) => state.product);

  const [formData, setFormData] = useState(
    mode === "new" ? { ...InitialFormData } : selectedProduct,
  );
  const [stock, setStock] = useState([]);
  const [stockError, setStockError] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (success) {
      setShowDialog(false);
      dispatch(clearSuccess());
    }
  }, [success, setShowDialog, dispatch]);

  // ✅ 다이얼로그 열릴 때 초기화 로직(에러/성공 리셋 + 폼 세팅)
  useEffect(() => {
    if (!showDialog) return;

    dispatch(clearError());
    dispatch(clearSuccess());

    if (mode === "edit") {
      setFormData(selectedProduct);

      const sizeArray = Object.keys(selectedProduct?.stock || {}).map((size) => [
        size,
        selectedProduct.stock[size],
      ]);
      setStock(sizeArray);
    } else {
      setFormData({ ...InitialFormData });
      setStock([]);
    }

    setStockError(false);
  }, [showDialog, mode, selectedProduct, dispatch]);

  // ✅ stock이 생기면 에러 해제
  useEffect(() => {
    if (stock.length > 0 && stockError) setStockError(false);
  }, [stock, stockError]);

  const handleClose = () => {
    dispatch(clearError());
    dispatch(clearSuccess());
    setShowDialog(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("formData", formData);

    if (stock.length == 0) {
      return setStockError(true);
    }

    const totalStock = stock.reduce((total, item) => {
      return { ...total, [item[0]]: parseInt(item[1]) };
    }, {});
    console.log("totalStock", totalStock);

    if (mode === "new") {
      // 새 상품 만들기
      dispatch(createProduct({ ...formData, stock: totalStock }));
    } else {
      // 상품 수정하기
      // dispatch(editProduct({ ...formData, stock: totalStock }));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addStock = () => {
    setStock([...stock, []]);
  };

  const deleteStock = (idx) => {
    const newStock = stock.filter((item, index) => index !== idx);
    setStock(newStock);
  };

  const handleSizeChange = (value, index) => {
    const newStock = [...stock];
    newStock[index][0] = value;
    setStock(newStock);
  };

  const handleStockChange = (value, index) => {
    const newStock = [...stock];
    newStock[index][1] = value;
    setStock(newStock);
  };

  const onHandleCategory = (event) => {
    if (formData.category.includes(event.target.value)) {
      const newCategory = formData.category.filter((item) => item !== event.target.value);
      setFormData({ ...formData, category: [...newCategory] });
    } else {
      setFormData({ ...formData, category: [...formData.category, event.target.value] });
    }
  };

  const uploadImage = useCallback((url) => {
    setFormData((prev) => ({ ...prev, image: url }));
  }, []);

  return (
    <StyledDialog open={showDialog} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>{mode === "new" ? "Create New Product" : "Edit Product"}</DialogTitle>

      {error && (
        <ErrorWrap>
          <Alert severity="error">{error}</Alert>
        </ErrorWrap>
      )}

      <DialogContent dividers>
        <FormWrap component="form" onSubmit={handleSubmit}>
          <FormInner>
            <div>
              <TextField
                label="Sku"
                name="sku"
                onChange={handleChange}
                placeholder="Enter Sku"
                required
                fullWidth
                value={formData.sku}
              />
            </div>

            <div>
              <TextField
                label="Name"
                name="name"
                onChange={handleChange}
                placeholder="Name"
                required
                fullWidth
                value={formData.name}
              />
            </div>

            <div>
              <TextField
                label="Description"
                name="description"
                placeholder="Description"
                onChange={handleChange}
                required
                fullWidth
                multiline
                minRows={3}
                value={formData.description}
              />
            </div>

            <div>
              <SectionCard>
                <SectionTitleRow>
                  <Typography variant="subtitle1">Stock</Typography>
                  {stockError && (
                    <StockErrorText variant="body2">재고를 추가해주세요</StockErrorText>
                  )}
                  <Grow />
                  <Button variant="contained" size="small" onClick={addStock}>
                    Add +
                  </Button>
                </SectionTitleRow>

                <StockList>
                  {stock.map((item, index) => (
                    <StockRow key={index}>
                      <FormControl fullWidth>
                        <InputLabel id={`size-label-${index}`}>Size</InputLabel>
                        <Select
                          labelId={`size-label-${index}`}
                          label="Size"
                          onChange={(event) => handleSizeChange(event.target.value, index)}
                          required
                          value={item[0] ? item[0].toLowerCase() : ""}
                        >
                          <MenuItem value="" disabled>
                            Please Choose...
                          </MenuItem>

                          {SIZE.map((s, idx) => (
                            <MenuItem
                              key={idx}
                              value={s.toLowerCase()}
                              disabled={stock.some((size) => size[0] === s.toLowerCase())}
                            >
                              {s}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        label="Qty"
                        onChange={(event) => handleStockChange(event.target.value, index)}
                        type="number"
                        placeholder="number of stock"
                        value={item[1]}
                        required
                        fullWidth
                      />

                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => deleteStock(index)}
                      >
                        -
                      </Button>
                    </StockRow>
                  ))}
                </StockList>
              </SectionCard>
            </div>

            <div>
              <SectionCard>
                <SectionTitleRow>
                  <Typography variant="subtitle1">Image</Typography>
                </SectionTitleRow>

                <CloudinaryUploadWidget uploadImage={uploadImage} />

                {formData.image && (
                  <ImagePreviewWrap>
                    <UploadImage id="uploadedimage" src={formData.image} alt="uploadedimage" />
                  </ImagePreviewWrap>
                )}
              </SectionCard>
            </div>

            {/* [ price ] [ status ] */}
            <div>
              <TextField
                label="Price"
                name="price"
                value={formData.price}
                required
                onChange={handleChange}
                type="number"
                placeholder="0"
                fullWidth
              />
            </div>

            <div>
              <FormControl fullWidth required>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  label="Category"
                  multiple
                  value={formData.category}
                  onChange={onHandleCategory}
                >
                  {CATEGORY.map((item, idx) => (
                    <MenuItem key={idx} value={item.toLowerCase()}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div>
              <FormControl fullWidth required>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  label="Status"
                  value={formData.status}
                  onChange={handleChange}
                  name="status"
                >
                  {STATUS.map((item, idx) => (
                    <MenuItem key={idx} value={item.toLowerCase()}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </FormInner>

          <FooterActions>
            <Button type="submit" variant="contained">
              {mode === "new" ? "Submit" : "Edit"}
            </Button>
          </FooterActions>
        </FormWrap>
      </DialogContent>

      <DialogActions />
    </StyledDialog>
  );
};

export default NewItemDialog;

/** styles */
const StyledDialog = styled(Dialog)(() => ({
  "& .MuiPaper-root": {
    borderRadius: 18,
  },
}));

const ErrorWrap = styled("div")(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingBottom: theme.spacing(1),
}));

const FormWrap = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "30px",
}));

const FormInner = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
}));

const SectionCard = styled("div")(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 16,
  padding: theme.spacing(2),
  background: theme.palette.background.paper,
}));

const SectionTitleRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
}));

const Grow = styled("div")(() => ({
  flex: 1,
}));

const StockErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontWeight: 700,
}));

const StockList = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "10px",
}));

const StockRow = styled("div")(() => ({
  display: "flex",
  gap: "10px",
  width: "100% !important",

  "& + div": {
    width: "calc((100% - 40px) / 2)",
  },

  "& button": {
    width: "20px",
  },
}));

const ImagePreviewWrap = styled("div")(({ theme }) => ({
  display: "flex",
  marginTop: theme.spacing(1.5),
  justifyContent: "flex-start",
}));

const UploadImage = styled("img")(({ theme }) => ({
  display: "block",
  width: "100%",
  height: "100%",
  maxWidth: 420,
  aspectRatio: "4 / 3",
  objectFit: "cover",
  borderRadius: 14,
  border: `1px solid ${theme.palette.divider}`,
}));

const FooterActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "flex-end",
  bottom: 0,
  background: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
}));
