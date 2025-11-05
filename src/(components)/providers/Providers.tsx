"use client";

import AuthProvider from "@/(components)/providers/authProvider";
import Footer from "../generalComp/Footer";
import Theme from "../generalComp/Theme";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
        <Footer />
        <Theme />
      </AuthProvider>
    </Provider>
  );
};
