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
    <Container maxWidth="sm" className="register-area" sx={{ py: 6 }}>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
          회원가입
        </Typography>

        {registrationError && (
          <Alert severity="error" className="error-message" sx={{ mb: 2 }}>
            {registrationError}
          </Alert>
        )}

        <Box component="form" onSubmit={register}>
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
            <Alert severity="warning" sx={{ mt: 1 }}>
              이용약관 동의가 필요합니다.
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 2, py: 1.2 }}
          >
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={18} />
                진행 중...
              </Box>
            ) : (
              "회원가입"
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUpPage;
