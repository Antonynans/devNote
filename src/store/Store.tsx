import { combineReducers, configureStore } from "@reduxjs/toolkit";
import loginSlice from "./slice/login";
import getUsersSlice from "./slice/getUsers";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  login: loginSlice,
  users: getUsersSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export default store;

export const persistor = persistStore(store);
