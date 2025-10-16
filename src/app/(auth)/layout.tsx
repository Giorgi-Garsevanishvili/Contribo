import AuthProvider from "@/(components)/providers/authProvider";
import "../styles/globals.css";
import Theme from "@/(components)/Theme";
import Image from "next/image";
import contriboImgQir from "../../../public/Contribo-qirvex-long-no-fill.svg";

export default function LogInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex transition-all duration-200 bg-qirvex-d layout-body justify-center items-center">
        <AuthProvider>
          <div className="flex flex-col transition-all duration-200 justify-center items-center w-screen h-screen m-0 p-0">
            <Image
              className="flex w-75 bg-white/75 rounded-3xl shadow-md shadow-gray-200"
              src={contriboImgQir}
              alt="Contribo by Qirvex™"
            />
            {children}
          </div>
          <Theme />
        </AuthProvider>
      </body>
    </html>
  );
}
