import { useFetchData } from "@/hooks/useDataFetch";
import { useMemo, useState } from "react";
import usePaginatedData from "@/hooks/usePaginatedData";
import Pagination from "@/(components)/generalComp/Pagination";
import QueryFilter from "@/(components)/generalComp/QueryFilter";
import { useParams } from "next/navigation";
import { ImSpinner9 } from "react-icons/im";
import { RiRefreshLine } from "react-icons/ri";
import { FeedbackRequestStatus } from "@/generated/enums";
import FeedbacksCardVolunteer from "./FeedbacksCardVolunteer";

type Data = {
  id: string;
  userId: string | null;
  user: {
    name: string | null;
  } | null;
  rating: number | null;
  event: {
    name: string;
  };
  feedback: string | null;
  eventId: string;
  requestStatus: FeedbackRequestStatus;
  requestedAt: Date;
  respondedAt: Date | null;
  responded: boolean;
};

const TYPE_ORDER = [
  "ACTIVE",
  "UNDER_REVIEW",
  "ESCALATED",
  "APPROVED",
  "RESOLVED",
  "EXPIRED",
  "CANCELLED",
  "ARCHIVED",
];

function FeedbacksListVolunteer({ fetchUrl }: { fetchUrl: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOn, setFilterOn] = useState(false);
  const paginatedUrl = useMemo(() => {
    const searchParams = new URLSearchParams();
    searchParams.append("page", currentPage.toString());
    searchParams.append("limit", limit.toString());
    searchParams.append("status", statusFilter.toString());
    searchParams.append("type", typeFilter.toString());
    if (searchQuery.length >= 3) {
      searchParams.append("search", searchQuery);
    }

    const hasFilter =
      statusFilter || typeFilter || (searchQuery.length >= 3 && searchQuery);
    setFilterOn(!!hasFilter);

    return `${fetchUrl}?${searchParams.toString()}`;
  }, [fetchUrl, currentPage, limit, statusFilter, typeFilter, searchQuery]);

  const clearFilter = () => {
    handleSearchQuery("");
    handleTypeFilterChange("");
    handleStatusFilterChange("");
  };

  const {
    data,
    isLoading: isLoadingFetch,
    refetch,
    pagination,
  } = usePaginatedData<Data[]>(paginatedUrl, []);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (type: string) => {
    setTypeFilter(type);
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

  const sortedData = useMemo(() => {
    if (!data) return [];

    return [...data].sort((a, b) => {
      const aIndex = TYPE_ORDER.indexOf(a.requestStatus);
      const bIndex = TYPE_ORDER.indexOf(b.requestStatus);

      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });
  }, [data]);

  return (
    <div
      className={`flex w-full items-center justify-center xl:px-25 xl:py-5 px-2 flex-col`}
    >
      <div className="flex flex-col items-center md:flex-row m-2 justify-center">
        <div className="flex text-black m-1 mb-2 w-full items-center justify-center">
          <QueryFilter
            filterType="STANDARD"
            searchValue={searchQuery}
            clearFilter={clearFilter}
            onSearchQueryChange={handleSearchQuery}
            filterOn={filterOn}
          />
        </div>
      </div>

      {isLoadingFetch ? (
        <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-10 justify-center">
          <ImSpinner9 className="animate-spin" size={40} />
        </div>
      ) : sortedData && sortedData?.length > 0 ? (
        sortedData?.map((item) => (
          <FeedbacksCardVolunteer parentRefetch={refetch} key={item.id} feedbackData={item} />
        ))
      ) : (
        <div className="flex flex-col mt-2 text-black bg-gray-100/90  items-center rounded-lg shadow-lg p-10 justify-center">
          <h3 className="font-bold">No HR Cases to display.</h3>
          <button className="btn text-gray-300 bg-cyan-900" onClick={refetch}>
            <RiRefreshLine size={22} className="mr-2" /> Refetch
          </button>
        </div>
      )}
      {pagination ? (
        <Pagination
          onLimitChange={handleLimitChange}
          onPageChange={handlePageChange}
          pagination={pagination}
        />
      ) : null}
    </div>
  );
}

export default FeedbacksListVolunteer;
