import "../styles/globals.css";
import { Metadata } from "next";
import ConsoleNav from "@/(components)/panelComp/nav";

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
  return (
    <div className="flex flex-grow items-center justify-center transition-all duration-200 flex-col p-0 m-0">
      <ConsoleNav page={"Console"} />
      <div className="flex-grow flex justify-center items-center mt-4 m-0 p-0">
        <main className="flex flex-wrap justify-center m-0 items-center">
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
    </div>
  );
}
