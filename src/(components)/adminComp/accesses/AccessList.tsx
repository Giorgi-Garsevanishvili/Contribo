"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { FcDeleteDatabase } from "react-icons/fc";
import { IoMdAdd } from "react-icons/io";
import usePaginatedData from "@/hooks/usePaginatedData";
import { ImSpinner9 } from "react-icons/im";
import Pagination from "@/(components)/generalComp/Pagination";
import QueryFilter from "@/(components)/generalComp/QueryFilter";
import { RiRefreshLine } from "react-icons/ri";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { useFetchData } from "@/hooks/useDataFetch";
import GrantAccessComp from "./GrantAccessComp";
import { useSession } from "next-auth/react";
import { FaRegCircleDot } from "react-icons/fa6";
import AccessListTitleBar from "./AccessListTitleBar";
import AccessCard from "./AccessCard";

type Data = {
  user: {
    image: string | null;
    name: string | null;
    memberStatusLogs: {
      status: {
        name: string;
      } | null;
    }[];
  } | null;
  id: string;
  createdBy: {
    name: string | null;
  } | null;
  createdAt: Date;
  updatedBy: {
    name: string | null;
  } | null;
  updatedAt: Date | null;
  email: string;
  roles: {
    role: {
      name: string;
    };
    roleId: string;
  }[];
  regionId: string | null;
  region: {
    name: string;
  } | null;
};

type RoleData = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}[];

function AccessList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [toggleInfo, setToggleInfo] = useState("");
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [openCreation, setOpenCreation] = useState(false);
  const updateSession = useSession();

  const { data: roles, isLoadingFetch } =
    useFetchData<RoleData>("/api/admin/roles");

  const [filterOn, setFilterOn] = useState(false);

  const paginatedUrl = useMemo(() => {
    const searchParams = new URLSearchParams();
    searchParams.append("page", currentPage.toString());
    searchParams.append("limit", limit.toString());
    if (searchQuery.length >= 3) {
      searchParams.append("search", searchQuery);
    }

    const hasFilter = searchQuery.length >= 3 && searchQuery;
    setFilterOn(!!hasFilter);

    return `/api/admin/allowedUsers?${searchParams.toString()}`;
  }, [limit, currentPage, searchQuery]);

  const { data, isLoading, pagination, refetch } = usePaginatedData<Data[]>(
    paginatedUrl,
    [],
  );

  const clearFilter = () => {
    handleSearchQuery("");
    setCurrentPage(1);
  };

  const handleSearchQuery = (searchQuery: string) => {
    setSearchQuery(searchQuery);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLimitChange = (limit: number) => {
    setLimit(limit);
    setCurrentPage(1);
    window.scroll({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`flex ${
        isLoading ? "" : " w-auto"
      } flex-col items-center justify-center mt-4 shadow-sm bg-gray-300/90 m-2  rounded-lg p-1.5 select-none`}
    >
      <div className="flex text-black m-1 mb-2 w-full items-center justify-center">
        {
          <div className="flex items-center justify-center flex-col md:flex-row">
            <QueryFilter
              filterType="STANDARD"
              searchValue={searchQuery}
              filterOn={filterOn}
              clearFilter={clearFilter}
              onSearchQueryChange={handleSearchQuery}
            />
            {openCreation ? <GrantAccessComp refetch={refetch} /> : null}
            <button
              onClick={() => setOpenCreation((prev) => !prev)}
              className={`btn m-2 md:w-fit border-white p-2 transition-all justify-center items-center uppercase h-fit w-full bg-gray-700 border text-white select-none duration-200 rounded-md`}
            >
              {openCreation ? (
                "Close"
              ) : (
                <div className="flex">
                  Add <IoMdAdd className="ml-2" size={20} />{" "}
                </div>
              )}
            </button>
          </div>
        }
      </div>
      {isLoading ? (
        <div
          className={`text-sm m-2 text-black ${
            isLoading ? "animate-spin transition-all duration-300" : ""
          } font-bold`}
        >
          <ImSpinner9 className="animate-spin" size={25} />
        </div>
      ) : (
        <div className="flex w-full justify-center items-center flex-col">
          {data.length > 0 ? (
            <>
              <AccessListTitleBar />
              {data.map((access) => (
                <div
                  className={`md:grid ${updateSession.data?.user.id === access.id ? "border-2 border-green-900 bg-green-100/50" : "bg-white/80"} relative pb-5 flex flex-col  w-full  md:grid-cols-[0.7fr_0.5fr_0.8fr_0.3fr_0.3fr_0.1fr_0.15fr] gap-1 md:gap-4 md:grid-rows-1 select-none text-sm justify-start items-center  text-black p-1 px-3 m-1 rounded-lg`}
                  key={access.id}
                >
                  <div className="md:flex grid grid-cols-[1fr_2fr_0.2fr] border-b border-gray-600/30 rounded-md mb-2 md:border-0 p-1 justify-start truncate items-center">
                    {access.user?.image ? (
                      <Image
                        priority
                        className="rounded-lg mr-3"
                        src={access.user.image}
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
                        {access.user?.name}
                      </h3>
                      <h3 className="flex truncate text-xs text-gray-600">
                        {access.email}
                      </h3>
                      {updateSession.data?.user.id === access.id ? (
                        <div className="flex gap-2 items-center justify-center absolute bottom-1.5 left-1.5 truncate text-xs text-green-900">
                          My Account <FaRegCircleDot size={10} />
                        </div>
                      ) : null}
                    </div>
                    <button
                      onClick={() =>
                        setToggleInfo((prev) =>
                          prev === access.id ? "" : access.id,
                        )
                      }
                      className="btn md:hidden w-fit h-fit p-2 bg-transparent shadow-none"
                    >
                      {toggleInfo === access.id ? (
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
                      access={access}
                    />
                  ) : null}
                </div>
              ))}
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
      {pagination ? (
        <div className=" text-black">
          <Pagination
            pagination={pagination}
            onLimitChange={handleLimitChange}
            onPageChange={handlePageChange}
          />{" "}
        </div>
      ) : null}
    </div>
  );
}

export default AccessList;
