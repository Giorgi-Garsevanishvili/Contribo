"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FcDeleteDatabase } from "react-icons/fc";
import usePaginatedData from "@/hooks/usePaginatedData";
import { ImSpinner9 } from "react-icons/im";
import { RiRefreshLine } from "react-icons/ri";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { useFetchData } from "@/hooks/useDataFetch";

import { useSession } from "next-auth/react";
import { FaRegCircleDot } from "react-icons/fa6";
import AccessListTitleBar from "./AccessListTitleBar";
import AccessCard from "./AccessCard";
import { ParamValue } from "next/dist/server/request/params";
import { useRouter } from "next/navigation";

type Data = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string | null;
  updatedBy: {
    name: string | null;
  } | null;
  regionId: string | null;
  region: {
    name: string;
  } | null;
  roles: {
    roleId: string;
    role: {
      name: string;
    };
  }[];
  createdBy: {
    name: string | null;
  } | null;
  user: {
    name: string | null;
    image: string | null;
    memberStatusLogs: {
      status: {
        name: string;
      } | null;
    }[];
  } | null;
} | null;

type RoleData = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
};

function SingleAccessInfo({ id }: { id: ParamValue }) {
  const [toggleInfo, setToggleInfo] = useState("");
  const updateSession = useSession();
  const { data: roles, isLoadingFetch } =
    useFetchData<RoleData[]>("/api/admin/roles");
  const {
    data,
    isLoading,
    refetch,
    error: fetchError,
  } = usePaginatedData<Data>(`/api/admin/allowedUsers/${id}`, null);
  const router = useRouter();

  useEffect(() => {
    if (fetchError === true) {
      router.push("/admin/accesses");
    }
  }, [fetchError]);

  return (
    <div
      className={`flex ${
        isLoading ? "" : " w-auto"
      } flex-col items-center justify-center mt-4 shadow-sm bg-gray-300/90 m-2  rounded-lg p-1.5 select-none`}
    >
      <div className="flex text-black m-1 mb-2 w-full items-center justify-center"></div>
      {isLoading || isLoadingFetch ? (
        <div
          className={`text-sm m-2 text-black ${
            isLoading ? "animate-spin transition-all duration-300" : ""
          } font-bold`}
        >
          <ImSpinner9 className="animate-spin" size={25} />
        </div>
      ) : (
        <div className="flex w-full justify-center items-center flex-col">
          {data ? (
            <>
              <AccessListTitleBar />
              {
                <div
                  className={`md:grid ${updateSession.data?.user.id === data.id ? "border-2 border-green-900 bg-green-100/50" : "bg-white/80"} relative pb-5 flex flex-col  w-full  md:grid-cols-[0.7fr_0.5fr_0.8fr_0.3fr_0.3fr_0.1fr_0.15fr] gap-1 md:gap-4 md:grid-rows-1 select-none text-sm justify-start items-center  text-black p-1 px-3 m-1 rounded-lg`}
                  key={data.id}
                >
                  <div className="md:flex grid grid-cols-[1fr_2fr_0.2fr] border-b border-gray-600/30 rounded-md mb-2 md:border-0 p-1 justify-start truncate items-center">
                    {data.user?.image ? (
                      <Image
                        priority
                        className="rounded-lg mr-3"
                        src={data.user.image}
                        alt="User Image"
                        width={35}
                        height={35}
                      />
                    ) : (
                      <div>
                        <FcDeleteDatabase className="mr-2" size={40} />
                      </div>
                    )}
                    <div className="flex grow justify-start flex-col truncate px-2 py-1.5">
                      <h3 className="text-sm font-bold flex overflow-hidden truncate">
                        {data.user?.name}
                      </h3>
                      <h3 className="flex truncate text-xs text-gray-600">
                        {data.email}
                      </h3>
                      {updateSession.data?.user.id === data.id ? (
                        <div className="flex gap-2 items-center justify-center absolute bottom-1.5 left-1.5 truncate text-xs text-green-900">
                          My Account <FaRegCircleDot size={10} />
                        </div>
                      ) : null}
                    </div>
                    <button
                      onClick={() =>
                        setToggleInfo((prev) =>
                          prev === data.id ? "" : data.id,
                        )
                      }
                      className="btn md:hidden w-fit h-fit p-2 bg-transparent shadow-none"
                    >
                      {toggleInfo === data.id ? (
                        <MdExpandLess size={20} />
                      ) : (
                        <MdExpandMore size={20} />
                      )}
                    </button>
                  </div>

                  {roles ? (
                    <AccessCard
                      isLoading={isLoading}
                      roles={roles}
                      refetch={refetch}
                      toggleInfo={toggleInfo}
                      access={data}
                    />
                  ) : null}
                </div>
              }
            </>
          ) : (
            <div className="flex flex-col mt-2 text-black bg-gray-100/60 items-center rounded-lg shadow-lg p-10 justify-center">
              <h3 className="font-bold">No Users to display.</h3>
              <button
                className="btn text-gray-300 bg-cyan-900"
                onClick={refetch}
              >
                <RiRefreshLine size={22} className="mr-2" /> Refetch
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SingleAccessInfo;
