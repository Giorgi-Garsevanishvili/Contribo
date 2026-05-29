import { useMemo, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import usePaginatedData from "@/hooks/usePaginatedData";
import Pagination from "@/(components)/generalComp/Pagination";
import QueryFilter from "@/(components)/generalComp/QueryFilter";
import { useParams } from "next/navigation";
import { ImSpinner9 } from "react-icons/im";
import RatingCardVolunteer from "./RatingCardVolunteer";

type Data = {
  id: string;
  action: "INCREASE" | "DECREASE";
  createdBy: { name: string } | null;
  updatedBy: { name: string } | null;
  createdAt: string;
  updatedAt: string;
  newValue: number;
  oldValue: number;
  reason: string;
  user: { name: string } | null;
  value: number;
};

type DataType = {
  createdAt: string;
  id: string;
  name: string;
  type: string;
  updatedAt: string;
}[];

export const RATING_ACTION_COLORS = {
  DECREASE: {
    bg: "bg-red-100",
    border: "border-red-300",
    shadow: "shadow-red-200",
  },
  INCREASE: {
    bg: "bg-green-100",
    border: "border-green-300",
    shadow: "shadow-green-200",
  },
} as const;

export type RatingAction = keyof typeof RATING_ACTION_COLORS;

function RatingRecordsListVolunteer({ fetchUrl }: { fetchUrl: string }) {
  const [isOpenId, setIsOpenId] = useState("");
  const [colorInfoOpen, setColorInfoOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [actionFilter, setActionFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOn, setFilterOn] = useState(false);
  const paginatedUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("limit", limit.toString());
    params.append("action", actionFilter.toString());
    if (searchQuery.length >= 3) {
      params.append("search", searchQuery);
    }
    const hasFilter = actionFilter || (searchQuery.length >= 3 && searchQuery);
    setFilterOn(!!hasFilter);

    return `${fetchUrl}?${params.toString()}`;
  }, [fetchUrl, currentPage, limit, actionFilter, searchQuery]);

  const clearFilter = () => {
    handleSearchQuery("");
    handleActionFilterChange("");
  };

  const {
    data,
    isLoading: isLoadingFetch,
    refetch,
    pagination,
  } = usePaginatedData<Data[]>(paginatedUrl, []);

  const handleActionFilterChange = (type: string) => {
    setActionFilter(type);
    setIsOpenId("");
    setCurrentPage(1);
  };

  const handleSearchQuery = (searchQuery: string) => {
    setSearchQuery(searchQuery);
    setIsOpenId("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsOpenId("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLimitChange = (limit: number) => {
    setLimit(limit);
    setCurrentPage(1);
    setIsOpenId("");
    window.scroll({ top: 0, behavior: "smooth" });
  };

  const sortedData = useMemo(() => {
    if (!data) return [];

    return [...data].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [data]);

  return (
    <div
      className={`flex w-full flex-col items-center relative justify-center mt-4 shadow-sm bg-gray-700/70 m-2  rounded-lg p-1.5 select-none`}
    >
      <div className="flex flex-col items-center md:flex-row m-2 justify-center">
        <QueryFilter
          searchValue={searchQuery}
          actionValue={actionFilter}
          onSearchQueryChange={handleSearchQuery}
          onActionFilterChange={handleActionFilterChange}
          clearFilter={clearFilter}
          filterType="RATING"
          filterOn={filterOn}
        />

        <button
          onClick={() => setColorInfoOpen(!colorInfoOpen)}
          className="flex btn border border-gray-900/90 bg-gray-100/85 items-center rounded-2xl m-2 shadow-lg p-2 justify-center"
        >
          <FaInfoCircle size={25} />
        </button>
        <div
          className={`${colorInfoOpen ? "fixed" : "hidden"} bg-gray-800/95 p-5 bottom-20 rounded-2xl shadow-md shadow-white z-200 w-auto `}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="m-2 italic bg-gray-100 p-1 rounded-md  text-red-600">
                Data base keeps only last 1000 records of rating log.
              </h3>
              <h3 className="m-2 text-white">Color Definition of Cards</h3>
            </div>
            <button
              onClick={() => setColorInfoOpen(!colorInfoOpen)}
              className="absolute -top-12 right-0 btn border md:-top-4 flex md:relative border-gray-900/90 bg-gray-100/85 items-center rounded-2xl shadow-lg p-0.5 justify-center"
            >
              <IoIosCloseCircle size={32} />
            </button>
          </div>
          <div className="grid grid-cols-2">
            {Object.entries(RATING_ACTION_COLORS).map(
              ([status, colors], index) => (
                <div
                  key={index}
                  className={`${colors.bg} ${colors.border} ${colors.shadow} border shadow-md m-1 p-3 rounded-md`}
                >
                  {status}
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {isLoadingFetch ? (
        <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-10 justify-center">
          <ImSpinner9 className="animate-spin" size={25} />
        </div>
      ) : sortedData && sortedData?.length > 0 ? (
        sortedData?.map((item) => (
          <RatingCardVolunteer
            key={item.id}
            item={item}
            isOpenId={isOpenId}
            setIsOpenId={setIsOpenId}
          />
        ))
      ) : (
        <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-10 justify-center">
          <h3 className="font-bold">No Rating Records to display.</h3>
        </div>
      )}
      {pagination ? (
        <Pagination
          onLimitChange={handleLimitChange}
          onPageChange={handlePageChange}
          pagination={pagination}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default RatingRecordsListVolunteer;
