// src/features/admin/adminSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

// ─────────────────────────────────────────────────────────
// FETCH USERS
// ─────────────────────────────────────────────────────────
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/admin"); // GET /api/admin
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ─────────────────────────────────────────────────────────
// ADD USER
// ─────────────────────────────────────────────────────────
export const addUser = createAsyncThunk(
  "admin/addUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/admin/add", formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ─────────────────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────────────────
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ── FETCH USERS
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── ADD USER
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload); // Add new user to the array
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
