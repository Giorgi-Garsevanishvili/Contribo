"use client";

import AuthProvider from "@/(components)/providers/authProvider";
import Footer from "@/(components)/Footer";
import Theme from "@/(components)/Theme";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      {children}
      <Footer />
      <Theme />
    </AuthProvider>
  );
};
