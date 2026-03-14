"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FcDeleteDatabase } from "react-icons/fc";
import { IoMdGlobe } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import usePaginatedData from "@/hooks/usePaginatedData";
import { ImSpinner9 } from "react-icons/im";
import { IoIosArrowForward } from "react-icons/io";
import Pagination from "@/(components)/generalComp/Pagination";
import QueryFilter from "@/(components)/generalComp/QueryFilter";
import { useFetchData } from "@/hooks/useDataFetch";
import { RiRefreshLine } from "react-icons/ri";
import { FaRegCircleDot } from "react-icons/fa6";
import { useSession } from "next-auth/react";

type RoleRegionMembershipDataType = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}[];

type Data = {
  id: string;
  name: string;
  email: string;
  image: string;
  rating: number;
  ownAllowance: {
    region: { name: string };
    roles: { role: { name: string } }[];
  };
  memberStatusLogs: {
    status: {
      name: string;
    } | null;
  }[];
};

function UsersList() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const updateSession = useSession();

  const { data: roles, isLoadingFetch: isLoadingFetchRoles } =
    useFetchData<RoleRegionMembershipDataType>(`/api/admin/roles`, []);
  const { data: membership, isLoadingFetch: isLoadingFetchMembership } =
    useFetchData<RoleRegionMembershipDataType>(`/api/admin/memberStatus`, []);

  const [regionFilter, setRegionFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [membershipFilter, setMembershipFilter] = useState("");

  const [filterOn, setFilterOn] = useState(false);

  const paginatedUrl = useMemo(() => {
    const searchParams = new URLSearchParams();
    searchParams.append("page", currentPage.toString());
    searchParams.append("limit", limit.toString());
    searchParams.append("region", regionFilter.toString());
    searchParams.append("role", roleFilter.toString());
    searchParams.append("membership", membershipFilter.toString());
    if (searchQuery.length >= 3) {
      searchParams.append("search", searchQuery);
    }

    const hasFilter =
      regionFilter ||
      membershipFilter ||
      roleFilter ||
      (searchQuery.length >= 3 && searchQuery);
    setFilterOn(!!hasFilter);

    return `/api/admin/users?${searchParams.toString()}`;
  }, [
    limit,
    currentPage,
    searchQuery,
    regionFilter,
    roleFilter,
    membershipFilter,
  ]);

  const { data, isLoading, pagination, refetch } = usePaginatedData<Data[]>(
    paginatedUrl,
    [],
  );

  const clearFilter = () => {
    handleSearchQuery("");
    handleRegionFilterChange("");
    handleRoleFilterChange("");
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

  const handleRoleFilterChange = (role: string) => {
    setRoleFilter(role);
    setCurrentPage(1);
  };
  const handleRegionFilterChange = (region: string) => {
    setRegionFilter(region);
    setCurrentPage(1);
  };
  const handleMembershipFilterChange = (membership: string) => {
    setMembershipFilter(membership);
    setCurrentPage(1);
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
        {roles && membership ? (
          <QueryFilter
            filterType="USERS"
            searchValue={searchQuery}
            filterOn={filterOn}
            clearFilter={clearFilter}
            onSearchQueryChange={handleSearchQuery}
            roleData={roles}
            roleValue={roleFilter}
            onRoleFilterChange={handleRoleFilterChange}
            membershipData={membership}
            membershipValue={membershipFilter}
            onMembershipFilterChange={handleMembershipFilterChange}
          />
        ) : (
          <div
            className={`text-sm m-2 text-black ${
              isLoading ? "animate-spin transition-all duration-300" : ""
            } font-bold`}
          >
            <ImSpinner9 className="animate-spin" size={25} />
          </div>
        )}
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
        <div className="flex flex-col">
          {data.length > 0 ? (
            <>
              <div className=" hidden md:grid font-bold text-sm grid-cols-5 gap-4 uppercase grid-rows-1 select-none justify-start items-center bg-gray-100/80 text-gray-700 p-2 m-1 rounded-lg">
                <h3 className="flex justify-start items-center">
                  Name & Email
                </h3>
                <div className="grid grid-cols-2 gap-2 justify-start items-center">
                  <h3 className=" flex overflow-hidden">MemberShip</h3>
                </div>
                <div className="md:flex hidden">
                  <h3 className="font-medium">Region</h3>
                </div>
                <div className="md:flex hidden">
                  <h3 className="font-medium">Role</h3>
                </div>
                <div className="md:flex hidden">
                  <h3 className="font-medium">Rating</h3>
                </div>
              </div>
              {data.map((user) => (
                <button
                  onClick={() => router.push(`/admin/users/${user.id}`)}
                  className={`${updateSession.data?.user.email === user.email ? "border-2 border-green-900 bg-green-100/50" : "bg-white/80"} grid grid-cols-[2fr_auto] md:grid-cols-5 gap-1 md:gap-4 grid-rows-1 btn select-none text-sm justify-start items-center  text-black p-2 m-1 rounded-lg`}
                  key={user.id}
                >
                  <div className="flex justify-start items-center">
                    {user.image ? (
                      <Image
                        priority
                        className="rounded-lg mr-3"
                        src={user.image}
                        alt="User Image"
                        width={35}
                        height={35}
                      />
                    ) : (
                      <FcDeleteDatabase className="mr-2" size={25} />
                    )}
                    <div className="flex grow justify-start flex-col truncate px-2 py-1.5">
                      <h3 className="text-sm font-bold flex overflow-hidden truncate">
                        {user.name}
                      </h3>
                      <h3 className="flex truncate text-xs text-gray-600">
                        {user.email}
                      </h3>
                      {updateSession.data?.user.email === user.email ? (
                        <div className="flex gap-2 items-center justify-start mt-0.5 italic  truncate text-xs text-green-900">
                          My Account <FaRegCircleDot size={10} />
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-8 flex md:hidden items-center justify-center">
                    <IoIosArrowForward />
                  </div>

                  <div className="md:flex hidden truncate">
                    <h3 className="font-medium bg-gray-300/40 items-center justify-center flex w-1/2 rounded-sm py-1.5 border border-gray-400/50 truncate">
                      {!user.name.startsWith("deleted")
                        ? ` ${
                            user.memberStatusLogs[
                              user.memberStatusLogs.length - 1
                            ]?.status?.name ?? "No Status"
                          }`
                        : ""}
                    </h3>
                  </div>

                  <div className="md:flex hidden jus items-center gap-1.5">
                    <IoMdGlobe size={18} className="text-gray-500" />
                    <h3 className="font-medium truncate">
                      {user.ownAllowance.region.name}
                    </h3>
                  </div>

                  <div className="md:flex hidden">
                    <div className="font-medium flex gap-2 truncate">
                      {user.ownAllowance.roles.map((role, index) => (
                        <h2
                          key={index}
                          className="rounded-lg border px-1.5 py-0.5 bg-gray-300/50 border-gray-500/50"
                        >
                          {role.role.name}
                        </h2>
                      ))}
                    </div>
                  </div>

                  <div className="md:flex hidden font-bold items-start justify-start">
                    <FaStar size={18} className="text-yellow-500" />
                    <h3 className=" ml-2">{user.rating}</h3>
                  </div>
                </button>
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

export default UsersList;
