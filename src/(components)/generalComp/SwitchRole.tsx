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
    <>
      <button
        onClick={() => setOpenToggle(!openToggle)}
        className="btn absolute h-full rounded-none ml-0 w-20 border-r border-gray-950/40 bg-gray-700/95 rounded-r-md text-[10px] font-bold uppercase tracking-widest text-slate-300 m-0 p-3"
      >
        <h2 className="bg-gray-300 text-gray-950 p-3 rounded-md">Switch Role</h2>
      </button>
      <div
        className={`${openToggle ? "flex" : "hidden"} items-start w-fit h-fit p-1 border border-gray-950/40 left-0.5 transition-all duration-300 gap-1 bg-gray-400/70 rounded-md absolute bottom-20 flex-col `}
      >
        {session?.user.roles
          ?.filter((role) => ROLE_ROUTE_MAP[role] !== currentRole)
          .map((role) => (
            <SwitchPageButton key={role} name={role} />
          ))}
      </div>
    </>
  );
}

export default SwitchRole;
