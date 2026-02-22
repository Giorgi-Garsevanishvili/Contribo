import "../styles/globals.css";
import { Metadata } from "next";
import ConsoleNav from "@/(components)/panelComp/nav";
import { CompAlert } from "@/redux/features/componentAlert/compAlert";
import ConfirmTab from "@/redux/features/confirmationTab/confirmationTab";
import { requireRole } from "@/lib/guards";
import SideBarToggle from "@/(components)/panelComp/SideBarToggle";
import SideBar from "@/(components)/panelComp/SideBar";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("REGULAR");

  return (
    <div className="flex grow items-center justify-center transition-all duration-200 flex-col p-0 m-0">
      <ConfirmTab />
      <div className="grow flex justify-center items-center mt-4 m-0 p-0">
        <SideBarToggle sideBar={<SideBar page="VOLUNTEER" />}>
          <main className="flex flex-wrap justify-center m-0 items-center">
            <CompAlert />
            {children}
          </main>
        </SideBarToggle>
      </div>
    </div>
  );
}
