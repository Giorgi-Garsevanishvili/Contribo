import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

function Pagination({
  pagination,
  onPageChange,
  onLimitChange,
}: {
  pagination: PaginationProps;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}) {
  const pageNumbersMobile: (number | string)[] = [];

  for (let i = 1; i <= pagination.totalPages; i++) {
    pageNumbersMobile.push(i);
  }

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (pagination.totalPages <= maxVisible) {
      for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, pagination.currentPage - 1);
      let end = Math.min(pagination.totalPages - 1, pagination.currentPage + 1);

      if (pagination.currentPage <= 3) {
        end = 4;
      }

      if (pagination.currentPage >= pagination.totalPages - 2) {
        start = pagination.totalPages - 3;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < pagination.totalPages - 1) {
        pages.push("...");
      }

      pages.push(pagination.totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center justify-center bg-gray-300/90 px-4 m-4 rounded-lg">
      <div className="text-sm mt-4 text-gray-600">
        Showing{" "}
        {Math.min(
          (pagination.currentPage - 1) * pagination.limit + 1,
          pagination.totalCount,
        )}{" "}
        to{" "}
        {Math.min(
          pagination.currentPage * pagination.limit,
          pagination.totalCount,
        )}{" "}
        of {pagination.totalCount} results
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={() => onPageChange(1)}
          className="btn rounded-lg border transition-colors bg-white"
          disabled={!pagination?.hasPrevPage}
        >
          <FaAngleDoubleLeft size={14} />
        </button>
        <button
          onClick={() => onPageChange(pagination.currentPage - 1)}
          className="btn rounded-lg border transition-colors bg-white"
          disabled={!pagination?.hasPrevPage}
        >
          <FaAngleLeft size={14} />
        </button>
        <div className="md:flex hidden p-2">
          {pageNumbers.map((page, index) => (
            <button
              className={`btn px-3 py-1 rounded-lg border transition-colors ${
                page === pagination.currentPage
                  ? "bg-blue-500 text-white border-blue-500"
                  : page === "..."
                    ? "cursor-default bg-white border-transparent"
                    : "bg-white hover:bg-gray-50"
              }`}
              disabled={page === "..."}
              onClick={() => typeof page === "number" && onPageChange(page)}
              key={index}
            >
              {page}
            </button>
          ))}
        </div>
        <div className="flex md:hidden">
          <select
            className="flex bg-white p-2 m-2 items-center justify-center rounded-lg"
            onChange={(e) => onPageChange(Number(e.target.value))}
            name="page"
            id="page"
          >
            {pageNumbersMobile.map((page, index) => (
              <option key={index} value={page}>
                {page}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => onPageChange(pagination.currentPage + 1)}
          className=" btn rounded-lg border transition-colors bg-white"
          disabled={!pagination?.hasNextPage}
        >
          <FaAngleRight size={14} />
        </button>
        <button
          onClick={() => onPageChange(pagination.totalPages)}
          className="btn rounded-lg border transition-colors bg-white"
          disabled={!pagination?.hasNextPage}
        >
          <FaAngleDoubleRight size={14} />
        </button>
      </div>
      <div className="m-2 bg-gray-100 rounded-2xl p-1 flex items-center justify-center">
        <h3 className="m-1">Set Data Limit:</h3>
        <select className="rounded-2xl border p-1" defaultValue={10} onChange={(e) => onLimitChange(Number(e.target.value))} name="limit" id="limit">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
        </select>
      </div>
    </div>
  );
}

export default Pagination;
