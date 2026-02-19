import React, { useState, useEffect } from "react";
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
import { clearError, createProduct, editProduct } from "../../../features/product/productSlice";

const NewItemDialog = ({ mode, showDialog, setShowDialog }) => {
  const { error, success, selectedProduct } = useSelector((state) => state.product);

  const [formData, setFormData] = useState(
    mode === "new" ? { ...InitialFormData } : selectedProduct,
  );
  const [stock, setStock] = useState([]);
  const [stockError, setStockError] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (success) setShowDialog(false);
  }, [success]);

  useEffect(() => {
    if (error || !success) {
      dispatch(clearError());
    }
    if (showDialog) {
      if (mode === "edit") {
        setFormData(selectedProduct);

        // 객체형태로 온 stock을  다시 배열로 세팅해주기
        const sizeArray = Object.keys(selectedProduct.stock).map((size) => [
          size,
          selectedProduct.stock[size],
        ]);
        setStock(sizeArray);
      } else {
        setFormData({ ...InitialFormData });
        setStock([]);
      }
    }
  }, [showDialog]);

  const handleClose = () => {
    //모든걸 초기화시키고;
    // 다이얼로그 닫아주기
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("formData", formData);
    //재고를 입력했는지 확인, 아니면 에러
    if (stock.length == 0) {
      return stockError(true);
    }
    // 재고를 배열에서 객체로 바꿔주기
    // [['M',2]] 에서 {M:2}로
    const totalStock = stock.reduce((total, item) => {
      return { ...total, [item[0]]: parseInt(item[1]) };
    }, {});
    console.log("totalStock", totalStock);
    if (mode === "new") {
      //새 상품 만들기
    } else {
      // 상품 수정하기
    }
  };

  const handleChange = (event) => {
    //form에 데이터 넣어주기
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addStock = () => {
    //재고타입 추가시 배열에 새 배열 추가
    setStock([...stock, []]);
  };

  const deleteStock = (idx) => {
    //재고 삭제하기
    const newStock = stock.filter((item, index) => index !== idx);
    setStock(newStock);
  };

  const handleSizeChange = (value, index) => {
    //  재고 사이즈 변환하기
    const newStock = [...stock];
    newStock[index][0] = value;
    setStock(newStock);
  };

  const handleStockChange = (value, index) => {
    //재고 수량 변환하기
    const newStock = [...stock];
    newStock[index][1] = value;
    setStock(newStock);
  };

  const onHandleCategory = (event) => {
    // 이미 카테고리가 있으면 제거
    if (formData.category.includes(event.target.value)) {
      const newCategory = formData.category.filter((item) => item !== event.target.value);
      setFormData({ ...formData, category: [...newCategory] });
    } else {
      // 없으면 새로 추가
      setFormData({ ...formData, category: [...formData.category, event.target.value] });
    }
  };

  const uploadImage = (url) => {
    //이미지 업로드
    setFormData({ ...formData, image: url });
    console.log("zmfflr");
  };

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
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Sku"
                name="sku"
                onChange={handleChange}
                placeholder="Enter Sku"
                required
                fullWidth
                value={formData.sku}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Name"
                name="name"
                onChange={handleChange}
                placeholder="Name"
                required
                fullWidth
                value={formData.name}
              />
            </Grid>

            <Grid item xs={12}>
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
            </Grid>

            <Grid item xs={12}>
              <SectionTitleRow>
                <Typography variant="subtitle1">Stock</Typography>
                {stockError && <StockErrorText variant="body2">재고를 추가해주세요</StockErrorText>}
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
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1">Image</Typography>
              <CloudinaryUploadWidget uploadImage={uploadImage} />
              {formData.image && (
                <UploadImage id="uploadedimage" src={formData.image} alt="uploadedimage" />
              )}
            </Grid>

            <Grid item xs={12} md={4}>
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
            </Grid>

            <Grid item xs={12} md={4}>
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
            </Grid>

            <Grid item xs={12} md={4}>
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
            </Grid>
          </Grid>

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

// 스타일드 컴포넌트
const InitialFormData = {
  name: "",
  sku: "",
  stock: {},
  image: "",
  description: "",
  category: [],
  status: "active",
  price: 0,
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 18,
  },
}));

const ErrorWrap = styled("div")(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingBottom: theme.spacing(1),
}));

const FormWrap = styled(Box)(({ theme }) => ({
  display: "block",
}));

const SectionTitleRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const StockErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontWeight: 700,
}));

const StockList = styled("div")(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const StockRow = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1.2fr auto",
  gap: theme.spacing(1),
  alignItems: "center",
}));

const UploadImage = styled("img")(({ theme }) => ({
  display: "block",
  width: "100%",
  maxWidth: 360,
  marginTop: theme.spacing(1),
  borderRadius: 14,
  border: `1px solid ${theme.palette.divider}`,
}));

const FooterActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
}));
