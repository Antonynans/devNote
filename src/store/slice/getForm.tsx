import { createSlice } from "@reduxjs/toolkit";

interface Note {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
const initialState: Note[] = [];

const getFormsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    getForms(_state, action) {
      return action.payload;
    },
  },
});

export default getFormsSlice.reducer;

export const { getForms } = getFormsSlice.actions;
