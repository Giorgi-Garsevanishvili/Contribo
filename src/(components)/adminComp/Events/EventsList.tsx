import Pagination from "@/(components)/generalComp/Pagination";
import usePaginatedData from "@/hooks/usePaginatedData";
import { useMemo, useState } from "react";
import QueryFilter, {
  EventStatusFilter,
} from "@/(components)/generalComp/QueryFilter";
import { RiRefreshLine } from "react-icons/ri";
import EventsListCard from "./EventListCard";
import AddEventButton from "./AddEventButton";
import LoadingCard from "@/(components)/generalComp/LoadingCard";

type UserResponse = {
  id: string;
  name: string | null;
  image: string | null;
};

type EventDataType = {
  status: "LIVE" | "ENDED" | "UPCOMING";
  id: string;
  region: {
    name: string;
  } | null;
  createdBy: {
    name: string | null;
  } | null;
  updatedBy: {
    name: string | null;
  } | null;
  name: string;
  location: string;
  startTime: string;
  endTime: string;
  description: string | null;
  rating: number | null;
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
    _count: {
      availabilityEntries: number;
    };
    role: {
      name: string;
    };
    availabilityEntries: {
      user: {
        name: string | null;
        image: string | null;
      };
    }[];
    totalSlots: number;
  }[];
};

function EventsList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOn, setFilterOn] = useState(false);
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [fromDateFilter, setFromDateFilter] = useState("");
  const [tillDateFilter, setTillDateFilter] = useState("");

  const paginatedUrl = useMemo(() => {
    const searchParams = new URLSearchParams();
    searchParams.append("page", currentPage.toString());
    searchParams.append("limit", limit.toString());
    searchParams.append("status", statusFilter.toString());
    searchParams.append("assignee", assigneeFilter.toString());
    searchParams.append("fromDate", fromDateFilter.toString());
    searchParams.append("tillDate", tillDateFilter.toString());
    if (searchQuery.length >= 3) {
      searchParams.append("search", searchQuery);
    }

    const hasFilter =
      assigneeFilter ||
      fromDateFilter ||
      tillDateFilter ||
      statusFilter ||
      (searchQuery.length >= 3 && searchQuery);
    setFilterOn(!!hasFilter);

    return `/api/user/events?${searchParams.toString()}`;
  }, [
    limit,
    currentPage,
    searchQuery,
    statusFilter,
    assigneeFilter,
    fromDateFilter,
    tillDateFilter,
  ]);

  const { data: UserData, isLoading } = usePaginatedData<UserResponse[]>(
    "/api/admin/users/selectList",
    [],
  );

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

  const handleAssigneeFilterChange = (assigneeId: string) => {
    setAssigneeFilter(assigneeId);
    setCurrentPage(1);
  };
  const handleFromDateFilterChange = (fromDate: string) => {
    setFromDateFilter(fromDate);
    setCurrentPage(1);
  };
  const handleTillDateFilterChange = (tillDate: string) => {
    setTillDateFilter(tillDate);
    setCurrentPage(1);
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
    handleTillDateFilterChange("");
    handleFromDateFilterChange("");
    setAssigneeFilter("");
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
          filterType="EVENTS"
          statusValue={statusFilter as EventStatusFilter}
          assigneeFilter={assigneeFilter}
          fromDateFilter={fromDateFilter}
          tillDateFilter={tillDateFilter}
          userData={UserData}
          onAssigneeFilterChange={handleAssigneeFilterChange}
          onFromDateFilterChange={handleFromDateFilterChange}
          onStatusFilterChange={handleStatusFilterChange}
          onTillDateFilterChange={handleTillDateFilterChange}
          searchValue={searchQuery}
          filterOn={filterOn}
          clearFilter={clearFilter}
          onSearchQueryChange={handleSearchQuery}
        />
      </div>
      <div className="absolute">
        <AddEventButton parentRefetch={refetch} />
      </div>
      {isLoadingFetch ? (
        <div className="grid transition-all duration-300 ease-out w-full md:grid-cols-2 gap-2">
          {Array.from({ length: 10 })?.map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      ) : data && data?.length > 0 ? (
        <div className="grid w-full transition-all duration-300 ease-out  md:grid-cols-2 gap-2">
          {data?.map((event) => (
            <EventsListCard refetch={refetch} key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col mt-2 text-black bg-gray-100/90  items-center rounded-lg shadow-lg p-10 justify-center">
          <h3 className="font-bold">No Events to display.</h3>
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
