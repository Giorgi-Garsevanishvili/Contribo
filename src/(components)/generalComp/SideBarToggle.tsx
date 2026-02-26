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
        className={`transition-all hidden duration-300 ${open ? "w-60 md:block" : "w-0 overflow-hidden"}`}
      >
        <div
          className={`${open ? "block" : "hidden"} h-full hidden md:block transition-all duration-300`}
        >
          {sideBar}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto relative h-full">{children}</div>
      <button
        className={`btn ${open ? "left-60" : ""} bottom-3 hidden md:flex absolute bg-gray-600 rounded-lg p-2 border h-fit w-fit text-white`}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <RiSidebarFoldFill size={35} />
        ) : (
          <RiSidebarUnfoldFill size={35} />
        )}
      </button>
    </div>
  );
}

export default SideBarToggle;
