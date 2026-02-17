"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFetchData } from "@/hooks/useDataFetch";
import { FcDeleteDatabase } from "react-icons/fc";

type Data = {
  id: string;
  name: string;
  email: string;
  image: string;
  memberStatusLogs: {
    status: {
      name: string;
    } | null;
  }[];
};

function UsersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [list, setList] = useState<Data[]>([]);

  const { data, isLoadingFetch } = useFetchData<Data[]>(`/api/admin/users`, []);

  useEffect(() => {
    if (data) {
      setList(data);
    }
  }, [data]);

  const filteredData = list?.filter((item) => {
    const value = item["name" as keyof typeof item];

    if (typeof value !== "string") return false;

    return searchTerm === ""
      ? true
      : value.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div
      className={`flex ${
        isLoadingFetch
          ? "w-30 h-30 items-center justify-center"
          : " w-auto"
      } flex-col mt-4 shadow-sm bg-gray-200/45  rounded-lg p-1.5 select-none`}
    >
      <div
        className={` ${
          isLoadingFetch ? "hidden" : "flex"
        } w-full items-center mt-1 justify-center`}
      >
        <input
          className="flex text-sm w-full bg-gray-300 text-black input-def"
          type="text"
          name="search"
          placeholder={`Find by Name`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {isLoadingFetch ? (
        <h2
          className={`text-sm text-black ${
            isLoadingFetch ? "animate-spin transition-all duration-300" : ""
          } font-bold`}
        >
          .
        </h2>
      ) : filteredData.length > 0 ? (
        filteredData.map((user) => (
          <button
            onClick={() => router.push(`/admin/users/${user.id}`)}
            className="flex btn select-none text-sm justify-between items-center bg-white/80 text-black p-2 flex-row m-1 rounded-lg"
            key={user.id}
          >
            <div className="flex justify-center items-center">
              {user.image ? (
                <Image
                  priority
                  className="rounded-lg mr-3"
                  src={user.image}
                  alt="User Image"
                  width={35}
                  height={35}
                />
              ) : (
                <FcDeleteDatabase className="mr-2" size={25} />
              )}

              <h3 className="text-sm font-medium flex overflow-hidden">
                {user.name}
              </h3>
            </div>
            <div className="md:flex hidden items-center pl-20 pr-5 justify-start">
              <h3 className="font-medium">
                {!user.name.startsWith("deleted")
                  ? `Membership: ${
                      user.memberStatusLogs[user.memberStatusLogs.length - 1]
                        ?.status?.name ?? "No Status"
                    }`
                  : ""}
              </h3>
            </div>
          </button>
        ))
      ) : (
        "Users not found"
      )}
    </div>
  );
}

export default UsersList;
