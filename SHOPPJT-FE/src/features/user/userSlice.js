import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

// 이메일로 로그인 로직
export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      // 로그인에 성공한 경우
      // 성공 하면 메인 페이지로 이동 (로그인페이지에서)

      // 세션스토리지 토큰 저장
      sessionStorage.setItem("token", response.data.token);

      return response.data;
    } catch (error) {
      // 로그인에 실패한 경우
      // 에러 값 reducer에 저장
      const msg = error?.message || error?.error || "로그인에 실패 했습니다";
      return rejectWithValue(msg);
    }
  },
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/google", { token });

      if (response.status !== 200) throw new Error(response.error);

      // 세션스토리지 토큰 저장
      sessionStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      const msg = error?.response?.data?.error || error?.message || "로그인에 실패 했습니다";
      return rejectWithValue(msg);
    }
  },
);

export const logout = () => (dispatch) => {
  sessionStorage.removeItem("token");
  dispatch(userSlice.actions.logoutSuccess());
};

// 유저 회원가입
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ email, name, password, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/user", { email, name, password });
      // 성공 //
      // 1. 성공 메세지 보여주기
      dispatch(showToastMessage({ message: "회원가입을 성공했습니다", status: "success" }));

      // 2. 로그인 페이지로 리다이렉트
      navigate("/login");

      // 3. 값 리턴
      return response.data?.data;
    } catch (error) {
      // 실패 //
      // 1. 실패 메세지 보여주기
      dispatch(showToastMessage({ message: "회원가입에 실패 했습니다", status: "error" }));
      // 2. 에러 값을 저장
      const msg = error?.message || error?.error || "회원가입에 실패했습니다";

      return rejectWithValue(msg);
    }
  },
);

// 유저 토큰 값으로 로그인하기
export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/me");
      return response.data;
    } catch (error) {
      const msg = error?.message || error?.error || "유효하지 않은 토큰 입니다";
      return rejectWithValue(msg);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    token: sessionStorage.getItem("token") || null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.token = null;
      state.loginError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //***** 회원가입 *****//
      .addCase(registerUser.pending, (state) => {
        // 회원가입 성공 실패 여부 기다리는 중
        state.loading = true;
        state.registrationError = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        // 회원가입 성공
        state.loading = false;
        state.registrationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        // 회원가입 실패
        state.loading = false;
        state.registrationError = action.payload;
      })
      //***** 이메일 로그인 *****//
      .addCase(loginWithEmail.pending, (state) => {
        // 이메일로 로그인 성공 실패 여부 기다리는 중
        state.loading = true;
        state.loginError = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        // 이메일로 로그인 성공
        state.loading = false;
        // 이메일로 로그인 유저 값 저장
        state.user = action.payload.loginUser;
        state.token = action.payload.token;
        state.loginError = null;

        // 세션 스토리지 토큰 저장
        state.token = action.payload.token;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        // 이메일로 로그인 실패
        state.loading = false;
        state.loginError = action.payload;
      })
      //***** 토큰 로그인 *****//
      .addCase(loginWithToken.fulfilled, (state, action) => {
        // 토큰 값 있으면 로그인 유지
        state.user = action.payload.user;
      })
      //***** 구글 로그인 *****//
      .addCase(loginWithGoogle.pending, (state) => {
        // 이메일로 로그인 성공 실패 여부 기다리는 중
        state.loading = true;
        state.loginError = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        // 구글 로그인 성공
        state.loading = false;
        // 구글 로그인 유저 값 저장
        state.user = action.payload.loginUser;
        state.token = action.payload.token;
        state.loginError = null;

        // 세션 스토리지 토큰 저장
        state.token = action.payload.token;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        // 구글 로그인 실패
        state.loading = false;
        state.loginError = action.payload;
      });
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
