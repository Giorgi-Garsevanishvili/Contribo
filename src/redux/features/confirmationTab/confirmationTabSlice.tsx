import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConfirmProp } from "./confirmationTab";
import { RootState } from "@/redux/store";

const initialState = {
  title: "",
  message: "",
  opt1: "Yes",
  opt2: "No",
  isOpened: false,
  confirmed: false,
} as ConfirmProp;

const ConfirmationTabSlice = createSlice({
  name: "confirmTab",
  initialState,
  reducers: {
    confirm(state) {
      state.confirmed = true;
      state.isOpened = false
    },
    terminate(state) {
      state.confirmed = false;
      state.isOpened = false;
    },
    setConfirmTab(state, action: PayloadAction<ConfirmProp>) {
      return { ...state, ...action.payload };
    },
    closeConfirmTab(state) {
      state.isOpened = false;
      state.confirmed = false;
    },
  },
});

export const ConfirmTabState = (state: RootState) => state.confirmTab;
export const { setConfirmTab, closeConfirmTab, terminate, confirm } =
  ConfirmationTabSlice.actions;
export const ConfirmTabReducer = ConfirmationTabSlice.reducer;
export const ConfirmedState = (state: RootState) => state.confirmTab.confirmed;
