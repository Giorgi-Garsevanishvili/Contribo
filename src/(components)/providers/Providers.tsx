"use client";

import Theme from "../generalComp/Theme";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { ModalProvider } from "../../../context/ModalContext";
import GeneralModal from "../generalComp/GeneralModal";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <ModalProvider>
        <GeneralModal />
        {children}
        <Theme />
      </ModalProvider>
    </Provider>
  );
};
