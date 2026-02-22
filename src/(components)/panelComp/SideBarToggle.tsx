"use client";
import { ReactNode, useState } from "react";
import { RiSidebarUnfoldFill } from "react-icons/ri";
import { RiSidebarFoldFill } from "react-icons/ri";

function SideBarToggle({
  sideBar,
  children,
}: {
  sideBar: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex h-screen w-screen">
      <div
        className={`transition-all duration-300 ${open ? "w-60" : "w-0 overflow-hidden"}`}
      >
        <div
          className={`${open ? "block" : "hidden"} h-full transition-all duration-300`}
        >
          {sideBar}
        </div>
      </div>
      <button
        className="btn sticky mr-4 bg-gray-600 rounded-lg p-1 h-fit w-fit text-white"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <RiSidebarFoldFill size={35} />
        ) : (
          <RiSidebarUnfoldFill size={35} />
        )}
      </button>
      <div className="flex-1 overflow-y-auto relative">{children}</div>
    </div>
  );
}

export default SideBarToggle;
