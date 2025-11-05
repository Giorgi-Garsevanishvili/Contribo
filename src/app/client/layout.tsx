import SignOut from "@/(components)/authComp/sign-out";
import "../styles/globals.css";
import { Metadata } from "next";

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
    <body className="flex flex-col p-0 m-0">
      <div className="flex-grow flex justify-center items-center m-0 p-0">
        {children}
      </div>
      <SignOut />
    </body>
  );
}
