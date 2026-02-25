"use client";

import { useEffect, useState } from "react";
import { GiHeartInside } from "react-icons/gi";
import { useRouter } from "next/navigation";
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

function UserStats() {
  const [hover, setHover] = useState(false);
  const [statusStats, setStatusStats] = useState<Record<string, number>>({});

  const router = useRouter();

  const { data, isLoadingFetch } = useFetchData<Data[]>("/api/admin/users", []);

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
    if (data) {
      setMemberStatusValues(data);
    }
  }, [data]);

  return (
    <>
      <button
        onClick={() => router.push("admin/users")}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`${
          isLoadingFetch ? "animate-pulse" : ""
        } flex hover:shadow-lg  hover:opacity-95 transition-all duration-300 btn flex-col select-none w-40 h-40 items-center justify-center mt-0 m-2 text-white pt-0 p-0.5 bg-[#434d5f98] rounded-xl shadow-sm shadow-white `}
      >
        {!hover ? (
          <>
            <GiHeartInside size={30} className="m-2" />
            <h1
              className={`text-2xl ${
                isLoadingFetch ? "animate-spin transition-all duration-300" : ""
              } font-bold m-1`}
            >
              {isLoadingFetch ? (
                <div
                  className={`text-sm ${
                    isLoadingFetch
                      ? "animate-spin transition-all duration-300"
                      : ""
                  } font-bold`}
                >
                  <ImSpinner9 className="animate-spin" size={25} />
                </div>
              ) : (
                data?.length
              )}
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
                  isLoadingFetch
                    ? "animate-spin transition-all duration-300"
                    : ""
                } font-bold m-1`}
              >
                {isLoadingFetch ? "." : "No Data To Display"}
              </h1>
            )}
          </div>
        )}
      </button>
    </>
  );
}

export default UserStats;
