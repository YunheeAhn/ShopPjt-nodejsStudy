import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

// MUI
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import { loginWithEmail, loginWithGoogle, clearErrors } from "../../features/user/userSlice";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loginError, loading } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleLoginWithEmail = (event) => {
    event.preventDefault();
    dispatch(loginWithEmail({ email, password }));
  };

  const handleGoogleLogin = async (credentialResponse) => {
    //구글 로그인 하기
    console.log("google credentialResponse:", credentialResponse);
  };

  return (
    <Container maxWidth="sm" className="login-area" sx={{ py: 6 }}>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          bgcolor: "background.paper",
        }}
      >
        {loginError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginError}
          </Alert>
        )}

        <Box component="form" className="login-form" onSubmit={handleLoginWithEmail}>
          <Stack spacing={2}>
            <TextField
              label="Email address"
              type="email"
              placeholder="Enter email"
              required
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              placeholder="Password"
              required
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              fullWidth
            />

            <Box
              className="login-button-area"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Button type="submit" variant="contained" sx={{ minWidth: 120 }}>
                Login
              </Button>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                아직 계정이 없으세요?{" "}
                <Box
                  component={RouterLink}
                  to="/register"
                  sx={{ color: "primary.main", fontWeight: 800 }}
                >
                  회원가입 하기
                </Box>
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
                -외부 계정으로 로그인하기-
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                  />
                </GoogleOAuthProvider>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
