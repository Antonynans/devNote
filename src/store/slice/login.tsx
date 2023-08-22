import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "token",
  initialState: {},

  reducers: {
    getToken(_state, action) {
      return action.payload;
    },
  },
});

export default loginSlice.reducer;

export const { getToken } = loginSlice.actions;
