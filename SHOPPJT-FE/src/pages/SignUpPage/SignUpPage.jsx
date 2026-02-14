// SignUpPage.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// MUI
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";

import { registerUser } from "../../features/user/userSlice";

const SignUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { registrationError, loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    policy: false,
  });

  const [passwordError, setPasswordError] = useState("");
  const [policyError, setPolicyError] = useState(false);

  const register = (event) => {
    event.preventDefault();

    const { name, email, password, confirmPassword, policy } = formData;

    if (password !== confirmPassword) {
      setPasswordError("비밀번호 중복확인이 일치하지 않습니다.");
      return;
    }

    if (!policy) {
      setPolicyError(true);
      return;
    }

    setPasswordError("");
    setPolicyError(false);

    dispatch(registerUser({ name, email, password, navigate }));
  };

  const handleChange = (event) => {
    const { id, value, type, checked } = event.target;

    if (id === "confirmPassword" && passwordError) setPasswordError("");

    if (type === "checkbox") {
      if (policyError) setPolicyError(false);
      setFormData((prev) => ({ ...prev, [id]: checked }));
      return;
    }

    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <PageContainer maxWidth="sm">
      <CardPaper variant="outlined">
        <Title variant="h2">회원가입</Title>

        {registrationError && <ErrorAlert severity="error">{registrationError}</ErrorAlert>}

        <FormBox component="form" onSubmit={register}>
          <TextField
            fullWidth
            margin="normal"
            type="email"
            id="email"
            label="Email"
            placeholder="Enter email"
            onChange={handleChange}
            required
            autoComplete="email"
            disabled={loading}
          />

          <TextField
            fullWidth
            margin="normal"
            type="text"
            id="name"
            label="Name"
            placeholder="Enter name"
            onChange={handleChange}
            required
            autoComplete="name"
            disabled={loading}
          />

          <TextField
            fullWidth
            margin="normal"
            type="password"
            id="password"
            label="Password"
            placeholder="Password"
            onChange={handleChange}
            required
            autoComplete="new-password"
            disabled={loading}
          />

          <TextField
            fullWidth
            margin="normal"
            type="password"
            id="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            autoComplete="new-password"
            error={Boolean(passwordError)}
            helperText={passwordError || " "}
            disabled={loading}
          />

          <FormControlLabel
            control={
              <Checkbox
                id="policy"
                checked={formData.policy}
                onChange={handleChange}
                disabled={loading}
              />
            }
            label="이용약관에 동의합니다"
          />

          {policyError && (
            <PolicyWarnAlert severity="warning">이용약관 동의가 필요합니다.</PolicyWarnAlert>
          )}

          <SubmitButton type="submit" variant="contained" fullWidth disabled={loading}>
            {loading ? (
              <ButtonLoadingContent>
                <CircularProgress size={18} />
                진행 중...
              </ButtonLoadingContent>
            ) : (
              "회원가입"
            )}
          </SubmitButton>
        </FormBox>
      </CardPaper>
    </PageContainer>
  );
};

export default SignUpPage;

// 스타일드 컴포넌트
const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));

const CardPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,

  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(3),
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  marginBottom: theme.spacing(2),
}));

const ErrorAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const FormBox = styled(Box)(() => ({}));

const PolicyWarnAlert = styled(Alert)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  paddingTop: theme.spacing(1.2),
  paddingBottom: theme.spacing(1.2),
}));

const ButtonLoadingContent = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));
