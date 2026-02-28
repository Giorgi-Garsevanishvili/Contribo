"use client";
import { LuUsersRound } from "react-icons/lu";
import { MdOutlineEvent } from "react-icons/md";
import { BiShieldQuarter } from "react-icons/bi";
import { MdOutlineDashboard } from "react-icons/md";
import { HiOutlineHandRaised } from "react-icons/hi2";
import { IoBriefcaseOutline } from "react-icons/io5";

import Link from "next/link";
import { usePathname } from "next/navigation";

function AdminSideBarActions() {
  const currentPath = usePathname();

  return (
    <div className="flex md:flex-col items-center md:items-start md:justify-between h-fit w-full">
      <div className="pt-4 hidden md:flex pb-2 px-3 text-[10px] font-bold uppercase tracking-widest  text-slate-300">
        Admin Actions
      </div>
      <Link
        className={`flex px-4 md:ring-0 ring-1 ring-gray-300/30 text-center  md:flex-row flex-col ${currentPath === "/admin" ? "bg-white text-primary" : "bg-gray-600"} items-center w-full md:gap-3 p-2 m-0.5 md:mb-0.5 px-4 md:px-3 md:py-2 rounded-lg hover:bg-slate-100 hover:text-black transition-colors  bg-gray-700/95 group`}
        href="/admin"
      >
        <span className="material-symbols-outlined text-[20px]">
          <MdOutlineDashboard size={25} />
        </span>
        <span className="text-sm font-medium">Home</span>
      </Link>
      <Link
        className={`flex px-4 md:ring-0 ring-1 ring-gray-300/30 text-center  md:flex-row flex-col ${currentPath.startsWith("/admin/users") ? "bg-white text-primary" : "bg-gray-600"} items-center w-full md:gap-3 p-2 m-0.5 md:mb-0.5 px-4 md:px-3 md:py-2 rounded-lg hover:bg-slate-100 hover:text-black transition-colors  bg-gray-700/95 group`}
        href="/admin/users"
      >
        <span className="material-symbols-outlined text-[20px]">
          <LuUsersRound size={25} />
        </span>
        <span className="text-sm font-medium">Users</span>
      </Link>
      <Link
        className={`flex px-4 md:ring-0 ring-1 ring-gray-300/30 text-center  md:flex-row flex-col ${currentPath.startsWith("/admin/join-requests") ? "bg-white text-primary" : "bg-gray-600"} items-center w-full md:gap-3 p-2 m-0.5 md:mb-0.5 px-4 md:px-3 md:py-2 rounded-lg hover:bg-slate-100 hover:text-black transition-colors  bg-gray-700/95 group`}
        href="/admin/join-requests"
      >
        <span className="material-symbols-outlined text-[20px]">
          <HiOutlineHandRaised size={25} />
        </span>
        <span className="text-sm hidden md:flex font-medium">
          Join Requests
        </span>
        <span className="text-sm flex md:hidden font-medium">Joins</span>
      </Link>
      <Link
        className={`flex px-4 md:ring-0 ring-1 ring-gray-300/30 text-center  md:flex-row flex-col ${currentPath.startsWith("/admin/hr-warnings") ? "bg-white text-primary" : "bg-gray-600"} items-center w-full md:gap-3 p-2 m-0.5 md:mb-0.5 px-4 md:px-3 md:py-2 rounded-lg hover:bg-slate-100 hover:text-black transition-colors  bg-gray-700/95 group`}
        href="/admin/hr-warnings"
      >
        <span className="material-symbols-outlined text-[20px]">
          <IoBriefcaseOutline size={25} />
        </span>
        <span className="text-sm hidden md:flex font-medium">HR Cases</span>
        <span className="text-sm flex md:hidden font-medium">Cases</span>
      </Link>
      <Link
        className={`flex px-4 md:ring-0 ring-1 ring-gray-300/30 text-center  md:flex-row flex-col ${currentPath.startsWith("/admin/events") ? "bg-white text-primary" : "bg-gray-600"} items-center w-full md:gap-3 p-2 m-0.5 md:mb-0.5 px-4 md:px-3 md:py-2 rounded-lg hover:bg-slate-100 hover:text-black transition-colors  bg-gray-700/95 group`}
        href="/admin/events"
      >
        <span className="material-symbols-outlined text-[20px]">
          <MdOutlineEvent size={25} />
        </span>
        <span className="text-sm font-medium">Events</span>
      </Link>
      <Link
        className={`flex px-4 md:ring-0 ring-1 ring-gray-300/30 text-center  md:flex-row flex-col ${currentPath.startsWith("/admin/accesses") ? "bg-white text-primary" : "bg-gray-600"} items-center w-full md:gap-3 p-2 m-0.5 md:mb-0.5 px-4 md:px-3 md:py-2 rounded-lg hover:bg-slate-100 hover:text-black transition-colors  bg-gray-700/95 group`}
        href="/admin/accesses"
      >
        <span className="material-symbols-outlined text-[20px]">
          <BiShieldQuarter size={25} />
        </span>
        <span className="text-sm font-medium">Accesses</span>
      </Link>
    </div>
  );
}

export default AdminSideBarActions;
