import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/cart", { productId: id, size, qty: 1 });

      if (response.status !== 200) {
        throw new Error(response.error);
      }

      dispatch(showToastMessage({ message: "카트에 제품이 추가 되었습니다.", status: "success" }));
      return response.data.cartItemQty;
    } catch (error) {
      dispatch(
        showToastMessage({ message: "카트에 제품이 추가 되지 않았습니다", status: "error" }),
      );

      return rejectWithValue(error?.response?.data?.error || error?.message);
    }
  },
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart");

      if (response.status !== 200) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error || error?.message || "카트 조회 실패");
    }
  },
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete(`/cart/${id}`);

      if (response.status !== 200) {
        throw new Error(response.error);
      }

      dispatch(showToastMessage({ message: "카트 아이템이 삭제되었습니다.", status: "success" }));
      dispatch(getCartList()); // 삭제 후 목록 다시 불러오기

      return response.data.cartItemQty;
    } catch (error) {
      dispatch(showToastMessage({ message: "삭제에 실패했습니다.", status: "error" }));
      return rejectWithValue(
        error?.response?.data?.error || error?.message || "카트 아이템 삭제 실패",
      );
    }
  },
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { rejectWithValue }) => {},
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart/qty");
      if (response.status !== 200) throw new Error(response.error);
      return response.data.cartItemQty;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.error || error?.message || "카트 수량 조회 실패",
      );
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartItemCount = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCartList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartList.fulfilled, (state, action) => {
        state.loading = false;
        state.cartList = action.payload.data;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(getCartList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartItemCount = action.payload;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCartQty.fulfilled, (state, action) => {
        state.cartItemCount = action.payload;
      });
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
