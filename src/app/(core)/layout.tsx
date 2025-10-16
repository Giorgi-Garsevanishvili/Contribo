import "../styles/globals.css";
import { Metadata } from "next";
import AuthProvider from "@/(components)/providers/authProvider";
import Footer from "@/(components)/Footer";
import Theme from "@/(components)/Theme";

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
      <body className="flex layout-body transition-all duration-200 bg-qirvex-d flex-col p-0 m-0 w-screen min-h-screen overflow-auto ">
        <AuthProvider>
          <div className="flex-grow flex justify-center items-center m-0 p-0">
            {children}
          </div>
          <Theme />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
