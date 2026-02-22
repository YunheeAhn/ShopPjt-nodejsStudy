import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { currencyFormat } from "../../utils/number";
import { getProductDetail } from "../../features/product/productSlice";
import { addToCart } from "../../features/cart/cartSlice";

// MUI
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { selectedProduct, loading } = useSelector((state) => state.product);
  const [size, setSize] = useState("");
  const { id } = useParams();
  const [sizeError, setSizeError] = useState(false);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const addItemToCart = () => {
    //사이즈를 아직 선택안했다면 에러
    // 아직 로그인을 안한유저라면 로그인페이지로
    // 카트에 아이템 추가하기
  };
  const selectSize = (value) => {
    // 사이즈 추가하기
  };

  useEffect(() => {
    dispatch(getProductDetail(id));
  }, [id, dispatch]);

  if (loading || !selectedProduct)
    return (
      <LoadingWrap>
        <CircularProgress size={60} />
      </LoadingWrap>
    );

  return (
    <DetailContainer maxWidth={false}>
      <DetailCard>
        <DetailGrid>
          <ImageCol>
            <ProductImage src={selectedProduct.image} alt="image" />
          </ImageCol>

          <InfoCol>
            <ProductInfoText>{selectedProduct.name}</ProductInfoText>
            <ProductInfoText>₩ {currencyFormat(selectedProduct.price)}</ProductInfoText>
            <ProductInfoText>{selectedProduct.description}</ProductInfoText>

            <DropdownWrap>
              <FormControl fullWidth>
                <Select
                  displayEmpty
                  value={size}
                  onChange={(event) => selectSize(event.target.value)}
                  error={sizeError}
                  renderValue={(selected) =>
                    selected === "" ? "사이즈 선택" : selected.toUpperCase()
                  }
                >
                  {Object.keys(selectedProduct.stock).length > 0 &&
                    Object.keys(selectedProduct.stock).map((item, index) =>
                      selectedProduct.stock[item] > 0 ? (
                        <MenuItem value={item} key={index}>
                          {item.toUpperCase()}
                        </MenuItem>
                      ) : (
                        <MenuItem value={item} disabled={true} key={index}>
                          {item.toUpperCase()}
                        </MenuItem>
                      ),
                    )}
                </Select>
              </FormControl>
            </DropdownWrap>

            <WarningMessage>{sizeError && "사이즈를 선택해주세요."}</WarningMessage>

            <AddButton variant="contained" onClick={addItemToCart}>
              추가
            </AddButton>
          </InfoCol>
        </DetailGrid>
      </DetailCard>
    </DetailContainer>
  );
};

export default ProductDetail;

// 스타일드 컴포넌트
const DetailContainer = styled(Container)(() => ({
  maxWidth: "100%",
}));

const DetailCard = styled("div")(({ theme }) => ({
  width: "100%",
  borderRadius: 18,
  padding: theme.spacing(3),
}));

const DetailGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(3),

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
  },
}));

const ImageCol = styled("div")(() => ({
  width: "100%",
}));

const InfoCol = styled("div")(() => ({
  width: "100%",
}));

const ProductImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "auto",
  display: "block",
  borderRadius: 16,
  border: `1px solid ${theme.palette.divider}`,
}));

const ProductInfoText = styled(Typography)(({ theme }) => ({
  fontSize: "20px",
  marginBottom: "10px",
  color: theme.palette.text.primary,
}));

const DropdownWrap = styled("div")(() => ({
  width: "100%",
}));

const WarningMessage = styled("div")(({ theme }) => ({
  color: theme.palette.error.main,
  marginTop: theme.spacing(1),
  minHeight: 22,
}));

const AddButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: "100%",
  borderRadius: 12,
  fontWeight: 700,
}));

const LoadingWrap = styled("div")(() => ({
  width: "100%",
  height: "60vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
