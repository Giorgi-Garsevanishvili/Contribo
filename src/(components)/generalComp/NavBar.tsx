"use client";
import Image from "next/image";
import SignOut from "../authComp/sign-out";
import SwitchRole from "./SwitchRole";
import { useSession } from "next-auth/react";

function NavBar({ page }: { page: string }) {
  const session = useSession();
  
  return (
    <nav className="flex w-svw z-200 md:hidden flex-col mb-2 items-center justify-center p-2">
      <div className="flex items-center justify-between p-4 flex-row shadow-md bg-gray-700/70 w-auto h-15 rounded-lg">
        <div className="flex flex-row items-center justify-between p-3 min-w-30 text-white">
          {session?.data?.user.image ? (
            <Image
              priority
              className="rounded-2xl"
              src={`${session?.data?.user.image}`}
              width={37}
              height={37}
              alt="user-photo"
            />
          ) : null}
          <div className="grid truncate content-center items-center p-3 min-w-30 select-none text-white">
            <h2 className="flex truncate min-w-0">
              {session?.data?.user.name}
            </h2>
            {
              <h2 className="text-xs items-center justify-center w-full mt-1 italic text-gray-200 flex">
                Region:{" "}
                {session?.data?.user.region
                  ? session?.data?.user.region
                  : "No Region"}
              </h2>
            }
          </div>
          <SignOut />
        </div>
      </div>
      <div className="flex gap-2 items-start justify-center w-fit">
        <SwitchRole page={page} session={session.data} />
      </div>
    </nav>
  );
}

export default NavBar;
