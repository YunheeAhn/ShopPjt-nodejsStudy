import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// 비동기 액션 생성
export const getProductList = createAsyncThunk(
  "products/getProductList",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get("/product", { params: { ...query } });
      if (response.status !== 200) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.error || error?.message || "상품 목록 불러오기 실패",
      );
    }
  },
);

export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/product/${id}`);
      if (response.status !== 200) {
        throw new Error(response.error);
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.error || error?.message || "상품 상세 불러오기 실패",
      );
    }
  },
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/product", formData);

      if (response.status !== 200) {
        throw new Error(response.error);
      }
      dispatch(showToastMessage({ message: "상품 생성이 완료 되었습니다", status: "success" }));
      dispatch(getProductList());

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/product/${id}`);

      if (response.status !== 200) {
        throw new Error(response.error);
      }

      dispatch(showToastMessage({ message: "상품 삭제가 완료 되었습니다", status: "success" }));
      dispatch(getProductList());

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error || error?.message || "상품 삭제 실패");
    }
  },
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, ...formData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/product/${id}`, formData);
      if (response.status !== 200) {
        throw new Error(response.error);
      }
      dispatch(showToastMessage({ message: "상품 정보를 수정 했습니다", status: "success" }));
      dispatch(getProductList());
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  },
);

// 슬라이스 생성
const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    selectedProduct: null,
    loading: false,
    error: "",
    totalPageNum: 1,
    success: false,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = "";
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
        state.success = true; // 상품 생성 성공? 다이얼로그 닫기, 실패? 다이얼로그에 실패 메세지 보여주기
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(getProductList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload.data;
        state.totalPageNum = action.payload.totalPageNum;
        state.error = "";
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProduct.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
        state.success = true;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProductDetail.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.selectedProduct = null;
      })
      .addCase(getProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.selectedProduct = action.payload;
      })
      .addCase(getProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedProduct = null;
      });
  },
});

export const { setSelectedProduct, setFilteredList, clearError, clearSuccess } =
  productSlice.actions;
export default productSlice.reducer;
