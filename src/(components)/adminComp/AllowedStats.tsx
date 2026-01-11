"use client";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useCompAlert } from "@/hooks/useCompAlert";
import { BsFillShieldLockFill } from "react-icons/bs";
import { useRouter } from "next/navigation";

type Data = {
  id: string;
  name: string;
  email: string;
  memberStatusLogs: {
    status: {
      name: string;
    } | null;
  }[];
};

function AllowedStats() {
  const [data, setData] = useState<Data[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/admin/allowedUsers");
      setData(response.data.data);

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
    <>
      <button
        onClick={() => router.push("admin/users")}
        className={`${
          isLoading ? "animate-pulse" : ""
        } flex hover:shadow-lg  hover:opacity-95 transition-all duration-300 btn flex-col select-none w-[10rem] h-[10rem] items-center justify-center mt-0 m-2 text-white pt-0 p-0.5 bg-[#434d5f98] rounded-xl shadow-sm shadow-white `}
      >
        {
          <>
            <BsFillShieldLockFill size={30} className="m-2" />
            <h1
              className={`text-2xl ${
                isLoading ? "animate-spin transition-all duration-300" : ""
              } font-bold m-1`}
            >
              {isLoading ? "." : data.length}
            </h1>
            <h3>Accesses</h3>
          </>
        }
      </button>
    </>
  );
}

export default AllowedStats;
