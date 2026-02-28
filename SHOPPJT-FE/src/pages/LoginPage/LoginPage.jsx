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
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";

import { loginWithEmail, loginWithGoogle, clearErrors } from "../../features/user/userSlice";

const VITE_GOOGLE_CLIENT = import.meta.env.VITE_GOOGLE_CLIENT;

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
    dispatch(loginWithGoogle(credentialResponse.credential));
  };

  return (
    <PageContainer maxWidth="sm">
      <CardPaper variant="outlined">
        {loginError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginError}
          </Alert>
        )}

        <FormBox component="form" onSubmit={handleLoginWithEmail}>
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

            <ActionRow>
              <SubmitButton type="submit" variant="contained" disabled={loading}>
                {loading ? (
                  <ButtonLoadingContent>
                    <CircularProgress size={18} />
                    진행 중...
                  </ButtonLoadingContent>
                ) : (
                  "Login"
                )}
              </SubmitButton>

              <RegisterText variant="body2">
                아직 계정이 없으세요?{" "}
                <RegisterLink component={RouterLink} to="/register">
                  회원가입 하기
                </RegisterLink>
              </RegisterText>
            </ActionRow>

            <DividerStyled />

            <ExternalLoginWrap>
              <ExternalLoginCaption variant="body2">
                -외부 계정으로 로그인하기-
              </ExternalLoginCaption>

              <GoogleCenter>
                <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT}>
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                  />
                </GoogleOAuthProvider>
              </GoogleCenter>
            </ExternalLoginWrap>
          </Stack>
        </FormBox>
      </CardPaper>
    </PageContainer>
  );
};

export default LoginPage;

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

const FormBox = styled(Box)(() => ({}));

const ActionRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  flexWrap: "wrap",
}));

const RegisterText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const RegisterLink = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 800,
  textDecoration: "none",
  display: "inline",
  "&:hover": {
    textDecoration: "underline",
  },
}));

const DividerStyled = styled(Divider)(({ theme }) => ({
  margin: `${theme.spacing(1)} 0`,
}));

const ExternalLoginWrap = styled(Box)(() => ({
  textAlign: "center",
}));

const ExternalLoginCaption = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const GoogleCenter = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
}));

const SubmitButton = styled(Button)(() => ({
  minWidth: 120,
}));

const ButtonLoadingContent = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));
