"use client"
import { MdOutlineDashboard } from "react-icons/md";

import Link from "next/link";
import { usePathname } from "next/navigation";

function ConsoleSideBarActions() {
  const currentPath = usePathname();
  return (
    <div className="flex md:flex-col md:items-start md:justify-start w-full">
      <div className="pt-4 hidden md:flex pb-2 px-3 text-[10px] font-bold uppercase tracking-widest  text-slate-300">
        Console Actions
      </div>
      <Link
        className={`flex ${currentPath === "/console" ? "bg-white text-primary" : ""} items-center w-full gap-3 mb-0.5 px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-black transition-colors group`}
        href="/console"
      >
        <span className="material-symbols-outlined text-[20px]">
          <MdOutlineDashboard size={25} />
        </span>
        <span className="text-sm font-medium">Dashboard</span>
      </Link>
    </div>
  );
}

export default ConsoleSideBarActions;
