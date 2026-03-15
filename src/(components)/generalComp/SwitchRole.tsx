"use client";
import { normalizePage, ROLE_ROUTE_MAP } from "@/lib/roleRoutes";
import SwitchPageButton from "./SwitchPageButton";
import { Session } from "next-auth";
import { useState } from "react";

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
    <div className="flex flex-col w-full h-fit">
      <button
        onClick={() => setOpenToggle(!openToggle)}
        className={`btn ${openToggle ? " bg-gray-100/90 text-gray-600 border-gray-300/60" : "text-white bg-gray-500/65"} m-0 flex  px-10 py-1 transition-all shadow-sm duration-300 uppercase items-center justify-center  text-lg rounded-b-md rounded-t-none shadow-white select-none  `}
      >
        Switch Role
      </button>
      <div
        className={`${openToggle ? "flex" : "hidden"} w-full items-center justify-center mt-0.5 h-fit p-1 border border-gray-950/40 transition-all duration-300 gap-1 bg-gray-400/90 rounded-md`}
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
