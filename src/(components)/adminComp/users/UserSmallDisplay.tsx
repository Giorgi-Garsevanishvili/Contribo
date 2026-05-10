import Image from "next/image";
import React from "react";

type UserResponse = {
  name: string | null;
  image: string | null;
};

function UserSmallDisplay({ user }: { user: UserResponse }) {
  return (
    <div className="flex cursor-default items-center gap-3 rounded hover:bg-gray-700 whitespace-nowrap">
      {user.image && (
        <Image
          src={user.image}
          alt={user.name ?? ""}
          width={20}
          height={20}
          className="rounded-full select-none"
        />
      )}

      <span className="whitespace-nowrap">{user.name}</span>
    </div>
  );
}

export default UserSmallDisplay;
