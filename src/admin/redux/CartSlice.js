import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const token = localStorage.getItem("token");

// Fetch cart
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await axios.get("https://e-shop-backend-iqb1.onrender.com/api/cart", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
});

// Add to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }) => {
    const res = await axios.post(
      "https://e-shop-backend-iqb1.onrender.com/api/cart",
      { productId, quantity },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return res.data;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], count: 0, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.count = action.payload.items.length;
        state.loading = false;
      })
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.count = action.payload.items.length;
        state.loading = false;
      });
  },
});

export default cartSlice.reducer;
