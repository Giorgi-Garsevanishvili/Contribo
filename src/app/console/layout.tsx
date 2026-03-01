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
  allowedUsers,
  eventRoles,
  hrWarningType,
  memberStatus,
  positions,
  roles,
  regions,
}: {
  children: React.ReactNode;
  allowedUsers: React.ReactNode;
  eventRoles: React.ReactNode;
  memberStatus: React.ReactNode;
  positions: React.ReactNode;
  roles: React.ReactNode;
  hrWarningType: React.ReactNode;
  regions: React.ReactNode;
}) {
  await requireRole("QIRVEX");

  return (
    <div className="flex h-full w-full grow items-start justify-start transition-all duration-200 p-0 m-0">
      <ConfirmTab />

      <SideBarToggle sideBar={<SideBar page="CONSOLE" />}>
        <div className="grow w-full flex flex-col justify-center items-center mb-22 md:mb-0 m-0 p-0">
          <NavBar page="CONSOLE" />
          <WelcomeBar />
          <main className="flex flex-wrap justify-center min-h-full m-0 items-center">
            <CompAlert />
            {children}
            {allowedUsers}
            {eventRoles}
            {hrWarningType}
            {memberStatus}
            {positions}
            {roles}
            {regions}
          </main>
        </div>
        <MobileBar page="CONSOLE" />
      </SideBarToggle>
    </div>
  );
}
