import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartQty } from "../cart/cartSlice";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// Define initial state
const initialState = {
  orderList: [],
  orderNum: "",
  selectedOrder: {},
  error: "",
  loading: false,
  totalPageNum: 1,
};

// Async thunks
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/order", payload);
      if (response.status !== 200) {
        throw new Error(response.error);
      }
      // 카트 수량 가져오기
      dispatch(getCartQty());
      return response.data.orderNum;
    } catch (error) {
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.error ||
        (typeof error === "string" ? error : "") ||
        error?.message ||
        "주문 실패 했습니다";

      dispatch(showToastMessage({ message: msg, status: "error" }));
      return rejectWithValue(msg);
    }
  },
);

export const getOrder = createAsyncThunk("order/getOrder", async (id, { rejectWithValue }) => {
  try {
    if (!id) throw new Error("주문 id가 없습니다");

    const response = await api.get(`/order/me/${id}`);
    if (response.status !== 200) throw new Error(response.error);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(
      error?.response?.data?.error || error?.message || "주문 상세 불러오기 실패",
    );
  }
});

export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  async (query, { rejectWithValue }) => {
    try {
      // 전체 주문목록
      const response = await api.get("/order", { params: { ...query } });
      if (response.status !== 200) throw new Error(response.error);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.error || error?.message || "주문 목록 불러오기 실패",
      );
    }
  },
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/order/${id}`, { status });
      if (response.status !== 200) throw new Error(response.error);

      dispatch(showToastMessage({ message: "주문 상태가 변경되었습니다", status: "success" }));
      return response.data.data;
    } catch (error) {
      const msg = error?.response?.data?.error || error?.message || "주문 상태 변경 실패";
      dispatch(showToastMessage({ message: msg, status: "error" }));
      return rejectWithValue(msg);
    }
  },
);

// 로그인한 유저 내 주문 목록
export const getMyOrders = createAsyncThunk("order/getMyOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/order/me");
    if (response.status !== 200) throw new Error(response.error);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(
      error?.response?.data?.error || error?.message || "내 주문 목록 불러오기 실패",
    );
  }
});

// Order slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.orderNum = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.selectedOrder = action.payload;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getOrderList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.orderList = action.payload.data;
        state.totalPageNum = action.payload.totalPageNum;
      })
      .addCase(getOrderList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.selectedOrder = action.payload;

        const idx = state.orderList.findIndex((o) => o._id === action.payload._id);
        if (idx !== -1) state.orderList[idx] = action.payload;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.orderList = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
