import { createSlice } from "@reduxjs/toolkit";
const loaderslice = createSlice({
	name: "loader",
	initialState: false,
	reducers: {
		getloaderstate(_state, action) {
			
			return action.payload;
		},
	},
});

export default loaderslice.reducer;

export const { getloaderstate } = loaderslice.actions;