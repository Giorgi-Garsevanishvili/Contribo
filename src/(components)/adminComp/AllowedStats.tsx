"use client";

import { BsFillShieldLockFill } from "react-icons/bs";
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

function AllowedStats() {
  const router = useRouter();

  const { data, isLoadingFetch } = useFetchData<Data[]>(
    "/api/admin/allowedUsers",
    [],
  );

  return (
    <button
      onClick={() => router.push("admin/accesses")}
      className={`${
        isLoadingFetch ? "animate-pulse" : ""
      } flex hover:shadow-sm ease-out  hover:opacity-95 transition-all backdrop-blur-xs duration-300 btn w-full gap-4 md:flex-col select-none md:w-40 md:h-40 items-center justify-center  text-white   bg-[#434d5f98] rounded-xl shadow-sm shadow-white `}
    >
      {
        <>
          <BsFillShieldLockFill size={30} />
          <h1
            className={`text-2xl ${
              isLoadingFetch ? "animate-spin transition-all duration-300" : ""
            } font-bold`}
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
          <h3>Accesses</h3>
        </>
      }
    </button>
  );
}

export default AllowedStats;
