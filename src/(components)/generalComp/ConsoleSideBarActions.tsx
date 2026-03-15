"use client";
import { MdOutlineDashboard } from "react-icons/md";
import { usePathname } from "next/navigation";
import SideBarActionButtons from "./SideBarActionButtons";

function ConsoleSideBarActions() {
  const currentPath = usePathname();
  return (
    <div className="flex md:flex-col md:items-start md:justify-start w-full">
      <div className="pt-4 hidden md:flex pb-2 px-3 text-[10px] font-bold uppercase tracking-widest  text-slate-300">
        Console Actions
      </div>
      <SideBarActionButtons
        currentPath={currentPath}
        pathCheck="/console"
        Icon={MdOutlineDashboard}
        title="Dashboard"
      />
    </div>
  );
}

export default ConsoleSideBarActions;
