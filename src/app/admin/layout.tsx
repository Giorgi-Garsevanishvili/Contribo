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
      <div className="flex flex-row items-center justify-center">
        <ConsoleNav page={"ADMIN"} />
      </div>
      <div className="flex-grow flex justify-start items-start mt-2 m-0 p-0">
        <main className="flex flex-wrap justify-center m-0 items-center">
          <CompAlert />
          {children}
        </main>
      </div>
    </div>
  );
}
