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
    <>
      <button
        onClick={() => router.push("admin/users")}
        className={`${
          isLoadingFetch ? "animate-pulse" : ""
        } flex hover:shadow-lg  hover:opacity-95 transition-all duration-300 btn flex-col select-none w-40 h-40 items-center justify-center mt-0 m-2 text-white pt-0 p-0.5 bg-[#434d5f98] rounded-xl shadow-sm shadow-white `}
      >
        {
          <>
            <BsFillShieldLockFill size={30} className="m-2" />
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
            <h3>Accesses</h3>
          </>
        }
      </button>
    </>
  );
}

export default AllowedStats;
