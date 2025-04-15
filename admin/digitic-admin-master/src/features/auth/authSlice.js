import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authServices";

const getUserfromLocalStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  user: getUserfromLocalStorage,
  orders: [],
  orderbyuser: null, // Initialize for single order
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getOrders = createAsyncThunk(
  "order/get-orders",
  async (_, thunkAPI) => {
    try {
      const result = await authService.getOrders();
      console.log("getOrders Payload:", result);
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch orders");
    }
  }
);

export const getOrderByUser = createAsyncThunk(
  "order/get-order",
  async (id, thunkAPI) => {
    try {
      const result = await authService.getOrder(id);
      console.log("getOrderByUser Payload:", result);
      return result; // Single order object
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch order");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login cases (unchanged)
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.message = "success";
      })
      .addCase(login.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
        state.isLoading = false;
      })
      // GetOrders cases (unchanged)
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.orders = Array.isArray(action.payload) ? action.payload : action.payload.orders || [];
        state.message = "success";
        console.log("Updated Orders State:", state.orders);
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch orders";
      })
      // GetOrderByUser cases
      .addCase(getOrderByUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getOrderByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.orderbyuser = action.payload; // Single order object
        state.message = "success";
        console.log("Updated orderbyuser State:", state.orderbyuser);
      })
      .addCase(getOrderByUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.orderbyuser = null;
        state.message = action.payload || "Failed to fetch order";
      });
  },
});

export default authSlice.reducer;