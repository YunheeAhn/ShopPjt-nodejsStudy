import React from "react";
// import Cards from "react-credit-cards-2";
// import "react-credit-cards-2/dist/es/styles-compiled.css";

// MUI
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const PaymentForm = ({ handleInputFocus, cardValue, handlePaymentInfoChange }) => {
  return (
    <FormRow>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <CardArea>
            <Cards
              cvc={cardValue.cvc}
              expiry={cardValue.expiry}
              focused={cardValue.focus}
              name={cardValue.name}
              number={cardValue.number}
            />
          </CardArea>
        </Grid>

        <Grid item xs={12} md={6}>
          <InputsArea>
            <InputField
              type="tel"
              name="number"
              placeholder="Card Number"
              onChange={handlePaymentInfoChange}
              onFocus={handleInputFocus}
              required
              inputProps={{ maxLength: 16, minLength: 16 }}
              value={cardValue.number}
              fullWidth
            />

            <InputField
              type="text"
              name="name"
              placeholder="Name"
              onChange={handlePaymentInfoChange}
              onFocus={handleInputFocus}
              required
              value={cardValue.name}
              fullWidth
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputField
                  type="text"
                  name="expiry"
                  placeholder="MM/DD"
                  onChange={handlePaymentInfoChange}
                  onFocus={handleInputFocus}
                  required
                  value={cardValue.expiry}
                  inputProps={{ maxLength: 7 }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputField
                  type="text"
                  name="cvc"
                  placeholder="CVC"
                  onChange={handlePaymentInfoChange}
                  onFocus={handleInputFocus}
                  required
                  inputProps={{ maxLength: 3 }}
                  value={cardValue.cvc}
                  fullWidth
                />
              </Grid>
            </Grid>
          </InputsArea>
        </Grid>
      </Grid>
    </FormRow>
  );
};

export default PaymentForm;

// 스타일드 컴포넌트
const FormRow = styled(Box)(() => ({
  width: "100%",
}));

const CardArea = styled(Box)(() => ({
  "& .rccs": {
    margin: "0 !important",
  },
}));

const InputsArea = styled(Box)(() => ({
  width: "100%",

  "@media screen and (max-width: 63rem)": {
    marginTop: 20,
  },
}));

const InputField = styled(TextField)(() => ({
  marginBottom: 10,
}));
