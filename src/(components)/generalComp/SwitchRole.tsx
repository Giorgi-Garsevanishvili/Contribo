"use client";
import { normalizePage, ROLE_ROUTE_MAP } from "@/lib/roleRoutes";
import SwitchPageButton from "./SwitchPageButton";
import { Session } from "next-auth";
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

function SwitchRole({
  page,
  session,
}: {
  page: string;
  session: Session | null;
}) {
  const currentRole = normalizePage(page);
  const [openToggle, setOpenToggle] = useState(false);

  return (
    <div className="flex justify-center items-center flex-col w-full h-fit relative">
      <button
        onClick={() => setOpenToggle(!openToggle)}
        className={`btn ${openToggle ? "bg-gray-100/90" : "text-white bg-gray-500/65"} m-0 flex px-6 py-1 transition-all duration-500 uppercase items-center justify-center   text-lg shadow-inner shadow-gray-600 rounded-md mt-1 select-none gap-3  `}
      >
        {page}
        {openToggle ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </button>
      <div
        className={`${openToggle ? "flex" : "hidden"} absolute items-center -bottom-15 justify-center w-fit mt-0.5 h-fit p-1 border border-gray-800/30 transition-all duration-300 gap-1 bg-gray-200 shadow-2xl shadow-gray-500 rounded-md`}
      >
        {session?.user.roles
          ?.filter((role) => ROLE_ROUTE_MAP[role] !== currentRole)
          .map((role) => (
            <SwitchPageButton key={role} name={role} />
          ))}
      </div>
    </div>
  );
}

export default SwitchRole;
