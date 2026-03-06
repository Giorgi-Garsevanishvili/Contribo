"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { FcDeleteDatabase } from "react-icons/fc";
import { IoMdGlobe } from "react-icons/io";
import usePaginatedData from "@/hooks/usePaginatedData";
import { ImSpinner9 } from "react-icons/im";
import Pagination from "@/(components)/generalComp/Pagination";
import QueryFilter from "@/(components)/generalComp/QueryFilter";
import { RiRefreshLine } from "react-icons/ri";
import { FaPersonWalkingLuggage } from "react-icons/fa6";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import AccessToggle from "./AccessToggle";
import { useFetchData } from "@/hooks/useDataFetch";

type Data = {
  id: string;
  email: string;
  updatedAt: Date | null;
  createdAt: Date;
  createdBy: {
    name: string | null;
  } | null;
  updatedBy: {
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
    ownAllowance: {
      regionId: string | null;
      region: {
        name: string;
      } | null;
      roles: {
        role: {
          name: string;
        };
        roleId: string;
      }[];
    } | null;
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
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: roles, isLoadingFetch } =
    useFetchData<RoleData>("/api/admin/roles");

  const [filterOn, setFilterOn] = useState(false);

  const paginatedUrl = useMemo(() => {
    const searchParams = new URLSearchParams();
    searchParams.append("page", currentPage.toString());
    searchParams.append("limit", limit.toString());
    searchParams.append("search", searchQuery.toString());

    const hasFilter = searchQuery;
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
          <QueryFilter
            filterType="STANDARD"
            searchValue={searchQuery}
            filterOn={filterOn}
            clearFilter={clearFilter}
            onSearchQueryChange={handleSearchQuery}
          />
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
              <div className=" hidden md:grid font-bold text-sm grid-cols-6 w-full gap-4 uppercase grid-rows-1 select-none justify-start items-center bg-gray-100/80 text-gray-700 p-1 px-3 m-1 rounded-lg">
                <h3 className="flex justify-start items-center">
                  Name & Email
                </h3>
                <div className="md:flex justify-center hidden">
                  <h3 className="font-medium">Region</h3>
                </div>
                <div className="md:flex hidden">
                  <h3 className="font-medium">Role</h3>
                </div>
                <div className="md:flex justify-center hidden">
                  <h3 className="font-medium">Grant Admin Access</h3>
                </div>
                <div className="md:flex justify-center hidden">
                  <h3 className="font-medium">Restrict Access</h3>
                </div>
                <div className="md:flex justify-center hidden">
                  <h3 className="font-medium">Remove From Region</h3>
                </div>
              </div>
              {data.map((access) => (
                <div
                  className="md:grid relative pb-5 flex flex-col  w-full  md:grid-cols-6 gap-1 md:gap-4 md:grid-rows-1 select-none text-sm justify-start items-center bg-white/80 text-black p-1 px-3 m-1 rounded-lg"
                  key={access.id}
                >
                  <div className="flex border-b border-gray-600/30 rounded-md mb-2 md:border-0 p-1 justify-start items-center">
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
                      <FcDeleteDatabase className="mr-2" size={25} />
                    )}
                    <div className="flex grow justify-start flex-col truncate px-2 py-1.5">
                      <h3 className="text-sm font-bold flex overflow-hidden truncate">
                        {access.user?.name}
                      </h3>
                      <h3 className="flex truncate text-xs text-gray-600">
                        {access.email}
                      </h3>
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

                  <div className="md:flex hidden justify-center items-center gap-1.5">
                    <IoMdGlobe size={18} className="text-gray-500" />
                    <h3 className="font-medium truncate">
                      {access.user?.ownAllowance?.region
                        ? access.user.ownAllowance.region.name
                        : "No Data"}
                    </h3>
                  </div>

                  <div className="md:flex hidden border border-gray-600/30 p-2 pt-0 md:pt-2 rounded-md flex-col md:flex-row justify-center items-center md:justify-start">
                    <h3 className="flex md:hidden p-1 font-bold">Roles</h3>
                    <div className="font-medium flex gap-2 truncate">
                      {access.user?.ownAllowance
                        ? access.user.ownAllowance.roles.map((role, index) => (
                            <h2
                              key={index}
                              className="rounded-lg border px-1.5 py-0.5 bg-gray-300/50 border-gray-500/50"
                            >
                              {role.role.name}
                            </h2>
                          ))
                        : "No Data"}
                    </div>
                  </div>

                  <div className="hidden md:flex items-center justify-center">
                    {isLoading ? (
                      <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-2 justify-center">
                        <ImSpinner9 className="animate-spin" size={20} />
                      </div>
                    ) : roles ? (
                      <AccessToggle
                        user={access.user?.name ?? "User"}
                        refetchList={refetch}
                        roleData={roles}
                        AccessUrl={`/api/admin/allowedUsers/${access.id}`}
                        userRoles={
                          access.user?.ownAllowance?.roles.map(
                            (role) => role.roleId,
                          ) ?? []
                        }
                        role="ADMIN"
                      />
                    ) : (
                      "Fetch Failed"
                    )}
                  </div>

                  <div className="hidden md:flex items-center justify-center">
                    {isLoading ? (
                      <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-2 justify-center">
                        <ImSpinner9 className="animate-spin" size={20} />
                      </div>
                    ) : roles ? (
                      <AccessToggle
                        user={access.user?.name ?? "User"}
                        refetchList={refetch}
                        roleData={roles}
                        AccessUrl={`/api/admin/allowedUsers/${access.id}`}
                        userRoles={
                          access.user?.ownAllowance?.roles.map(
                            (role) => role.roleId,
                          ) ?? []
                        }
                        role="RESTRICT"
                      />
                    ) : (
                      "Fetch Failed"
                    )}
                  </div>

                  <div className="md:flex hidden w-full items-center justify-center ">
                    <button className="btn w-full items-center justify-center p-2 md:w-fit h-fit bg-gray-400/40 text-gray-950 border border-gray-700/20 hover:border-red-800 hover:text-red-800 ">
                      <FaPersonWalkingLuggage size={22} />
                    </button>
                  </div>

                  <div
                    className={`md:hidden ${toggleInfo === access.id ? "flex" : "hidden"} rounded-md bg-gray-400/20 border border-gray-700/40 w-full p-2 gap-1 flex-col`}
                  >
                    <h3 className="flex md:hidden p-1 font-bold">Roles</h3>
                    <div className="flex md:hidden border border-gray-600/30 p-2 rounded-md flex-col md:flex-row justify-center items-center md:justify-start">
                      <div className="font-medium flex gap-2 truncate">
                        {access.user?.ownAllowance
                          ? access.user.ownAllowance.roles.map(
                              (role, index) => (
                                <h2
                                  key={index}
                                  className="rounded-lg border px-1.5 py-0.5 bg-gray-300/50 border-gray-500/50"
                                >
                                  {role.role.name}
                                </h2>
                              ),
                            )
                          : "No Data"}
                      </div>
                    </div>

                    <h3 className="flex md:hidden font-bold">
                      Grant Admin Access:
                    </h3>
                    <div className="md:hidden flex items-center justify-center">
                      {isLoading ? (
                        <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-2 justify-center">
                          <ImSpinner9 className="animate-spin" size={20} />
                        </div>
                      ) : roles ? (
                        <AccessToggle
                          user={access.user?.name ?? "User"}
                          refetchList={refetch}
                          roleData={roles}
                          AccessUrl={`/api/admin/allowedUsers/${access.id}`}
                          userRoles={
                            access.user?.ownAllowance?.roles.map(
                              (role) => role.roleId,
                            ) ?? []
                          }
                          role="ADMIN"
                        />
                      ) : (
                        "Fetch Failed"
                      )}
                    </div>

                    <h3 className="flex md:hidden p-1 font-bold">
                      Restrict Access:
                    </h3>
                    <div className="md:hidden flex items-center justify-center">
                      {isLoading ? (
                        <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-2 justify-center">
                          <ImSpinner9 className="animate-spin" size={20} />
                        </div>
                      ) : roles ? (
                        <AccessToggle
                          user={access.user?.name ?? "User"}
                          refetchList={refetch}
                          roleData={roles}
                          AccessUrl={`/api/admin/allowedUsers/${access.id}`}
                          userRoles={
                            access.user?.ownAllowance?.roles.map(
                              (role) => role.roleId,
                            ) ?? []
                          }
                          role="RESTRICT"
                        />
                      ) : (
                        "Fetch Failed"
                      )}
                    </div>
                    <div className="w-full items-center justify-center flex">
                      <button className="btn w-full items-center justify-center p-2 md:w-fit h-fit bg-gray-400/40 text-gray-950 border border-gray-700/20 hover:border-red-800 hover:text-red-800 ">
                        <FaPersonWalkingLuggage size={22} />
                      </button>
                    </div>
                  </div>
                  <div className="md:absolute right-2 items-start m-2 md:m-0 text-xs gap-3 text-gray-600/50 italic bottom-0.5 flex">
                    <h2 className="text-xm italic ">
                      <strong>Created By: </strong>{" "}
                      {access.createdBy?.name
                        ? access.createdBy?.name
                        : "No Creator Data"}
                    </h2>
                    <h2 className="text-xm italic ">
                      <strong>Created At: </strong>{" "}
                      {access.createdAt
                        ? new Date(access.createdAt).toLocaleString()
                        : "No Data"}
                    </h2>
                    <h2 className="text-xm italic ">
                      <strong>Updated By: </strong>{" "}
                      {access.updatedBy?.name
                        ? access.updatedBy?.name
                        : "No Creator Data"}
                    </h2>
                    <h2 className="text-xm italic ">
                      <strong>Updated At: </strong>{" "}
                      {access.updatedAt
                        ? new Date(access.updatedAt).toLocaleString()
                        : "No Data"}
                    </h2>
                  </div>
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
