import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      return res.data; // { token, user }
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Login failed");
    }
  }
);

const slice = createSlice({
  name: "auth",
  initialState: { user: null, token: localStorage.getItem("token") || null, status: "idle", error: null },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
    }
  },
  extraReducers: (b) => {
    b.addCase(loginThunk.pending, (s)=>{ s.status="loading"; s.error=null; })
     .addCase(loginThunk.fulfilled, (s, a) => {
       s.status="succeeded";
       s.user = a.payload.user;
       s.token = a.payload.token;
       localStorage.setItem("token", a.payload.token);
     })
     .addCase(loginThunk.rejected, (s, a) => {
       s.status="failed";
       s.error = a.payload || "Login failed";
     });
  }
});

export const { logout, loginSuccess } = slice.actions;
export default slice.reducer;
