import "../styles/globals.css";
import { Metadata } from "next";
import { CompAlert } from "@/redux/features/componentAlert/compAlert";
import ConfirmTab from "@/redux/features/confirmationTab/confirmationTab";
import { requireRole } from "@/lib/guards";
import SideBarToggle from "@/(components)/generalComp/SideBarToggle";
import SideBar from "@/(components)/generalComp/SideBar";
import WelcomeBar from "@/(components)/generalComp/WelcomeBar";
import MobileBar from "@/(components)/generalComp/MobileBar";
import NavBar from "@/(components)/generalComp/NavBar";


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
    <div className="flex w-full grow items-center justify-center transition-all duration-200 flex-col p-0 m-0">
      <ConfirmTab />
      <SideBarToggle sideBar={<SideBar page="volunteer" />}>
        <div className="grow w-full flex justify-start items-start mb-22 md:mb-0 m-0 p-0">
          <main className="flex w-full flex-wrap justify-center m-0 items-center">
            <CompAlert />
            <NavBar page="volunteer" />
            <WelcomeBar />
            {children}
          </main>
          <MobileBar page="volunteer" />
        </div>
      </SideBarToggle>
    </div>
  );
}
