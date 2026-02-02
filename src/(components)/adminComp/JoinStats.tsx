"use client";

import { HiHandRaised } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useFetchData } from "@/hooks/useDataFetch";

type Data = {
  id: string;
  region: { name: string };
  status: string;
};

function JoinStats() {
  const router = useRouter();
  const { data, isLoadingFetch } = useFetchData<Data[]>(
    "/api/admin/joinRequests",
    [],
  );

  const requestLength = data?.filter(
    (s) => s.status !== "APPROVED" && s.status !== "REJECTED",
  ).length;

  return (
    <>
      <button
        onClick={() => router.push("admin/users")}
        className={`${
          isLoadingFetch ? "animate-pulse" : ""
        } flex hover:shadow-lg hover:opacity-80 duration-300 btn flex-col select-none w-40 h-40 items-center justify-center mt-0 m-2 text-white pt-0 p-0.5 bg-[#434d5f98] rounded-xl shadow-sm shadow-white `}
      >
        <HiHandRaised size={30} className="m-2" />
        <h1
          className={`text-2xl ${
            isLoadingFetch ? "animate-spin" : ""
          } font-bold m-1`}
        >
          {isLoadingFetch ? "." : requestLength}
        </h1>
        <h3>New Join Requests</h3>
      </button>
    </>
  );
}

export default JoinStats;
