import { createSlice } from "@reduxjs/toolkit";

interface FiltersState {
  filesCount: number;
}

const initialState: FiltersState = {
  filesCount: 0,
};

export const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    setFilesCount: (state, action) => {
      state.filesCount = action.payload;
    },
  },
});

export const { setFilesCount } = filesSlice.actions;

export const filesReducer = filesSlice.reducer;
