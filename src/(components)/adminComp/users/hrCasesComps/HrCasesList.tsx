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
import HrCaseCard from "./HrCaseCard";

type Data = {
  id: string;
  name: string;
  status: string;
  comment: string;
  updatedAt: string | null;
  createdAt: string | null;
  createdBy: { name: string } | null;
  updatedBy: { name: string } | null;
  type: { name: string };
  assignee: {
    name: string;
  };
};

type DataType = {
  createdAt: string;
  id: string;
  name: string;
  type: string;
  updatedAt: string;
}[];

export const WARNING_STATUS_COLORS = {
  ACTIVE: {
    bg: "bg-[#00aeef]/20",
    border: "border-[#00aeef]",
    shadow: "shadow-[#00aeef]",
  },
  UNDER_REVIEW: {
    bg: "bg-[#f47b20]/20",
    border: "border-[#f47b20]",
    shadow: "shadow-[#f47b20]",
  },
  ESCALATED: {
    bg: "bg-[#ec008c]/20",
    border: "border-[#ec008c]",
    shadow: "shadow-[#ec008c]",
  },
  APPROVED: {
    bg: "bg-[#7ac143]/20",
    border: "border-[#7ac143]",
    shadow: "shadow-[#7ac143]",
  },
  RESOLVED: {
    bg: "bg-[#2e3192]/20",
    border: "border-[#2e3192]",
    shadow: "shadow-[#2e3192]",
  },
  CANCELLED: {
    bg: "bg-black/20",
    border: "border-black",
    shadow: "shadow-black",
  },
  EXPIRED: {
    bg: "bg-gray-400/20",
    border: "border-gray-400",
    shadow: "shadow-gray-300",
  },
  ARCHIVED: {
    bg: "bg-slate-100/20",
    border: "border-slate-300",
    shadow: "shadow-slate-200",
  },
} as const;

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

export type WarningStatus = keyof typeof WARNING_STATUS_COLORS;

function HrCasesList({ fetchUrl }: { fetchUrl: string }) {
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
    const searchParams = new URLSearchParams();
    searchParams.append("page", currentPage.toString());
    searchParams.append("limit", limit.toString());
    searchParams.append("status", statusFilter.toString());
    searchParams.append("type", typeFilter.toString());
    searchParams.append("search", searchQuery.toString());

    const hasFilter = statusFilter || typeFilter || searchQuery;
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
    setIsOpenId("");
    setOnEdit("");
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (type: string) => {
    setTypeFilter(type);
    setIsOpenId("");
    setOnEdit("");
    setCurrentPage(1);
  };

  const handleSearchQuery = (searchQuery: string) => {
    setSearchQuery(searchQuery);
    setOnEdit("");
    setIsOpenId("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsOpenId("");
    setOnEdit("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLimitChange = (limit: number) => {
    setLimit(limit);
    setCurrentPage(1);
    setIsOpenId("");
    setOnEdit("");
    window.scroll({ top: 0, behavior: "smooth" });
  };

  const sortedData = useMemo(() => {
    if (!data) return [];

    return [...data].sort((a, b) => {
      const aIndex = TYPE_ORDER.indexOf(a.status);
      const bIndex = TYPE_ORDER.indexOf(b.status);

      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });
  }, [data]);

  return (
    <div
      className={`flex w-full items-center justify-center xl:px-25 xl:py-5 px-2 flex-col`}
    >
      <div className="flex flex-col items-center md:flex-row m-2 justify-center">
        <QueryFilter
          searchValue={searchQuery}
          statusValue={statusFilter}
          typeValue={typeFilter}
          clearFilter={clearFilter}
          typeData={types}
          onSearchQueryChange={handleSearchQuery}
          onStatusFilterChange={handleStatusFilterChange}
          onTypeFilterChange={handleTypeFilterChange}
          filterOn={filterOn}
        />
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
              url={`/api/admin/users/${id}/hrWarning`}
              fetchAction={refetch}
              value={`All HR warnings for ${sortedData[0].assignee.name}?`}
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
            {Object.entries(WARNING_STATUS_COLORS).map(
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
          <ImSpinner9 className="animate-spin" size={40} />
        </div>
      ) : sortedData && types && sortedData?.length > 0 ? (
        sortedData?.map((item) => (
          <HrCaseCard
            key={item.id}
            item={item}
            types={types}
            setOnEdit={setOnEdit}
            setIsOpenId={setIsOpenId}
            onEdit={onEdit}
            isOpenId={isOpenId}
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

export default HrCasesList;
