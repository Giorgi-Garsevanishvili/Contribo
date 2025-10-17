import "../styles/globals.css";
import { Metadata } from "next";
import AuthProvider from "@/(components)/providers/authProvider";
import Footer from "@/(components)/Footer";
import SignOut from "@/(components)/sign-out";

export const metadata: Metadata = {
  title: "Contribo - by Qirvex™",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/icon1.png", type: "image/png" },
      { url: "/favicon/icon0.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon/apple-icon.png",
  },
  manifest: "/favicon/manifest.json",
  description: "Volunteer Engagement Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col bg-qirvex p-0 m-0 w-screen h-screen ">
        <AuthProvider>
          <div className="flex-grow flex justify-center items-center m-0 p-0">
            {children}
          </div>
          <SignOut />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
