import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/users.slice";
import { Api } from "../services/Api";
import { filesReducer } from "./reducers/files.slice";

export const store = configureStore({
  reducer: {
    userReducer,
    filesReducer,
    [Api.reducerPath]: Api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(Api.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
