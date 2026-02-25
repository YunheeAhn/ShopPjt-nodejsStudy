import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import OrderReceipt from "./component/OrderReceipt";
import PaymentForm from "./component/PaymentForm";
import { cc_expires_format } from "../../utils/number";
import { createOrder } from "../../features/order/orderSlice";

// MUI
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const { cartList, totalPrice, loading } = useSelector((state) => state.cart);
  const { orderNum } = useSelector((state) => state.order);
  const [cardValue, setCardValue] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });
  const navigate = useNavigate();
  const [firstLoading, setFirstLoading] = useState(true);
  const [shipInfo, setShipInfo] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    city: "",
    zip: "",
  });

  useEffect(() => {
    // 오더번호를 받으면 어디로 갈까?
  }, [orderNum]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // 오더 생성하기
    const { firstName, lastName, contact, address, city, zip } = shipInfo;

    dispatch(
      createOrder({
        totalPrice,
        shipTo: { address, city, zip },
        contact: { firstName, lastName, contact },
        orderList: cartList.map((item) => ({
          productId: item.productId._id,
          price: item.productId.price,
          qty: item.qty,
          size: item.size,
        })),
      }),
    );
  };

  const handleFormChange = (event) => {
    //shipInfo에 값 넣어주기
    const { name, value } = event.target;
    setShipInfo({ ...shipInfo, [name]: value });
  };

  const handlePaymentInfoChange = (event) => {
    //카드정보 넣어주기
    const { name, value } = event.target;
    const newValue = name === "expiry" ? cc_expires_format(value) : value;
    setCardValue({ ...cardValue, [name]: newValue });
  };

  const handleInputFocus = (e) => {
    setCardValue({ ...cardValue, focus: e.target.name });
  };

  // if (cartList?.length === 0) {
  //   // 주문할 아이템이 없다면 주문하기로 안넘어가게 막음
  //   navigate("/cart");
  // }

  useEffect(() => {
    if (!loading && cartList?.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [loading, cartList, navigate]);

  return (
    <PageWrap maxWidth={false}>
      <Layout>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={7}>
            <Section>
              <SectionTitle variant="h2">배송 주소</SectionTitle>

              <FormWrap component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="성"
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="lastName"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="이름"
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="firstName"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="연락처"
                      placeholder="010-xxx-xxxxx"
                      onChange={handleFormChange}
                      required
                      name="contact"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="주소"
                      placeholder="Apartment, studio, or floor"
                      onChange={handleFormChange}
                      required
                      name="address"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="City"
                      onChange={handleFormChange}
                      required
                      name="city"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Zip"
                      onChange={handleFormChange}
                      required
                      name="zip"
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <MobileReceiptArea>
                  <OrderReceipt cartList={cartList} totalPrice={totalPrice} />
                </MobileReceiptArea>

                <PaymentTitle variant="h2">결제 정보</PaymentTitle>
                <PaymentForm
                  cardValue={cardValue}
                  handleInputFocus={handleInputFocus}
                  handlePaymentInfoChange={handlePaymentInfoChange}
                />

                <PayButton variant="contained" type="submit">
                  결제하기
                </PayButton>
              </FormWrap>
            </Section>
          </Grid>

          <Grid item xs={12} lg={5}>
            <ReceiptArea>
              <OrderReceipt cartList={cartList} totalPrice={totalPrice} />
            </ReceiptArea>
          </Grid>
        </Grid>
      </Layout>
    </PageWrap>
  );
};

export default PaymentPage;

// 스타일드 컴포넌트
const PageWrap = styled(Container)(() => ({
  width: "100%",
}));

const Layout = styled(Box)(({ theme }) => ({
  width: "100%",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(4),
}));

const Section = styled(Box)(() => ({
  width: "100%",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  marginBottom: theme.spacing(1),
}));

const FormWrap = styled(Box)(() => ({
  width: "100%",
}));

const PaymentTitle = styled(Typography)(() => ({
  marginTop: "30px",
  marginBottom: "20px",
  fontWeight: 800,
}));

const PayButton = styled(Button)(() => ({
  width: "100%",
  padding: "16px",
  marginBottom: "20px",
  marginTop: "30px",
  borderRadius: 12,
  fontWeight: 800,
}));

const ReceiptArea = styled(Box)(() => ({
  width: "100%",
  "@media screen and (max-width: 63rem)": {
    display: "none",
  },
}));

const MobileReceiptArea = styled(Box)(() => ({
  display: "none",
  "@media screen and (max-width: 63rem)": {
    display: "block",
  },
}));
