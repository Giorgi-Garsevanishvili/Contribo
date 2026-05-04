import Pagination from "@/(components)/generalComp/Pagination";
import { ReqStatus } from "@/generated/enums";
import usePaginatedData from "@/hooks/usePaginatedData";
import { useMemo, useState } from "react";
import QueryFilter from "@/(components)/generalComp/QueryFilter";
import { RiRefreshLine } from "react-icons/ri";
import { ImSpinner9 } from "react-icons/im";
import EventsListCard from "./EventListCard";

type EventDataType = {
  status: "LIVE" | "ENDED" | "UPCOMING"
  id: string;
  name: string;
  location: string;
  startTime: string;
  endTime: string;
  rating: number | null;
  region: {
    name: string;
  } | null;
  createdBy: {
    name: string | null;
  } | null;
  updatedBy: {
    name: string | null;
  } | null;
  assignments: {
    user: {
      name: string | null;
      image: string | null;
    } | null;
    role: {
      name: string;
    } | null;
  }[];
  availabilities: {
    availabilityEntries: {
      user: {
        name: string | null;
        image: string | null;
      };
    }[];
    role: {
      name: string;
    };
    totalSlots: number;
  }[];
};

function EventsList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOn, setFilterOn] = useState(false);

  const paginatedUrl = useMemo(() => {
    const searchParams = new URLSearchParams();
    searchParams.append("page", currentPage.toString());
    searchParams.append("limit", limit.toString());
    searchParams.append("status", statusFilter.toString());
    if (searchQuery.length >= 3) {
      searchParams.append("search", searchQuery);
    }

    const hasFilter = statusFilter || (searchQuery.length >= 3 && searchQuery);
    setFilterOn(!!hasFilter);

    return `/api/admin/events?${searchParams.toString()}`;
  }, [limit, currentPage, searchQuery, statusFilter]);

  const {
    data,
    isLoading: isLoadingFetch,
    refetch,
    pagination,
  } = usePaginatedData<EventDataType[]>(paginatedUrl, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLimitChange = (limit: number) => {
    setLimit(limit);
    setCurrentPage(1);
    window.scroll({ top: 0, behavior: "smooth" });
  };

  const handleSearchQuery = (searchQuery: string) => {
    setSearchQuery(searchQuery);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const clearFilter = () => {
    handleSearchQuery("");
    handleStatusFilterChange("");
    setCurrentPage(1);
  };

  return (
    <div
      className={`flex ${
        isLoadingFetch ? "" : " w-auto"
      } flex-col items-center relative justify-center mt-4 shadow-sm bg-gray-300/90 m-2  rounded-lg p-1.5 select-none`}
    >
      <div className="flex text-black m-1 mb-2 w-full items-center justify-center">
        <QueryFilter
          filterType="JOIN_REQUEST"
          searchValue={searchQuery}
          filterOn={filterOn}
          clearFilter={clearFilter}
          onSearchQueryChange={handleSearchQuery}
          onStatusFilterChange={handleStatusFilterChange}
          statusValue={statusFilter}
        />
      </div>
      {isLoadingFetch ? (
        <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-10 justify-center">
          <ImSpinner9 className="animate-spin" size={40} />
        </div>
      ) : data && data?.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-2">
          {data?.map((event) => (
            <EventsListCard refetch={refetch} key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col mt-2 text-black bg-gray-100/90  items-center rounded-lg shadow-lg p-10 justify-center">
          <h3 className="font-bold">No Join Requests to display.</h3>
          <button className="btn text-gray-300 bg-cyan-900" onClick={refetch}>
            <RiRefreshLine size={22} className="mr-2" /> Refetch
          </button>
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

export default EventsList;
