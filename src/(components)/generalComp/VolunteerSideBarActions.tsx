"use client";
import { LuUserRound } from "react-icons/lu";
import { MdOutlineEvent, MdOutlineRateReview } from "react-icons/md";
import { MdOutlineDashboard } from "react-icons/md";
import { IoBriefcaseOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import SideBarActionButtons from "./SideBarActionButtons";

function VolunteerSideBarActions() {
  const currentPath = usePathname();

  return (
    <div className="flex md:flex-col m-0 items-center md:items-start md:justify-between h-fit w-full">
      <div className="pt-4 hidden md:flex pb-2 px-3 text-[10px] font-bold uppercase tracking-widest  text-slate-300">
        Admin Actions
      </div>
      <SideBarActionButtons
        currentPath={currentPath}
        pathCheck="/volunteer"
        Icon={MdOutlineDashboard}
        title="Home"
        home
      />

      <SideBarActionButtons
        currentPath={currentPath}
        pathCheck="/volunteer/events"
        Icon={MdOutlineEvent}
        title="Events"
      />

      <SideBarActionButtons
        currentPath={currentPath}
        pathCheck="/volunteer/myEventFeedbacks"
        Icon={MdOutlineRateReview}
        title="Event Feedbacks"
      />

      <SideBarActionButtons
        currentPath={currentPath}
        pathCheck="/volunteer/hrCases"
        Icon={IoBriefcaseOutline}
        title="HR Cases"
      />

      <SideBarActionButtons
        currentPath={currentPath}
        pathCheck="/volunteer/myProfile"
        Icon={LuUserRound}
        title="My Profile"
      />
    </div>
  );
}

export default VolunteerSideBarActions;
