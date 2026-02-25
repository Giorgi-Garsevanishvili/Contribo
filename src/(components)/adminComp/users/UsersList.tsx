"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFetchData } from "@/hooks/useDataFetch";
import { FcDeleteDatabase } from "react-icons/fc";
import { IoMdGlobe } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import usePaginatedData from "@/hooks/usePaginatedData";
import { ImSpinner9 } from "react-icons/im";

type Data = {
  id: string;
  name: string;
  email: string;
  image: string;
  rating: number;
  ownAllowance: {
    region: { name: string };
    roles: { role: { name: string } }[];
  };
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

  const { data, isLoading } = usePaginatedData<Data[]>(`/api/admin/users`, []);

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
        isLoading ? "w-30 h-30 items-center justify-center" : " w-auto"
      } flex-col mt-4 shadow-sm bg-gray-300/90  rounded-lg p-1.5 select-none`}
    >
      <div
        className={` ${
          isLoading ? "hidden" : "flex"
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
      {isLoading ? (
        <div
          className={`text-sm text-black ${
            isLoading ? "animate-spin transition-all duration-300" : ""
          } font-bold`}
        >
          <ImSpinner9 className="animate-spin" size={25} />
        </div>
      ) : filteredData.length > 0 ? (
        <>
          <div className="grid font-bold text-sm grid-cols-5 gap-4 uppercase grid-rows-1 select-none justify-start items-center bg-gray-100/80 text-gray-700 p-2 m-1 rounded-lg">
            <h3 className="flex justify-start items-center">Name & Email</h3>
            <div className="grid grid-cols-2 gap-2 justify-start items-center">
              <h3 className=" flex overflow-hidden">MemberShip</h3>
            </div>
            <div className="md:flex hidden">
              <h3 className="font-medium">Region</h3>
            </div>
            <div className="md:flex hidden">
              <h3 className="font-medium">Role</h3>
            </div>
            <div className="md:flex hidden">
              <h3 className="font-medium">Rating</h3>
            </div>
          </div>
          {filteredData.map((user) => (
            <button
              onClick={() => router.push(`/admin/users/${user.id}`)}
              className="grid grid-cols-5 gap-4 grid-rows-1 btn select-none text-sm justify-start items-center bg-white/80 text-black p-2 m-1 rounded-lg"
              key={user.id}
            >
              <div className="flex justify-start items-center">
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
                <div className="flex justify-start flex-col truncate px-2 py-1.5">
                  <h3 className="text-sm font-bold flex overflow-hidden truncate">
                    {user?.name && user.name.length > 30
                      ? ` ${user.name.slice(0, 30)}...`
                      : user
                        ? ` ${user.name}`
                        : "No Data"}
                  </h3>
                  <h3 className="flex truncate text-xs text-gray-600">
                    {user.email}
                  </h3>
                </div>
              </div>

              <div className="md:flex hidden truncate">
                <h3 className="font-medium bg-gray-300/40 items-center justify-center flex w-1/2 rounded-sm py-1.5 border border-gray-400/50 truncate">
                  {!user.name.startsWith("deleted")
                    ? ` ${
                        user.memberStatusLogs[user.memberStatusLogs.length - 1]
                          ?.status?.name ?? "No Status"
                      }`
                    : ""}
                </h3>
              </div>

              <div className="md:flex hidden jus items-center gap-1.5">
                <IoMdGlobe size={18} className="text-gray-500" />
                <h3 className="font-medium truncate">
                  {user.ownAllowance.region.name}
                </h3>
              </div>

              <div className="md:flex hidden">
                <div className="font-medium flex gap-2 truncate">
                  {user.ownAllowance.roles.map((role, index) => (
                    <h2
                      key={index}
                      className="rounded-lg border px-1.5 py-0.5 bg-gray-300/50 border-gray-500/50"
                    >
                      {role.role.name}
                    </h2>
                  ))}
                </div>
              </div>

              <div className="md:flex hidden font-bold items-start justify-start">
                <FaStar size={18} className="text-yellow-500" />
                <h3 className=" ml-2">{user.rating}</h3>
              </div>
            </button>
          ))}
        </>
      ) : (
        "Users not found"
      )}
    </div>
  );
}

export default UsersList;
