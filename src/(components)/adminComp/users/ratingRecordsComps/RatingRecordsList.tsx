import { useFetchData } from "@/hooks/useDataFetch";
import { useMemo, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import usePaginatedData from "@/hooks/usePaginatedData";
import Pagination from "@/(components)/generalComp/Pagination";
import QueryFilter from "@/(components)/generalComp/QueryFilter";
import { useParams } from "next/navigation";
import DeleteButtonAdmin from "../DeleteButtonAdmin";
import { ImSpinner9 } from "react-icons/im";
import RatingCard from "./RatingCard";

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

function RatingRecordsList({ fetchUrl }: { fetchUrl: string }) {
  const [isOpenId, setIsOpenId] = useState("");
  const [colorInfoOpen, setColorInfoOpen] = useState(false);
  const [onEdit, setOnEdit] = useState("");
  const { data: types, isLoadingFetch: isLoadingFetchTypes } =
    useFetchData<DataType>(`/api/admin/hrWarningTypes`, []);
  const params = useParams();
  const id = params.userId;

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOn, setFilterOn] = useState(false);
  const paginatedUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("limit", limit.toString());
    params.append("status", statusFilter.toString());
    params.append("type", typeFilter.toString());
    params.append("search", searchQuery.toString());

    const hasFilter = statusFilter || typeFilter || searchQuery;
    setFilterOn(!!hasFilter);

    return `${fetchUrl}?${params.toString()}`;
  }, [fetchUrl, currentPage, limit, statusFilter, typeFilter, searchQuery]);

  // const clearFilter = () => {
  //   handleSearchQuery("");
  //   handleTypeFilterChange("");
  //   handleStatusFilterChange("");
  // };

  const {
    data,
    isLoading: isLoadingFetch,
    refetch,
    pagination,
  } = usePaginatedData<Data[]>(paginatedUrl, []);

  // const handleStatusFilterChange = (status: string) => {
  //   setStatusFilter(status);
  //   setIsOpenId("");
  //   setOnEdit("");
  //   setCurrentPage(1);
  // };

  // const handleTypeFilterChange = (type: string) => {
  //   setTypeFilter(type);
  //   setIsOpenId("");
  //   setOnEdit("");
  //   setCurrentPage(1);
  // };

  // const handleSearchQuery = (searchQuery: string) => {
  //   setSearchQuery(searchQuery);
  //   setOnEdit("");
  //   setIsOpenId("");
  //   setCurrentPage(1);
  // };

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  //   setIsOpenId("");
  //   setOnEdit("");
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  // const handleLimitChange = (limit: number) => {
  //   setLimit(limit);
  //   setCurrentPage(1);
  //   setIsOpenId("");
  //   setOnEdit("");
  //   window.scroll({ top: 0, behavior: "smooth" });
  // };

  const sortedData = useMemo(() => {
    if (!data) return [];

    return [...data].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [data]);

  return (
    <div
      className={`flex w-full items-center justify-center xl:px-25 xl:py-5 px-2 flex-col`}
    >
      <div className="flex flex-col items-center md:flex-row m-2 justify-center">
        {/* <QueryFilter
          searchValue={searchQuery}
          statusValue={statusFilter}
          typeValue={typeFilter}
          clearFilter={clearFilter}
          typeData={types}
          onSearchQueryChange={handleSearchQuery}
          onStatusFilterChange={handleStatusFilterChange}
          onTypeFilterChange={handleTypeFilterChange}
          filterOn={filterOn}
        /> */}
        <div className="flex shadow-md shadow-white bg-gray-200/95 p-2 m-2 rounded-lg">
          <button
            onClick={() => setColorInfoOpen(!colorInfoOpen)}
            className="flex btn border border-gray-900/90 bg-gray-100/85 items-center rounded-2xl m-2 shadow-lg p-2 justify-center"
          >
            <FaInfoCircle size={30} />
          </button>
          {sortedData.length > 0 ? (
            <DeleteButtonAdmin
              extraTXT="All"
              url={`/api/admin/users/${id}/ratingHistory`}
              fetchAction={refetch}
              value={`All Rating Records for ${sortedData[0].user?.name}?`}
            />
          ) : null}
        </div>
        <div
          className={`${colorInfoOpen ? "fixed" : "hidden"} bg-gray-800/95 p-5 rounded-2xl shadow-lg shadow-white z-50 w-auto `}
        >
          <div className="flex items-center justify-between">
            <h3 className="m-2 text-white">Color Definition of Cards</h3>
            <button
              onClick={() => setColorInfoOpen(!colorInfoOpen)}
              className="flex btn border border-gray-900/90 bg-gray-100/85 items-center rounded-2xl shadow-lg p-0.5 justify-center"
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

      {isLoadingFetch || isLoadingFetchTypes ? (
        <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-10 justify-center">
          <ImSpinner9 className="animate-spin" size={25} />
        </div>
      ) : sortedData && sortedData?.length > 0 ? (
        sortedData?.map((item) => (
          <RatingCard
            item={item}
            isOpenId={isOpenId}
            onEdit={onEdit}
            setIsOpenId={setIsOpenId}
            setOnEdit={setOnEdit}
            refetch={refetch}
          />
        ))
      ) : (
        <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-10 justify-center">
          <h3 className="font-bold">No HR cases to display.</h3>
          <button className="btn" onClick={refetch}>
            Refetch
          </button>
        </div>
      )}
      {/* {pagination ? (
        <Pagination
          onLimitChange={handleLimitChange}
          onPageChange={handlePageChange}
          pagination={pagination}
        />
      ) : (
        ""
      )} */}
    </div>
  );
}

export default RatingRecordsList;
