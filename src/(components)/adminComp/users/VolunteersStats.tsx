"use client";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useCompAlert } from "@/hooks/useCompAlert";

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

function VolunteerStats() {
  const [isLoading, setIsLoading] = useState(true);
  const [statusStats, setStatusStats] = useState<Record<string, number>>({});

  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/admin/users");
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
      {
        <div className={`${isLoading ? "animate-pulse " : ""} shadow-sm bg-gray-200/45  rounded-lg p-1.5 flex flex-row w-full items-center justify-between select-none`}>
          {isLoading ? (
            <h2
              className={`text-2xl text-black ${
                isLoading ? "animate-spin transition-all duration-300" : ""
              } font-bold m-1`}
            >
              .
            </h2>
          ) : Object.keys(statusStats).length !== 0 ? (
            Object.entries(statusStats)
              .slice(0, 3)
              .map(([status, count]) => (
                <div
                  className="m-1.5 p-2.5 bg-[#434d5f98] border-2 rounded-lg"
                  key={status}
                >
                  {status} : <span className="font-bold ">{count}</span>
                </div>
              ))
          ) : (
            "No Stats To Display"
          )}
        </div>
      }
    </>
  );
}

export default VolunteerStats;
