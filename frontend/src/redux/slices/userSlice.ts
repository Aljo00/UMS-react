import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  count: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    updateUser(state, action) {
      state.user = action.payload;
    },
    logOut(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    increment(state) {
      state.count += 1;
    },
    decrement(state) {
      state.count -= 1;
    },
  },
});

export const { setUser, updateUser, logOut, increment, decrement } =
  userSlice.actions;
export default userSlice.reducer;
