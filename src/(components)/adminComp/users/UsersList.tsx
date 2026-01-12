"use client";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useCompAlert } from "@/hooks/useCompAlert";
import Image from "next/image";

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

  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);

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

  return (
    <div className="flex w-[80rem] flex-col mt-4">
      {data.map((user) => (
        <button className="flex btn select-none justify-between items-center bg-white/80 text-black p-2 flex-row m-1.5 rounded-lg" key={user.id}>
          <Image
            className="rounded-lg"
            src={user.image}
            alt="User Image"
            width={50}
            height={50}
          />
          <h3>{user.name}</h3>
          <h3>
            {
              user.memberStatusLogs[user.memberStatusLogs.length - 1]?.status
                ?.name ?? "No Status"
            }
          </h3>
        </button>
      ))}
    </div>
  );
}

export default UsersList;
