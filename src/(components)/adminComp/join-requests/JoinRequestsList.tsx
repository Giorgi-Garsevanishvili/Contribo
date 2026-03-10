import Pagination from "@/(components)/generalComp/Pagination";
import { ReqStatus } from "@/generated/enums";
import usePaginatedData from "@/hooks/usePaginatedData";
import { useMemo, useState } from "react";
import JoinRequestCard from "./JoinRequestCard";
import JoinRequestTitleBar from "./JoinRequestTitleBar";

type Data = {
  id: string;
  region: {
    name: string;
  } | null;
  createdBy: {
    name: string | null;
    image: string | null;
  };
  status: ReqStatus;
  requestedAt: string;
};

function JoinRequestsList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const paginatedUrl = useMemo(() => {
    const searchParams = new URLSearchParams();
    searchParams.append("page", currentPage.toString());
    searchParams.append("limit", limit.toString());

    return `/api/admin/joinRequests?${searchParams.toString()}`;
  }, [limit, currentPage]);

  const {
    data,
    isLoading: isLoadingFetch,
    refetch,
    pagination,
  } = usePaginatedData<Data[]>(paginatedUrl, []);

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
        isLoadingFetch ? "" : " w-auto"
      } flex-col items-center justify-center mt-4 shadow-sm bg-gray-300/90 m-2  rounded-lg p-1.5 select-none`}
    >
        <JoinRequestTitleBar />
      <div className="flex w-full justify-center items-center flex-col">
        {data
          ? data.map((JoinData) => <JoinRequestCard joinData={JoinData} />)
          : "No Data To Display"}
      </div>
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

export default JoinRequestsList;
