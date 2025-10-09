import Nav from "@/(components)/Nav";
import "../styles/globals.css";
import { Metadata } from "next";
import AuthProvider from "@/(components)/providers/authProvider";

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
      <body>
        <AuthProvider>
          <Nav />
          <div className="flex justify-center items-center w-screen h-screen m-0 p-0">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
