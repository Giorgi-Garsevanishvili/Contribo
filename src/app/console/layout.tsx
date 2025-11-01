import "../styles/globals.css";
import { Metadata } from "next";
import AuthProvider from "@/(components)/providers/authProvider";
import Footer from "@/(components)/Footer";
import Theme from "@/(components)/Theme";
import ConsoleNav from "@/(components)/nav";

export const metadata: Metadata = {
  title: "Console - Contribo - by Qirvex™",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/icon1.png", type: "image/png" },
      { url: "/favicon/icon0.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon/apple-icon.png",
  },
  manifest: "/favicon/manifest.json",
  description: " Console - Volunteer Engagement Platform",
};

export default function RootLayout({
  children,
  allowedUsers,
}: {
  children: React.ReactNode;
  allowedUsers: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex layout-body items-center transition-all duration-200 bg-qirvex-d flex-col bg-qirvex p-0 m-0 w-screen h-screen ">
        <AuthProvider>
          <ConsoleNav page={"Console"} />
          <div className="flex-grow flex justify-center items-start mt-15 m-0 p-0">
            <main>
              {children}
              {allowedUsers}
            </main>
          </div>
          <Theme />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
