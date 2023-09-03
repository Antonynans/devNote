import { combineReducers, configureStore } from "@reduxjs/toolkit";
import getUsersSlice from "./slice/getUsers";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import loaderslice from './slice/loaderstate';
import getFormsSlice from './slice/getForm';

const persistConfig = {
  key: "root",
  storage,
  blacklist: ['loader', 'forms']
};

const rootReducer = combineReducers({
  users: getUsersSlice,
  forms: getFormsSlice,
  loader: loaderslice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export default store;

export const persistor = persistStore(store);
