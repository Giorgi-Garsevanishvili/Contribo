import { configureStore } from "@reduxjs/toolkit";
import { allowedUserCompReducer } from "./features/allowedUsers/allowedRoleSlice";

export const store = configureStore({
  reducer: {
    AllowedComp: allowedUserCompReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
