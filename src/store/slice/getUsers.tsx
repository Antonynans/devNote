import { createSlice } from "@reduxjs/toolkit";

const getUsersSlice = createSlice({
  name: "users",
  initialState: { 
    token: "",
    user: {
      _id: "",
      email: "",
      firstname: "",
      lastname: "",
      picture: "",
      username: "",
      
    },
  },

  reducers: {
    getUsers(_state, action) {
      return action.payload;
    },
  },
});

export default getUsersSlice.reducer;

export const { getUsers } = getUsersSlice.actions;
