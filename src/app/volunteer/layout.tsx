import "../styles/globals.css";
import { Metadata } from "next";
import ConsoleNav from "@/(components)/panelComp/nav";
import { CompAlert } from "@/redux/features/componentAlert/compAlert";
import ConfirmTab from "@/redux/features/confirmationTab/confirmationTab";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-grow items-center justify-center transition-all duration-200 flex-col p-0 m-0">
      <ConfirmTab />
      <ConsoleNav page={"volunteer"} />
      <div className="flex-grow flex justify-center items-center mt-4 m-0 p-0">
        <main className="flex flex-wrap justify-center m-0 items-center">
          <CompAlert />
          {children}
        </main>
      </div>
    </div>
  );
}
