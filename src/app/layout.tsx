import AuthProvider from "@/(components)/providers/authProvider";
import "../app/styles/globals.css";
import { Metadata } from "next";
import Theme from "@/(components)/Theme";
import Footer from "@/(components)/Footer";

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
      <body className="flex layout-body flex-col w-full min-h-screen">
        <AuthProvider>
          <main className="flex flex-grow transition-all duration-200 justify-center items-center flex-col p-0 m-0 w-screen min-h-full overflow-auto">
            {children}
          </main>
          <Footer />
          <Theme />
        </AuthProvider>
      </body>
    </html>
  );
}
