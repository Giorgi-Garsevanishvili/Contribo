"use client";

import { useEffect, useState } from "react";
import { useFetchData } from "@/hooks/useDataFetch";

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
  const [statusStats, setStatusStats] = useState<Record<string, number>>({});

  const { data, isLoadingFetch } = useFetchData<Data[]>("/api/admin/users", []);

  useEffect(() => {
    if (data) {
      const stats = data.reduce<Record<string, number>>((acc, user) => {
        user.memberStatusLogs.forEach((log) => {
          const statusName = log.status?.name;
          if (!statusName) return;

          acc[statusName] = (acc[statusName] || 0) + 1;
        });
        return acc;
      }, {});

      setStatusStats(stats);
    }
  }, [data]);

  return (
    <>
      {
        <div
          className={`${isLoadingFetch ? "animate-pulse " : ""} text-sm shadow-sm bg-gray-200/45  rounded-lg p-1.5 flex flex-row w-full items-center justify-between select-none`}
        >
          {isLoadingFetch ? (
            <h2
              className={`text-sm text-black ${
                isLoadingFetch ? "animate-spin transition-all duration-300" : ""
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
