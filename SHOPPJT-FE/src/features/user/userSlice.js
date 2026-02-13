import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {},
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {},
);

export const logout = () => (dispatch) => {};

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

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {},
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
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
  },
  extraReducers: (builder) => {
    // 회원가입 케이스
    builder
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
      });
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
