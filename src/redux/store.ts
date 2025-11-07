import { configureStore } from "@reduxjs/toolkit";
import { allowedUserCompReducer } from "./features/allowedUsers/allowedRoleSlice";
import { componentAlertReducer } from "./features/componentAlert/componentAlertSlice";

export const store = configureStore({
  reducer: {
    AllowedComp: allowedUserCompReducer,
    componentAlert: componentAlertReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
