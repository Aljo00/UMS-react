import { conigureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";

const store = conigureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
