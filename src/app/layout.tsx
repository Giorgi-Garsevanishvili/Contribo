import "../app/styles/globals.css";
import { Metadata } from "next";
import { Providers } from "@/(components)/providers/Providers";

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
    <html lang="en">
      <body className="flex layout-body flex-col w-full min-h-screen">
        <Providers>
          <main className="flex flex-grow transition-all duration-200 justify-center items-center flex-col p-0 m-0 w-full min-h-full overflow-auto">
            {children}
            {/* <div className="flex flex-row">
              <p className="flex max-w-40 text-wrap  p-3 h-auto items-center justify-center text-center bg-[#34495e]">
                Primary text / title #34495e
              </p>
              <p className="flex max-w-40 text-wrap  p-3 h-auto items-center justify-center text-center bg-[#7f8c8d]">
                Secondary text #7f8c8d
              </p>
              <p className="flex max-w-40 text-wrap  p-3 h-auto items-center justify-center text-center hover:bg-[#3498db] bg-[#2980b9]">
                Accent / link #2980b9 → hover #3498db
              </p>
              <p className="flex max-w-40 text-wrap  p-3 h-auto items-center justify-center text-center bg-[#2C3440]">
                Card / container base #2C3440
              </p>
              <p className="flex max-w-40 text-wrap  p-3 h-auto items-center justify-center text-center bg-[#4A90E2]">
                Hover / focus highlight #4A90E2
              </p>
              <p className="flex max-w-40 text-wrap  p-3 h-auto items-center justify-center text-center bg-[#1ABC9C]">
                Accent / confirm (success) #5FC98B
              </p>
              <p className="flex max-w-40 text-wrap  p-3 h-auto items-center justify-center text-center bg-[#E74C3C]">
               Delete / Error #E74C3C
              </p>
              <p className="flex max-w-40 text-wrap  p-3 h-auto items-center justify-center text-center bg-[#F39C12]">
               Warnings / active icon #F39C12</p>
              <p className="flex max-w-40 text-wrap  p-3 h-auto items-center justify-center text-center bg-[#212833]">
                Comp BG #212833
              </p>
            </div> */}
          </main>
        </Providers>
      </body>
    </html>
  );
}
