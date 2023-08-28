import { combineReducers, configureStore } from "@reduxjs/toolkit";
import getUsersSlice from "./slice/getUsers";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import loaderslice from './slice/loaderstate';

const persistConfig = {
  key: "root",
  storage,
  blacklist: ['loaderslice']
};

const rootReducer = combineReducers({
  users: getUsersSlice,
  loaderslice: loaderslice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export default store;

export const persistor = persistStore(store);
