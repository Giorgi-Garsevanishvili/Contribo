"use client";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useCompAlert } from "@/hooks/useCompAlert";
import { GiHeartInside } from "react-icons/gi";
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

function UserStats() {
  const [data, setData] = useState<Data[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hover, setHover] = useState(false);
  const [statusStats, setStatusStats] = useState<Record<string, number>>({});

  const router = useRouter();

  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/admin/users");
      setData(response.data.data);
      setMemberStatusValues(response.data.data);

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

  const setMemberStatusValues = (value: Data[]) => {
    const stats = value.reduce<Record<string, number>>((acc, user) => {
      user.memberStatusLogs.forEach((log) => {
        const statusName = log.status?.name;
        if (!statusName) return;

        acc[statusName] = (acc[statusName] || 0) + 1;
      });
      return acc;
    }, {});

    setStatusStats(stats);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <button
        onClick={() => router.push("admin/users")}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`${
          isLoading ? "animate-pulse" : ""
        } flex hover:shadow-lg  hover:opacity-95 transition-all duration-300 btn flex-col select-none w-[10rem] h-[10rem] items-center justify-center mt-0 m-2 text-white pt-0 p-0.5 bg-[#434d5f98] rounded-xl shadow-sm shadow-white `}
      >
        {!hover ? (
          <>
            <GiHeartInside size={30} className="m-2" />
            <h1
              className={`text-2xl ${
                isLoading ? "animate-spin transition-all duration-300" : ""
              } font-bold m-1`}
            >
              {isLoading ? "." : data.length}
            </h1>
            <h3>Volunteers</h3>
          </>
        ) : (
          <div className="flex h-full flex-col pt-1.5 transition-all duration-300">
            <h1 className="mb-1">Member Statuses</h1>
            {Object.keys(statusStats).length !== 0 ? (
              Object.entries(statusStats)
                .slice(0, 3)
                .map(([status, count]) => (
                  <div
                    className="mt-1 p-0.5 border-2 rounded-lg text-sm"
                    key={status}
                  >
                    {status} : <span className="font-bold ">{count}</span>
                  </div>
                ))
            ) : (
              <h1
                className={`text-2xl ${
                  isLoading ? "animate-spin transition-all duration-300" : ""
                } font-bold m-1`}
              >
                {isLoading ? "." : "No Data To Display"}
              </h1>
            )}
          </div>
        )}
      </button>
    </>
  );
}

export default UserStats;
