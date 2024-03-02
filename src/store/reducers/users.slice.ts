import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/types";

interface FiltersState {
  user: User | null;
}

const initialState: FiltersState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export const userReducer = userSlice.reducer;
