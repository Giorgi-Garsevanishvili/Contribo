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
    <div className="flex flex-col items-start justify-between h-fit w-full">
      <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-widest  text-slate-300">
        Admin Actions
      </div>
      <Link
        className={`flex ${currentPath === "/admin" ? "bg-white text-primary" : ""} items-center w-full gap-3 mb-0.5 px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-black transition-colors group`}
        href="/admin"
      >
        <span className="material-symbols-outlined text-[20px]">
          <MdOutlineDashboard size={25} />
        </span>
        <span className="text-sm font-medium">Dashboard</span>
      </Link>
      <Link
        className={`flex ${currentPath.startsWith("/admin/users") ? "bg-white text-primary" : ""} items-center w-full gap-3 mb-0.5 px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-black transition-colors group`}
        href="/admin/users"
      >
        <span className="material-symbols-outlined text-[20px]">
          <LuUsersRound size={25} />
        </span>
        <span className="text-sm font-medium">Users</span>
      </Link>
      <Link
        className={`flex ${currentPath.startsWith("/admin/join-requests") ? "bg-white text-primary" : ""} items-center w-full gap-3 mb-0.5 px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-black transition-colors group`}
        href="/admin/join-requests"
      >
        <span className="material-symbols-outlined text-[20px]">
          <HiOutlineHandRaised size={25} />
        </span>
        <span className="text-sm font-medium">Join Requests</span>
      </Link>
      <Link
        className={`flex ${currentPath.startsWith("/admin/hr-warnings") ? "bg-white text-primary" : ""} items-center w-full gap-3 mb-0.5 px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-black transition-colors group`}
        href="/admin/hr-warnings"
      >
        <span className="material-symbols-outlined text-[20px]">
          <IoBriefcaseOutline size={25} />
        </span>
        <span className="text-sm font-medium">HR Cases</span>
      </Link>
      <Link
        className={`flex ${currentPath.startsWith("/admin/events") ? "bg-white text-primary" : ""} items-center w-full gap-3 mb-0.5 px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-black transition-colors group`}
        href="/admin/events"
      >
        <span className="material-symbols-outlined text-[20px]">
          <MdOutlineEvent size={25} />
        </span>
        <span className="text-sm font-medium">Events</span>
      </Link>
      <Link
        className={`flex ${currentPath.startsWith("/admin/accesses") ? "bg-white text-primary" : ""} items-center w-full gap-3 mb-0.5 px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-black transition-colors group`}
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
