import React from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

// MUI
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const PaymentForm = ({ handleInputFocus, cardValue, handlePaymentInfoChange }) => {
  return (
    <FormRow>
      <CardArea>
        <Cards
          cvc={cardValue.cvc}
          expiry={cardValue.expiry}
          focused={cardValue.focus}
          name={cardValue.name}
          number={cardValue.number}
        />
      </CardArea>

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

        <div>
          <div>
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
          </div>

          <div>
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
          </div>
        </div>
      </InputsArea>
    </FormRow>
  );
};

export default PaymentForm;

// 스타일드 컴포넌트
const FormRow = styled("div")(({ theme }) => ({
  width: "100%",

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

const CardArea = styled("div")(({ theme }) => ({
  width: "290px",

  [theme.breakpoints.down("md")]: {
    width: "100%",
  },

  "& .rccs": {
    margin: "0 !important",
  },
}));

const InputsArea = styled("div")(({ theme }) => ({
  width: "calc(100% - 30px - 290px)",

  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

const InputField = styled(TextField)(() => ({
  marginBottom: 10,
}));
