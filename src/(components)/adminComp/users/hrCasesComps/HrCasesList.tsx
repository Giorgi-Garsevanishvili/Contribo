import HrCaseDeleteButton from "./HrCaseDeleteButton";

import { useFetchData } from "@/hooks/useDataFetch";
import { useEffect, useMemo, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import HrCaseUpdate from "./HrCaseUpdate";
import usePaginatedData from "@/hooks/usePaginatedData";
import Pagination from "@/(components)/generalComp/Pagination";

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

export const WARNING_STATUS_COLORS = {
  ACTIVE: {
    bg: "bg-red-100",
    border: "border-red-300",
    shadow: "shadow-red-200",
  },
  UNDER_REVIEW: {
    bg: "bg-yellow-100",
    border: "border-yellow-300",
    shadow: "shadow-yellow-200",
  },
  APPROVED: {
    bg: "bg-green-100",
    border: "border-green-300",
    shadow: "shadow-green-200",
  },
  ESCALATED: {
    bg: "bg-orange-100",
    border: "border-orange-300",
    shadow: "shadow-orange-200",
  },
  RESOLVED: {
    bg: "bg-blue-100",
    border: "border-blue-300",
    shadow: "shadow-blue-200",
  },
  CANCELLED: {
    bg: "bg-gray-100",
    border: "border-gray-300",
    shadow: "shadow-gray-200",
  },
  EXPIRED: {
    bg: "bg-purple-100",
    border: "border-purple-300",
    shadow: "shadow-purple-200",
  },
  ARCHIVED: {
    bg: "bg-slate-100",
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
  const { data: types, isLoadingFetch: isLoadingFetchTypes } = useFetchData<Data[]>(
    `/api/admin/hrWarningTypes`,
    [],
  );
  
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  
  const paginatedUrl = useMemo(() => {
    const params = new URLSearchParams()
    params.append("page", currentPage.toString())
    params.append("limit", limit.toString())
    
    return `${fetchUrl}?${params.toString()}`
  }, [fetchUrl, currentPage, limit])
  
  const { data, isLoading: isLoadingFetch, refetch, pagination } = usePaginatedData<Data[]>(paginatedUrl, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setIsOpenId("")
    setOnEdit("")
    window.scrollTo({top: 0, behavior: "smooth"})
  } 

  const sortedData = useMemo(() => {
    if (!data) return [];
    
    console.log(pagination,"Pagination");
    console.log(data,"data");
    
    return [...data].sort((a, b) => {
      const aIndex = TYPE_ORDER.indexOf(a.status);
      const bIndex = TYPE_ORDER.indexOf(b.status);

      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });
  }, [data]);

  useEffect(() => {
    if(data){
       console.log(pagination);
    console.log(data);
    }
  },[])

  return (
    <div
      className={`flex w-full items-center justify-center xl:px-25 xl:py-5 px-2 flex-col`}
    >
      <div className="flex items-start justify-center">
        <button
          onClick={() => setColorInfoOpen(!colorInfoOpen)}
          className="flex btn border border-gray-900/90 bg-gray-100/85 items-center rounded-2xl m-2 shadow-lg p-2 justify-center"
        >
          <FaInfoCircle size={30} />
        </button>
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
          <h3 className="font-bold animate-spin">.</h3>
        </div>
      ) : sortedData && sortedData?.length > 0 ? (
        sortedData?.map((item) => (
          <div
            className={`flex ${WARNING_STATUS_COLORS[item.status as keyof typeof WARNING_STATUS_COLORS].border} border flex-col transition-all duration-300 shadow-sm rounded-2xl m-1 p-0 justify-between w-full bg-gray-100/85`}
            key={item.id}
          >
            <button
              onClick={() => (
                setIsOpenId(() => (isOpenId !== item.id ? item.id : "")),
                setOnEdit("")
              )}
              className={`flex lg:flex-row  flex-col px-5 py-1.5 md:text-sm text-xs btn justify-between transition-all duration-300 w-full m-0 ${(item.status as keyof typeof WARNING_STATUS_COLORS) ? `${WARNING_STATUS_COLORS[item.status as keyof typeof WARNING_STATUS_COLORS].shadow} ${WARNING_STATUS_COLORS[item.status as keyof typeof WARNING_STATUS_COLORS].bg}` : WARNING_STATUS_COLORS.ARCHIVED} border shadow-lg mb-2`}
            >
              <h3>
                <strong>Assignee: </strong> {item.assignee.name}
              </h3>
              <h3>
                <strong>Case: </strong> {item.name}
              </h3>
              <h3>
                <strong>Status: </strong> {item.status}
              </h3>
              <h3>
                <strong>Type: </strong>
                {item.type.name}
              </h3>
              {isOpenId === item.id ? (
                <FaAngleUp className="animate-pulse" size={22} />
              ) : (
                <FaAngleDown className="animate-pulse" size={22} />
              )}
            </button>
            <div
              className={`${isOpenId === item.id ? "flex" : "hidden"} lg:flex-row flex-col w-full  items-center justify-center`}
            >
              <div className="flex  lg:flex-row flex-col w-full items-center justify-start p-3">
                <div
                  className={`flex grow ${(item.status as keyof typeof WARNING_STATUS_COLORS) ? `${WARNING_STATUS_COLORS[item.status as keyof typeof WARNING_STATUS_COLORS].border} ${WARNING_STATUS_COLORS[item.status as keyof typeof WARNING_STATUS_COLORS].bg}` : WARNING_STATUS_COLORS.ARCHIVED} border rounded-lg  md:flex-row flex-col items-center justify-center lg:py-10 w-full lg:px-10 p-4 m-2 gap-2`}
                >
                  <div className="flex-col w-full flex">
                    <h3>
                      <strong>Name: </strong>
                      {item.name}
                    </h3>
                    <h3>
                      <strong>Type: </strong>
                      {item.type.name}
                    </h3>
                    <h3>
                      <strong>Created At: </strong>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "No Data"}
                    </h3>
                    <h3>
                      <strong>Updated At: </strong>
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleString()
                        : "No Data"}
                    </h3>
                  </div>
                  <div className="flex-col w-full flex">
                    <h3>
                      <strong>Status: </strong>
                      {item.status}
                    </h3>
                    <h3>
                      <strong>Comment: </strong>
                      {item.comment}
                    </h3>
                    <h3>
                      <strong>Created By: </strong>
                      {item.createdBy?.name ?? "No Data"}
                    </h3>
                    <h3>
                      <strong>Updated By: </strong>
                      {item.updatedBy?.name ?? "No Data"}
                    </h3>
                  </div>
                </div>
                <div className={`${onEdit === item.id ? "flex" : "hidden"}`}>
                  <HrCaseUpdate refetch={refetch} id={item.id} extraData1={types} />
                </div>
              </div>
              <div className="flex p-1 md:m-4  lg:flex-col">
                <HrCaseDeleteButton
                  url={`/api/admin/hrWarnings/${item.id}`}
                  fetchAction={refetch}
                />
                <button
                  onClick={() => {
                    setOnEdit(onEdit === item.id ? "" : isOpenId);
                  }}
                  className={`btn grow`}
                >
                  {onEdit === item.id ? "Close" : "Edit"}
                </button>
              </div>
            </div>
            
          </div>
        ))
      ) : (
        <div className="flex bg-gray-100/60 items-center rounded-lg shadow-lg p-10 justify-center">
          <h3 className="font-bold">No HR cases to display.</h3>
          <button className="btn" onClick={refetch}>Refetch</button>
        </div>
      )}
      {pagination ? <Pagination onLimitChange={refetch} onPageChange={handlePageChange} pagination={pagination} /> : "" }
    </div>
  );
}

export default HrCasesList;
