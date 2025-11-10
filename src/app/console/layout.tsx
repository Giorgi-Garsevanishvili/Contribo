import "../styles/globals.css";
import { Metadata } from "next";
import ConsoleNav from "@/(components)/panelComp/nav";
import MiniDashCard from "@/(components)/panelComp/MiniDashCard";

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
        <main className="flex flex-wrap justify-center items-center">
          {children}
          {allowedUsers}
          <MiniDashCard title={"Default"} searchKey={"name"} dataAddObj={{}} ></MiniDashCard>
          <MiniDashCard title={"Default 2"} searchKey={"name"} dataAddObj={{}} ></MiniDashCard>
          <MiniDashCard title={"Default 3"} searchKey={"name"} dataAddObj={{}} ></MiniDashCard>
          <MiniDashCard title={"Default 3"} searchKey={"name"} dataAddObj={{}} ></MiniDashCard>
        </main>
      </div>
    </div>
  );
}
