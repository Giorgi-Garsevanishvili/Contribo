"use client";

import { useEffect, useState } from "react";
import { useFetchData } from "@/hooks/useDataFetch";
import { ImSpinner9 } from "react-icons/im";

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

function VolunteerStats({ data }: { data: Data[] }) {
  const [statusStats, setStatusStats] = useState<Record<string, number>>({});

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
      {Object.keys(statusStats).length !== 0 ? (
        <div
          className={` gap-1.5 text-sm shadow-sm bg-gray-400/70  rounded-lg p-1.5 flex w-full items-center justify-between select-none`}
        >
          {Object.entries(statusStats)
            .slice(0, 3)
            .map(([status, count]) => (
              <div
                className="p-1.5 bg-[#434d5f98] border-2 rounded-lg"
                key={status}
              >
                {status} : <span className="font-bold ">{count}</span>
              </div>
            ))}
        </div>
      ) : null}
    </>
  );
}

export default VolunteerStats;
