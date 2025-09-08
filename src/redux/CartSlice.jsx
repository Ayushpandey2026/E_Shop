import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/postApi";  
import axios from "axios"; // agar tum direct axios use karna chahte ho
import { useSelector } from "react-redux";

// Fetch Cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      console.log("data h ye ",res.data);
      
      return res.data; // { items: [...] }
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Fetch cart failed");
    }
  }
);

// Add to Cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/web/cart/add",
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Add to cart failed");
    }
  }
);

// Remove from Cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({productId,quantity}, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/web/cart/remove",{productId,quantity},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
          data:{productId}
        }
      );
      console.log("deleted data",res.data);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Remove failed");
    }
  }
);

// Clear Cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/cart/clear",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Clear failed");
    }
  }
);
  const extractItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload.cart?.items) return payload.cart.items;
  if (payload.items) return payload.items;
  return [];
};



const slice = createSlice({
  name: "cart",
  initialState: { items: [], status: "idle", error: null, count: 0  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        // console.log("FETCH CART PAYLOAD IN REDUCER:", action.payload);
  state.items = extractItems(action.payload);
  // console.log("FETCH CART ITEMS =>", state.items);
  state.count = state.items.length;
  // state.count = calcCount(state.items);
  // console.log("COUNT =>", state.count);
})

.addCase(addToCart.fulfilled, (state, action) => {
  state.items = extractItems(action.payload);
    state.count = state.items.length;
    // state.count = calcCount(state.items);

})
.addCase(removeFromCart.fulfilled, (state, action) => {
  state.items = extractItems(action.payload);
  console.log("del::",state.items);
  
    state.count = state.items.length;
    // state.count = calcCount(state.items);

})

      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = [];
        state.count=0;

      });
  },
});

export default slice.reducer;
export const selectCartCount = (state) => state.cart.count;





