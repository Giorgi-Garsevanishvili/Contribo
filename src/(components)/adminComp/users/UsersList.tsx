"use client";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useCompAlert } from "@/hooks/useCompAlert";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Data[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);
  const router = useRouter();
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/admin/users");
      setData(response.data.data);
      console.log(response.data.data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      triggerCompAlertRef.current({
        message: `${error}`,
        type: "error",
        isOpened: true,
      });
    }
    return;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
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
      } flex-col mt-4 shadow-sm bg-gray-200/45  rounded-lg p-1.5 select-none`}
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
        <h2
          className={`text-sm text-black ${
            isLoading ? "animate-spin transition-all duration-300" : ""
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
              <Image
                priority
                className="rounded-lg mr-3"
                src={user.image}
                alt="User Image"
                width={35}
                height={35}
              />
              <h3 className="text-sm font-medium">{user.name}</h3>
            </div>
            <div className="md:flex hidden items-center pl-20 pr-5 justify-start">
              <h3 className="font-medium">
                {`Membership: ${
                  user.memberStatusLogs[user.memberStatusLogs.length - 1]
                    ?.status?.name ?? "No Status"
                }`}
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
