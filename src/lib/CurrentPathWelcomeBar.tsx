"use client";

import BackButton from "@/(components)/generalComp/BackButton";
import { usePathname } from "next/navigation";

const WelcomePath = ["/admin", "/console", "/volunteer"];
const lowerPath = ["/admin/", "/volunteer/"];

function CurrentPathWelcomeBar() {
  const currentPath = usePathname();

  const getTitle = () => {
    if (
      WelcomePath.values().some((val: string) => val === currentPath) ||
      currentPath.startsWith("/console")
    ) {
      return (
        <div className="flex flex-col items-start">
          <span className="text-xl font-bold ">Dashboard</span>
          <h1 className=" text-sm m-0 font-medium text-gray-300 select-none ">
            <span className=" font-sans ">Welcome Back To </span>
            Qirvex
            <span className="text-xs absolute font-bold text-[#b1d5ed]">™</span>
            <span className="font-sans ml-3 ">Platforms</span>
          </h1>
        </div>
      );
    } else if (
      lowerPath.values().some((val: string) => currentPath.startsWith(val))
    ) {
      return (
        <div className="flex items-center justify-start gap-3">
          <BackButton />
          <h2 className="font-bold text-xl">
            {currentPath.startsWith("/admin/hr-warnings")
              ? "HR Cases"
              : currentPath.startsWith("/admin/users")
                ? "User Management"
                : currentPath.startsWith("/admin/join-requests")
                  ? "Joint Requests"
                  : currentPath.startsWith("/admin/events")
                    ? "Event Management"
                    : currentPath.startsWith("/admin/accesses")
                      ? "Access Management"
                      : ""}
          </h2>
        </div>
      );
    }
    return;
  };

  return <span>{getTitle()}</span>;
}

export default CurrentPathWelcomeBar;
