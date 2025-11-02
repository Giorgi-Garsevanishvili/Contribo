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
    
      <div className="flex flex-grow items-center justify-center transition-all duration-200 flex-col p-0 m-0">
        <ConsoleNav page={"Console"} />
        <div className="flex-grow flex justify-center items-center mt-10 m-0 p-0">
          <main>
            {children}
            {allowedUsers}
          </main>
        </div>
      </div>
  
  );
}
