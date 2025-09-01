import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/slices/authSlice";
import dashboardReducer from "../store/slices/dashboardSlice";
import callReducer from "../store/slices/callForm";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    call: callReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
