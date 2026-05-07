"use client";

import { HiHandRaised } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useFetchData } from "@/hooks/useDataFetch";
import { ImSpinner9 } from "react-icons/im";

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
    <button
      onClick={() => router.push("admin/join-requests")}
      className={`${
        isLoadingFetch ? "animate-pulse" : ""
      } flex hover:shadow-sm ease-out  hover:opacity-95 transition-all backdrop-blur-xs duration-300 btn w-full gap-4 md:flex-col select-none md:w-40 md:h-40 items-center justify-center  text-white   bg-[#434d5f98] rounded-xl shadow-sm shadow-white `}
    >
      <HiHandRaised size={30} />
      <h1
        className={`text-2xl ${
          isLoadingFetch ? "animate-spin" : ""
        } font-bold `}
      >
        {isLoadingFetch ? (
          <div
            className={`text-sm ${
              isLoadingFetch ? "animate-spin transition-all duration-300" : ""
            } font-bold`}
          >
            <ImSpinner9 className="animate-spin" size={25} />
          </div>
        ) : (
          requestLength
        )}
      </h1>
      <h3>New Join Requests</h3>
    </button>
  );
}

export default JoinStats;
