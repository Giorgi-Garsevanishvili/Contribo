"use client";
import { LuUsersRound } from "react-icons/lu";
import { MdOutlineEvent } from "react-icons/md";
import { BiShieldQuarter } from "react-icons/bi";
import { MdOutlineDashboard } from "react-icons/md";
import { HiOutlineHandRaised } from "react-icons/hi2";
import { IoBriefcaseOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import SideBarActionButtons from "./SideBarActionButtons";

function AdminSideBarActions() {
  const currentPath = usePathname();

  return (
    <div className="flex md:flex-col m-0 items-center md:items-start md:justify-between h-fit w-full">
      <div className="pt-4 hidden md:flex pb-2 px-3 text-[10px] font-bold uppercase tracking-widest  text-slate-300">
        Admin Actions
      </div>
      <SideBarActionButtons
        currentPath={currentPath}
        pathCheck="/admin"
        Icon={MdOutlineDashboard}
        title="Home"
        home
      />
      <SideBarActionButtons
        currentPath={currentPath}
        pathCheck="/admin/users"
        Icon={LuUsersRound}
        title="Users"
      />
      <SideBarActionButtons
        currentPath={currentPath}
        pathCheck="/admin/join-requests"
        Icon={HiOutlineHandRaised}
        title="Join Requests"
      />
      <SideBarActionButtons
        currentPath={currentPath}
        pathCheck="/admin/hr-warnings"
        Icon={IoBriefcaseOutline}
        title="HR Cases"
      />
      <SideBarActionButtons
        currentPath={currentPath}
        pathCheck="/admin/events"
        Icon={MdOutlineEvent}
        title="Events"
      />
      <SideBarActionButtons
        currentPath={currentPath}
        pathCheck="/admin/accesses"
        Icon={BiShieldQuarter}
        title="Accesses"
      />
    </div>
  );
}

export default AdminSideBarActions;
