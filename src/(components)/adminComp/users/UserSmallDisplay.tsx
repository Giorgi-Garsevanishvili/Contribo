import Image from "next/image";
import React from "react";

type UserResponse = {
  name?: string | null;
  image?: string | null;
  visualBar?: boolean;
};

function UserSmallDisplay({ user }: { user: UserResponse }) {
  return (
    <div className="flex group cursor-default items-center gap-3 rounded whitespace-nowrap">
      {user.image && (
        <Image
          src={user.image}
          alt={user.name ?? ""}
          width={25}
          height={25}
          className={`rounded-full ${user.visualBar ? "ring-2 ring-orange-300" : ""}  cursor-pointer select-none`}
        />
      )}
      {user.visualBar && (
        <div className="absolute left-0 top-full z-50 mt-1 hidden rounded bg-black px-2 py-1 text-xs text-white shadow-md group-hover:block">
          {user.name}
        </div>
      )}

      {!user.visualBar && (
        <span className="whitespace-nowrap truncate">{user.name}</span>
      )}
    </div>
  );
}

export default UserSmallDisplay;
