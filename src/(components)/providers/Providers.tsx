"use client";


import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { ModalProvider } from "../../../context/ModalContext";
import GeneralModal from "../generalComp/GeneralModal";
import ThemeToggle from "../generalComp/ThemeToggle";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <ModalProvider>
        <GeneralModal />
        {children}
        <ThemeToggle />
      </ModalProvider>
    </Provider>
  );
};
