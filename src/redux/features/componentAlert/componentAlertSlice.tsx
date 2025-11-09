import { AlertType } from "@/(components)/generalComp/Alerts";
import { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  type: "success",
  isOpened: false,
} as AlertType;

const componentAlertSlice = createSlice({
  name: "componentAlert",
  initialState,
  reducers: {
    setCompAlert(state, action: PayloadAction<AlertType>) {
      return { ...state, ...action.payload };
    },
    closeAlert(state) {
      state.isOpened = false;
    },
  },
});

export const alertState = (state: RootState) => state.componentAlert;
export const { setCompAlert, closeAlert } = componentAlertSlice.actions;
export const componentAlertReducer = componentAlertSlice.reducer;

