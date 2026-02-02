"use client";

import React, { useEffect, useState } from "react";
import { IoFileTrayStacked } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useFetchData } from "@/hooks/useDataFetch";

type Data = {
  id: string;
  name: string;
  status: string;
  type: { name: string };
  assignee: {
    name: string;
  };
};

function HrWarningStats() {
  const [hover, setHover] = useState(false);
  const [typeStats, setTypeStats] = useState<Record<string, number>>({});
  const [statusStats, setStatusStats] = useState<Record<string, number>>({});
  const [statsShow, setStatsShow] = useState(false);

  const router = useRouter();

  const { data, isLoadingFetch } = useFetchData<Data[]>(
    "/api/admin/hrWarnings",
    [],
  );

  useEffect(() => {
    if (data) {
      setStatus(data);
      setWarningTypeStats(data);
    }
  }, [data]);

  const setStatus = (value: Data[]) => {
    const stats = value.reduce<Record<string, number>>((acc, item) => {
      const statusName = item.status;
      if (!statusName) return acc;

      acc[statusName] = (acc[statusName] || 0) + 1;
      return acc;
    }, {});
    setStatusStats(stats);
  };

  const setWarningTypeStats = (value: Data[]) => {
    const stats = value.reduce<Record<string, number>>((acc, item) => {
      const typeName = item.type.name;
      if (!typeName) return acc;

      acc[typeName] = (acc[typeName] || 0) + 1;
      return acc;
    }, {});

    setTypeStats(stats);
  };

  useEffect(() => {
    if (!hover) return;

    const intervalId = setInterval(() => {
      setStatsShow((prev) => !prev);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [hover]);

  return (
    <>
      <button
        onClick={() => router.push("admin/hr-warnings")}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => {
          setHover(false);
        }}
        className={`${isLoadingFetch ? "animate-pulse" : ""} flex hover:shadow-lg  hover:opacity-95 transition-all duration-300 btn flex-col select-none w-40 h-40 items-center justify-center mt-0 m-2 text-white pt-0 p-0.5 bg-[#434d5f98] rounded-xl shadow-sm shadow-white `}
      >
        {!hover ? (
          <>
            <IoFileTrayStacked size={30} className="m-2" />
            <h1
              className={`text-2xl ${
                isLoadingFetch ? "animate-spin transition-all duration-300" : ""
              } font-bold m-1`}
            >
              {isLoadingFetch ? "." : data?.length}
            </h1>
            <h3>HR Cases</h3>
          </>
        ) : (
          <>
            <div
              className={`${
                !statsShow ? "flex" : "hidden"
              } flex-col justify-center items-center`}
            >
              <h1 className="mb-1">HR Cases</h1>
              {isLoadingFetch ? (
                <h3 className="animate-spin font-bold">.</h3>
              ) : Object.keys(typeStats).length !== 0 ? (
                Object.entries(typeStats)
                  .slice(0, 3)
                  .map(([status, count]) => (
                    <div
                      className="mt-1 p-1 border-2 rounded-lg text-sm"
                      key={status}
                    >
                      {status} : <span className="font-bold ">{count}</span>
                    </div>
                  ))
              ) : (
                "No Stats To Display"
              )}
            </div>
            <div
              className={`${
                statsShow ? "flex" : "hidden"
              } flex-col h-full pt-1.5 transition-all duration-300 `}
            >
              <h2 className="mb-0.5">Case Statuses</h2>
              {Object.keys(statusStats).length !== 0
                ? Object.entries(statusStats).slice(0, 3).map(([type, count]) => (
                    <div
                      className="mt-1 p-1 border-2 rounded-lg text-sm"
                      key={type}
                    >
                      {type} : {count}
                    </div>
                  ))
                : "No Stats To Display"}
                <h3>...</h3>
            </div>
          </>
        )}
      </button>
    </>
  );
}

export default HrWarningStats;
